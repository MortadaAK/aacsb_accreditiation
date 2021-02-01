// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.8.0;
pragma abicoder v2;
enum Degree {
    ScholarlyAcademics,
    PracticeAcademics,
    ScholarlyPractitioner,
    InstructionalPractitioner
}

contract Certificate {
    enum State {requested, approved, rejected}

    Faculty public faculty;
    Institution public institution;
    Degree public degree;
    State public status = State.requested;
    CertificatesManager certificatesManager;

    constructor(
        CertificatesManager _certificatesManager,
        Faculty _faculty,
        Institution _institution,
        Degree _degree
    ) {
        certificatesManager = _certificatesManager;
        faculty = _faculty;
        institution = _institution;
        degree = _degree;
    }

    function reject() public payable {
        if (editable(msg.sender)) {
            status = State.rejected;
            certificatesManager
                .application()
                .certificatesManager()
                .removeCertificate(this);
            certificatesManager.application().emitEvent(
                "REJEcT_CERTIFICATE",
                "CERTIFICATE",
                address(this)
            );
        }
    }

    function approve() public payable {
        if (editable(msg.sender) && institution.allowed(msg.sender)) {
            status = State.approved;
            faculty.addCertificate(this, msg.sender);
            institution.addCertificate(this, msg.sender);
            certificatesManager
                .application()
                .certificatesManager()
                .removeCertificate(this);
            certificatesManager.application().emitEvent(
                "APPROVE_CERTIFICATE",
                "CERTIFICATE",
                address(this)
            );
        }
    }

    function editable(address _address) public view returns (bool) {
        return status == State.requested && institution.allowed(_address);
    }
}

contract Faculty {
    uint256 id;
    string public name;
    address public owner;
    Certificate[] public certificates;
    Institution public currentInstitution;
    FacultiesManager facultiesManager;

    constructor(
        FacultiesManager _facultiesManager,
        uint256 _id,
        string memory _name,
        address _owner
    ) {
        facultiesManager = _facultiesManager;
        name = _name;
        id = _id;
        owner = _owner;
    }

    function update(string memory _name) public payable {
        if (allowed(msg.sender)) {
            name = _name;
            facultiesManager.application().emitEvent(
                "UPDATE_FACULTY",
                "FACULTY",
                address(this)
            );
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

    function addCertificate(Certificate _certificate, address _address)
        public
        payable
    {
        if (
            _certificate.institution().allowed(_address) &&
            _certificate.status() == Certificate.State.approved &&
            _certificate.faculty() == this
        ) {
            certificates.push(_certificate);
            facultiesManager.application().emitEvent(
                "ADD_CERTIFICATE",
                "FACULTY",
                address(this)
            );
        }
    }

    function certificatesLength() public view returns (uint256) {
        return certificates.length;
    }

    function listCertificates(uint256 _from)
        public
        view
        returns (Certificate[10] memory)
    {
        Certificate[10] memory list;
        for (uint256 i = 0; i < 10 && i + _from < certificates.length; i++) {
            list[i] = certificates[i + _from];
        }
        return list;
    }

    function pendingCertificatesLength() public view returns (uint256) {
        return
            facultiesManager
                .application()
                .certificatesManager()
                .pendingCertificateLengthForFaculty(this);
    }

    function pendingCertificates(uint256 _from)
        public
        view
        returns (Certificate[10] memory)
    {
        return
            facultiesManager
                .application()
                .certificatesManager()
                .pendingCertificateForFaculty(this, _from);
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

    Certificate[] certificates;
    InstituionsManager instituionsManager;
    address[] public allowedModifiers;
    mapping(address => bool) allowedModifiersMap;

    mapping(uint256 => StaffMember) staffMembers;
    uint256 nextStaffMembersId = 1;

    mapping(uint256 => Faculty) faculties;
    uint256 nextFacultyId;

    constructor(
        InstituionsManager _instituionsManager,
        uint256 _id,
        string memory _name,
        address sender
    ) {
        instituionsManager = _instituionsManager;
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
        for (uint256 i = 0; i < 10 && nextStaffMembersId < i + _from + 1; i++) {
            if (skipInactive && !staffMembers[i + _from + 1].active) {
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
            instituionsManager.application().emitEvent(
                "ADD_STAFF_MEMBER_INSTITUTION",
                "INSTITUTION",
                address(this)
            );
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
            instituionsManager.application().emitEvent(
                "UPDATE_STAFF_MEMBER_INSTITUTION",
                "INSTITUTION",
                address(this)
            );
        }
    }

    function listModifiers(uint256 _from)
        public
        view
        returns (address[10] memory)
    {
        address[10] memory list;
        for (
            uint256 i = 0;
            i < 10 && i + _from < allowedModifiers.length;
            i++
        ) {
            list[i] = allowedModifiers[i + _from];
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
            instituionsManager.application().emitEvent(
                "ADD_MODIFIER_INSTITUTION",
                "INSTITUTION",
                address(this)
            );
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
            instituionsManager.application().emitEvent(
                "REMOVE_MODIFIER_INSTITUTION",
                "INSTITUTION",
                address(this)
            );
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

    function addCertificate(Certificate _certificate, address _address)
        public
        payable
    {
        if (
            allowed(_address) &&
            _certificate.status() == Certificate.State.approved &&
            _certificate.institution() == this
        ) {
            certificates.push(_certificate);
            instituionsManager.application().emitEvent(
                "ADD_CERTIFICATE_INSTITUTION",
                "INSTITUTION",
                address(this)
            );
        }
    }

    function issuedCertificates(uint256 _from)
        public
        view
        returns (Certificate[10] memory)
    {
        Certificate[10] memory _list;
        uint256 _count = 0;
        for (uint256 i = _from; i < certificates.length && _count < 10; i++) {
            _list[_count] = certificates[i];
            _count++;
        }
        return _list;
    }

    function issuedCertificatesLength() public view returns (uint256) {
        return certificates.length;
    }

    function pendingCertificatesLength() public view returns (uint256) {
        return
            instituionsManager
                .application()
                .certificatesManager()
                .pendingCertificateLengthForInstitution(this);
    }

    function pendingCertificates(uint256 _from)
        public
        view
        returns (Certificate[10] memory)
    {
        return
            instituionsManager
                .application()
                .certificatesManager()
                .pendingCertificateForInstitution(this, _from);
    }
}

contract CertificatesManager {
    Certificate[] pendingCertificates;
    Application public application;

    constructor(Application _application) {
        application = _application;
    }

    function requestCertificate(
        Faculty _faculty,
        Institution _institution,
        Degree _degree
    ) public payable {
        Certificate _certificate =
            new Certificate(this, _faculty, _institution, _degree);
        pendingCertificates.push(_certificate);
        application.emitEvent(
            "REQUEST_CERTIFICATE",
            "INSTITUTION",
            address(_institution)
        );
        application.emitEvent(
            "REQUEST_CERTIFICATE",
            "FACULTY",
            address(_faculty)
        );
    }

    function removeCertificate(Certificate _certificate) public payable {
        for (uint256 i = 0; i < pendingCertificates.length; i++) {
            if (pendingCertificates[i] == _certificate) {
                uint256 _lastIndex = pendingCertificates.length - 1;
                if (i < _lastIndex) {
                    pendingCertificates[i] = pendingCertificates[_lastIndex];
                }
                pendingCertificates.pop();
            }
        }
        application.emitEvent(
            "CERTIFICATE_REMOVE",
            "INSTITUTION",
            address(_certificate.institution())
        );
        application.emitEvent(
            "CERTIFICATE_REMOVE",
            "FACULTY",
            address(_certificate.faculty())
        );
    }

    function pendingCertificateLengthForFaculty(Faculty _faculty)
        public
        view
        returns (uint256)
    {
        uint256 _count = 0;
        for (uint256 i = 0; i < pendingCertificates.length; i++) {
            if (pendingCertificates[i].faculty() == _faculty) {
                _count++;
            }
        }
        return _count;
    }

    function pendingCertificateForFaculty(Faculty _faculty, uint256 _from)
        public
        view
        returns (Certificate[10] memory)
    {
        Certificate[10] memory _list;
        uint256 _count = 0;
        uint256 _toSkip = 0;
        for (
            uint256 i = 0;
            i < pendingCertificates.length && _count <= 10;
            i++
        ) {
            if (pendingCertificates[i].faculty() == _faculty) {
                if (_toSkip >= _from) {
                    _list[_count] = pendingCertificates[i];
                    _count++;
                }
                _toSkip++;
            }
        }
        return _list;
    }

    function pendingCertificateLengthForInstitution(Institution _institution)
        public
        view
        returns (uint256)
    {
        uint256 _count = 0;
        for (uint256 i = 0; i < pendingCertificates.length; i++) {
            if (pendingCertificates[i].institution() == _institution) {
                _count++;
            }
        }
        return _count;
    }

    function pendingCertificateForInstitution(
        Institution _institution,
        uint256 _from
    ) public view returns (Certificate[10] memory) {
        Certificate[10] memory _list;
        uint256 _count = 0;
        uint256 _toSkip = 0;
        for (
            uint256 i = 0;
            i < pendingCertificates.length && _count <= 10;
            i++
        ) {
            if (pendingCertificates[i].institution() == _institution) {
                if (_toSkip >= _from) {
                    _list[_count] = pendingCertificates[i];
                    _count++;
                }
                _toSkip++;
            }
        }
        return _list;
    }
}

contract FacultiesManager {
    Application public application;
    mapping(address => Faculty) public faculties;
    mapping(uint256 => Faculty) facultiesByIndex;
    uint256 nextFacultyId = 0;

    constructor(Application _application) {
        application = _application;
    }

    function facultiesLength() public view returns (uint256) {
        return nextFacultyId;
    }

    function createFaculty(string memory _name) public payable {
        if (address(faculties[msg.sender]) == address(0x0)) {
            uint256 _id = nextFacultyId++;
            Faculty faculty = new Faculty(this, _id, _name, msg.sender);
            facultiesByIndex[_id] = faculty;
            faculties[msg.sender] = faculty;
            application.emitEvent(
                "CREATE_FACULTY",
                "FACULTY",
                address(faculty)
            );
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
}

contract InstituionsManager {
    Application public application;
    mapping(uint256 => Institution) public institutions;
    uint256 nextInstitutionId = 0;

    constructor(Application _application) {
        application = _application;
    }

    function institutionsLength() public view returns (uint256) {
        return nextInstitutionId;
    }

    function createInstitution(string memory _name) public payable {
        uint256 _id = nextInstitutionId++;
        Institution _institution =
            new Institution(this, _id, _name, msg.sender);
        institutions[_id] = _institution;
        application.emitEvent(
            "CREATE_INSTITUTION",
            "INSTITUTION",
            address(_institution)
        );
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
}

contract Application {
    /*
    Application is the root contract that the UI will use to interact with sub contracts 
    */
    CertificatesManager public certificatesManager;
    FacultiesManager public facultiesManager;
    InstituionsManager public instituionsManager;
    event ApplicationEvent(
        string eventType,
        string targetType,
        address targetAddress
    );

    constructor() {
        certificatesManager = new CertificatesManager(this);
        facultiesManager = new FacultiesManager(this);
        instituionsManager = new InstituionsManager(this);
    }

    function emitEvent(
        string memory eventType,
        string memory targetType,
        address targetAddress
    ) public payable {
        emit ApplicationEvent(eventType, targetType, targetAddress);
    }
}
