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
    Application application;
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

    function reject() public payable {
        if (editable()) {
            status = State.rejected;
            emit Reject(msg.sender);
        }
    }

    function approve() public payable {
        if (editable() && institution.allowed(msg.sender)) {
            status = State.approved;
            faculty.addCertificate(this);
            institution.addCertificate(this);
            application.removeCertificate(this);
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

    function update(string memory _name) public payable {
        if (allowed(msg.sender)) {
            name = _name;
        }
    }

    function assignInstitution(address _institutionAddress) public payable {
        Institution _institution = Institution(_institutionAddress);
        if (_institution.allowed(msg.sender)) {
            currentInstitution = _institution;
        }
    }

    function allowed(address _address) public view returns (bool) {
        return _address == owner;
    }

    function addCertificate(Certificate _certificate) public payable {
        if (_certificate.institution().allowed(msg.sender)) {
            certificates.push(_certificate);
            emit CertificateAdded(msg.sender, _certificate);
        }
    }
}

contract Institution {
    struct StaffMember {
        uint256 id;
        string name;
        bool active;
    }

    uint256 public id;
    string public name;
    address public owner;

    Certificate[] public issuedCertificates;

    address[] public allowedModifiers;
    mapping(address => bool) allowedModifiersMap;

    mapping(uint256 => StaffMember) staffMembers;
    uint256 nextStaffMembersId = 1;

    mapping(uint256 => Certificate) certificates;
    uint256 nextCertificateId = 0;

    mapping(uint256 => Faculty) faculties;
    uint256 nextFacultyId;

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

    function update(string memory _name) public payable {
        if (allowed(msg.sender)) {
            name = _name;
        }
    }

    function staffMember(uint256 _from)
        public
        view
        returns (StaffMember memory)
    {
        return staffMembers[_from];
    }

    function listStaffMembers(uint256 _from, bool skipInactive)
        public
        view
        returns (StaffMember[10] memory)
    {
        StaffMember[10] memory list;
        for (uint256 i = 0; i < 10; i++) {
            if (nextStaffMembersId < i + _from + 1) {
                i = 10;
            } else if (skipInactive && !staffMembers[i + _from + 1].active) {
                _from++;
                i--;
            } else {
                list[i] = staffMembers[i + _from + 1];
            }
        }
        return list;
    }

    function staffMembersLength() public view returns (uint256) {
        return nextStaffMembersId - 1;
    }

    function createStaffMember(string memory _name) public payable {
        if (allowed(msg.sender)) {
            uint256 _nextStaffMemberId = nextStaffMembersId++;
            StaffMember storage _staffMember = staffMembers[_nextStaffMemberId];
            _staffMember.id = _nextStaffMemberId;
            _staffMember.name = _name;
            _staffMember.active = true;
        }
    }

    function updateStaffMember(
        uint256 _staffMemberId,
        string memory _name,
        bool _active
    ) public payable {
        if (allowed(msg.sender)) {
            StaffMember storage _staffMember = staffMembers[_staffMemberId];
            _staffMember.name = _name;
            _staffMember.active = _active;
        }
    }

    function listModifiers(uint256 _from)
        public
        view
        returns (address[10] memory)
    {
        address[10] memory list;
        for (uint256 i = 0; i < 10; i++) {
            if (i + _from >= allowedModifiers.length) {
                i = 10;
            } else {
                list[i] = allowedModifiers[i + _from];
            }
        }
        return list;
    }

    function modifiersLength() public view returns (uint256) {
        return allowedModifiers.length;
    }

    function addModifier(address _modifier) public payable {
        if (allowed(msg.sender) && !allowedModifiersMap[_modifier]) {
            allowedModifiers.push(_modifier);
            allowedModifiersMap[_modifier] = true;
            emit ModifierAdded(msg.sender, _modifier);
        }
    }

    function removeModifier(address _modifier) public payable {
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

    function addCertificate(Certificate _certificate) public payable {
        if (
            allowed(msg.sender) &&
            _certificate.status() == Certificate.State.approved &&
            _certificate.institution() == this
        ) {
            issuedCertificates.push(_certificate);
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

    mapping(uint256 => Certificate[]) pendingCertificates;

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
        for (uint256 i = 0; i < 10; i++) {
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
        for (uint256 i = 0; i < 10; i++) {
            list[i] = facultiesByIndex[i + _from];
        }
        return list;
    }

    function facultiesLength() public view returns (uint256) {
        return nextFacultyId;
    }

    function removeCertificate(Certificate _certificate) public payable {
        uint256 _instituionId = _certificate.institution().id();
        Certificate[] storage _pendingCertificates =
            pendingCertificates[_instituionId];
        for (uint256 i = 0; i < _pendingCertificates.length; i++) {
            if (_pendingCertificates[i] == _certificate) {
                uint256 _lastIndex = _pendingCertificates.length - 1;
                if (i < _lastIndex) {
                    _pendingCertificates[i] = _pendingCertificates[_lastIndex];
                }
                _pendingCertificates.pop();
            }
        }
    }
}
