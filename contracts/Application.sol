// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.9.0;
pragma abicoder v2;

contract Certificate {
    enum State {requested, approved, rejected}
    enum Degree {
        ScholarlyAcademics,
        PracticeAcademics,
        ScholarlyPractitioner,
        InstructionalPractitioner
    }
    string public specialtyField;
    Faculty public faculty;
    Institution public institution;
    Degree public degree;
    State public status = State.requested;
    event Request(address sender);
    event Reject(address sender);
    event Approve(address sender);

    constructor(
        Faculty _faculty,
        Institution _institution,
        Degree _degree
    ) {
        faculty = _faculty;
        institution = _institution;
        degree = _degree;
        emit Request(msg.sender);
    }

    function reject() public {
        if (editable()) {
            status = State.rejected;
            emit Reject(msg.sender);
        }
    }

    function approve() public {
        if (editable() && institution.allowed(msg.sender)) {
            status = State.approved;
            faculty.addCertificate(this);
            emit Approve(msg.sender);
        }
    }

    function editable() public view returns (bool) {
        return ((status == State.requested &&
            (institution.allowed(msg.sender))) || faculty.allowed(msg.sender));
    }
}

contract Faculty {
    uint256 id;
    string public name;
    uint16 public yearEnded;
    string public qualificationDescription;
    uint16 public teachingProductivity;
    uint16 public productivityPercentage;
    address public owner;
    Certificate[] public certificates;
    Institution public currentInstitution;

    event CertificateAdded(address assigner, Certificate certificate);

    constructor(
        uint256 _id,
        string memory _name,
        address _owner
    ) {
        name = _name;
        id = _id;
        owner = _owner;
    }

    function update(
        string memory _name,
        uint16 _yearEnded,
        string memory _qualificationDescription,
        uint16 _teachingProductivity,
        uint16 _productivityPercentage
    ) public {
        if (allowed(msg.sender)) {
            name = _name;
            yearEnded = _yearEnded;
            qualificationDescription = _qualificationDescription;
            teachingProductivity = _teachingProductivity;
            productivityPercentage = _productivityPercentage;
        }
    }

    function assignInstitution(address _institutionAddress) public {
        Institution _institution = Institution(_institutionAddress);
        if (_institution.allowed(msg.sender)) {
            currentInstitution = _institution;
        }
    }

    function allowed(address _address) public view returns (bool) {
        return _address == owner;
    }

    function addCertificate(Certificate _certificate) public {
        if (_certificate.institution().allowed(msg.sender)) {
            certificates.push(_certificate);
            emit CertificateAdded(msg.sender, _certificate);
        }
    }
}

contract Institution {
    struct Department {
        uint256 id;
        string name;
        mapping(uint256 => Faculty) faculties;
        uint256 nextFacultyId;
    }

    struct PublicDepartment {
        uint256 id;
        string name;
    }

    uint256 public id;
    string public name;
    address public owner;
    address[] public allowedModifiers;
    mapping(address => bool) allowedModifiersMap;

    mapping(uint256 => Department) departments;
    uint256 nextDepartmentId = 1;

    mapping(uint256 => Certificate) certificates;
    uint256 nextCertificateId = 0;

    event ModifierAdded(address by, address modifierAddress);
    event ModifierRemoved(address by, address modifierAddress);

    constructor(
        uint256 _id,
        string memory _name,
        address sender
    ) {
        id = _id;
        name = _name;
        owner = sender;
        allowedModifiers.push(sender);
        allowedModifiersMap[sender] = true;
    }

    function update(string memory _name) public {
        if (allowed(msg.sender)) {
            name = _name;
        }
    }

    function createDepartment(string memory _name) public {
        if (allowed(msg.sender)) {
            uint256 _nextDepartmentId = nextDepartmentId++;
            Department storage _department = departments[_nextDepartmentId];
            _department.id = _nextDepartmentId;
            _department.name = _name;
            _department.nextFacultyId = 0;
        }
    }

    function updateDepartment(uint256 _departmentId, string memory _name)
        public
    {
        if (allowed(msg.sender)) {
            Department storage _department = departments[_departmentId];
            _department.name = _name;
        }
    }

    function department(uint256 _from)
        public
        view
        returns (PublicDepartment memory)
    {
        return
            PublicDepartment({
                id: departments[_from].id,
                name: departments[_from].name
            });
    }

    function listDepartments(uint256 _from)
        public
        view
        returns (PublicDepartment[10] memory)
    {
        PublicDepartment[10] memory list;
        for (uint256 i = 1; i + _from < nextDepartmentId; i++) {
            list[i - 1] = PublicDepartment({
                id: departments[i].id,
                name: departments[i].name
            });
        }
        return list;
    }

    function departmentsLength() public view returns (uint256) {
        return nextDepartmentId - 1;
    }

    function listModifiers(uint256 _from)
        public
        view
        returns (address[10] memory)
    {
        address[10] memory list;
        for (uint256 i = 0; i + _from < allowedModifiers.length; i++) {
            list[i] = allowedModifiers[i + _from];
        }
        return list;
    }

    function addModifier(address _modifier) public {
        if (allowed(msg.sender) && !allowedModifiersMap[_modifier]) {
            allowedModifiers.push(_modifier);
            allowedModifiersMap[_modifier] = true;
            emit ModifierAdded(msg.sender, _modifier);
        }
    }

    function removeModifier(address _modifier) public {
        if (allowedToRemove(msg.sender, _modifier)) {
            for (uint256 i = 0; i < allowedModifiers.length; i++) {
                if (allowedModifiers[i] == _modifier) {
                    uint256 _lastIndex = allowedModifiers.length - 1;
                    if (i < _lastIndex) {
                        allowedModifiers[i] = allowedModifiers[_lastIndex];
                    }
                    allowedModifiers.pop();
                }
            }
            delete allowedModifiersMap[_modifier];
            emit ModifierRemoved(msg.sender, _modifier);
        }
    }

    function allowedToRemove(address _sender, address _toRemove)
        public
        view
        returns (bool)
    {
        if (allowed(_sender)) {
            if (_sender == _toRemove) {
                return false;
            } else if (_toRemove == owner) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    function allowed(address _modifierAddress) public view returns (bool) {
        return allowed(_modifierAddress, 0);
    }

    function allowed(address modifierAddress, uint256 index)
        private
        view
        returns (bool)
    {
        if (modifierAddress == allowedModifiers[index]) {
            return true;
        } else if (index < allowedModifiers.length - 1) {
            return allowed(modifierAddress, index + 1);
        } else {
            return false;
        }
    }
}

contract Application {
    /*
    Application is the root contract that the UI will use to interact with sub contracts 
    */

    mapping(uint256 => Institution) public institutions;
    uint256 nextInstitutionId = 0;
    mapping(address => Faculty) public faculties;
    mapping(uint256 => Faculty) facultiesByIndex;
    uint256 nextFacultyId = 0;

    function createInstitution(string memory _name) public payable {
        uint256 _id = nextInstitutionId++;
        Institution _institution = new Institution(_id, _name, msg.sender);
        institutions[_id] = _institution;
    }

    function listInstitutions(uint256 _from)
        public
        view
        returns (Institution[10] memory)
    {
        Institution[10] memory list;
        for (uint256 i = 0; i + _from < nextInstitutionId; i++) {
            list[i] = institutions[i + _from];
        }
        return list;
    }

    function institutionsLength() public view returns (uint256) {
        return nextInstitutionId;
    }

    function createFaculty(string memory _name) public payable {
        if (address(faculties[msg.sender]) == address(0x0)) {
            uint256 _id = nextFacultyId++;
            Faculty faculty = new Faculty(_id, _name, msg.sender);
            facultiesByIndex[_id] = faculty;
            faculties[msg.sender] = faculty;
        }
    }

    function listFaculties(uint256 _from)
        public
        view
        returns (Faculty[10] memory)
    {
        Faculty[10] memory list;
        for (uint256 i = 0; i + _from < nextFacultyId; i++) {
            list[i] = facultiesByIndex[i + _from];
        }
        return list;
    }

    function facultiesLength() public view returns (uint256) {
        return nextFacultyId;
    }
}
