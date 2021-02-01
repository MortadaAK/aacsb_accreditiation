const { assert } = require("chai");

const Application = artifacts.require("Application");
const Faculty = artifacts.require("Faculty");
const Institution = artifacts.require("Institution");
const Certificate = artifacts.require("Certificate");
const CertificatesManager = artifacts.require("CertificatesManager");
const FacultiesManager = artifacts.require("FacultiesManager");
const InstituionsManager = artifacts.require("InstituionsManager");
const EMPTY = "0x0000000000000000000000000000000000000000";

contract("Application", async (accounts) => {
  let instance;
  let certificatesManager;
  let facultiesManager;
  let instituionsManager;
  beforeEach(async () => {
    instance = await Application.new();
    certificatesManager = await CertificatesManager.at(
      await instance.certificatesManager()
    );
    facultiesManager = await FacultiesManager.at(
      await instance.facultiesManager()
    );
    instituionsManager = await InstituionsManager.at(
      await instance.instituionsManager()
    );
  });
  it("can create institution", async () => {
    await instituionsManager.createInstitution("PMU", {
      from: accounts[0],
    });
    let address = await instituionsManager.institutions(0);
    let institution = await Institution.at(address);
    let name = await institution.name();
    assert.equal(name, "PMU");
    let owner = await institution.owner();
    assert.equal(owner, accounts[0]);
    let allowedModifiers = await institution.allowedModifiers(0);
    assert.equal(allowedModifiers, accounts[0]);
  });

  it("returns list of instituions", async () => {
    await Promise.all([
      instituionsManager.createInstitution("PMU 1", {
        from: accounts[0],
      }),
      instituionsManager.createInstitution("PMU 2", {
        from: accounts[0],
      }),
    ]);
    let address1 = await instituionsManager.institutions(0);
    let address2 = await instituionsManager.institutions(1);
    let address3 = await instituionsManager.institutions(2);
    let addresses = await instituionsManager.listInstitutions(0);
    assert.equal(addresses.length, 10);
    assert.equal(address1, addresses[0]);
    assert.equal(address2, addresses[1]);
    assert.equal(address3, addresses[2]);
    assert.equal(EMPTY, addresses[3]);
    assert.equal(EMPTY, addresses[4]);
    assert.equal(EMPTY, addresses[5]);
    assert.equal(EMPTY, addresses[6]);
    assert.equal(EMPTY, addresses[7]);
    assert.equal(EMPTY, addresses[8]);
    assert.equal(EMPTY, addresses[9]);
  });

  it("returns instituions length", async () => {
    await Promise.all([
      instituionsManager.createInstitution("PMU 1", {
        from: accounts[0],
      }),
      instituionsManager.createInstitution("PMU 2", {
        from: accounts[0],
      }),
    ]);
    let length = await instituionsManager.institutionsLength();
    assert.equal(length, 2);
  });

  it("can create faculty", async () => {
    await facultiesManager.createFaculty("Mortada", {
      from: accounts[0],
    });
    let address = await facultiesManager.faculties(accounts[0]);
    let faculty = await Faculty.at(address);
    let name = await faculty.name();
    assert.equal(name, "Mortada");
    let owner = await faculty.owner();
    assert.equal(owner, accounts[0]);
  });

  it("returns faculties length", async () => {
    await facultiesManager.createFaculty("Mohammad", {
      from: accounts[4],
    });
    await facultiesManager.createFaculty("Ali", {
      from: accounts[5],
    });
    let length = await facultiesManager.facultiesLength();
    assert.equal(length, 2);
  });

  it("returns pending certificates length for a faculty", async () => {
    const from = { from: accounts[0] };
    await facultiesManager.createFaculty("Mohammad", from);
    await instituionsManager.createInstitution("PMU", from);
    const [faculty] = await facultiesManager.listFaculties(0);
    const [institution] = await instituionsManager.listInstitutions(0);
    assert.equal(
      0,
      await certificatesManager.pendingCertificateLengthForFaculty(faculty)
    );
    await certificatesManager.requestCertificate(faculty, institution, 0, from);
    assert.equal(
      1,
      await certificatesManager.pendingCertificateLengthForFaculty(faculty)
    );
  });
  it("returns pending certificates for a faculty", async () => {
    const from = { from: accounts[0] };
    await facultiesManager.createFaculty("Mohammad", from);
    await instituionsManager.createInstitution("PMU", from);
    const [faculty] = await facultiesManager.listFaculties(0);
    const [institution] = await instituionsManager.listInstitutions(0);
    await certificatesManager.requestCertificate(faculty, institution, 0, from);
    await certificatesManager.requestCertificate(faculty, institution, 0, from);
    await certificatesManager.requestCertificate(faculty, institution, 0, from);
    await certificatesManager.requestCertificate(faculty, institution, 0, from);
    await certificatesManager.requestCertificate(faculty, institution, 0, from);
    await certificatesManager.requestCertificate(faculty, institution, 0, from);
    await certificatesManager.requestCertificate(faculty, institution, 0, from);
    await certificatesManager.requestCertificate(faculty, institution, 0, from);
    await certificatesManager.requestCertificate(faculty, institution, 0, from);
    await certificatesManager.requestCertificate(faculty, institution, 0, from);
    await certificatesManager.requestCertificate(faculty, institution, 0, from);
    await certificatesManager.requestCertificate(faculty, institution, 0, from);
    let certificates = await certificatesManager.pendingCertificateForFaculty(
      faculty,
      0
    );
    assert(certificates.filter((c) => c !== EMPTY).length, 10);
    certificates = await certificatesManager.pendingCertificateForFaculty(
      faculty,
      10
    );
    assert(certificates.filter((c) => c !== EMPTY).length, 2);
  });
  it("returns pending certificates length for an institution", async () => {
    const from = { from: accounts[0] };
    await facultiesManager.createFaculty("Mohammad", from);
    await instituionsManager.createInstitution("PMU", from);
    const [faculty] = await facultiesManager.listFaculties(0);
    const [institution] = await instituionsManager.listInstitutions(0);
    assert.equal(
      0,
      await certificatesManager.pendingCertificateLengthForInstitution(
        institution
      )
    );
    await certificatesManager.requestCertificate(faculty, institution, 0, from);
    assert.equal(
      1,
      await certificatesManager.pendingCertificateLengthForInstitution(
        institution
      )
    );
  });
  it("returns pending certificates for a institution", async () => {
    const from = { from: accounts[0] };
    await facultiesManager.createFaculty("Mohammad", from);
    await instituionsManager.createInstitution("PMU", from);
    const [
      faculty1,
      faculty2,
      faculty3,
      faculty4,
    ] = await facultiesManager.listFaculties(0);
    const [institution] = await instituionsManager.listInstitutions(0);
    await certificatesManager.requestCertificate(
      faculty1,
      institution,
      0,
      from
    );
    await certificatesManager.requestCertificate(
      faculty2,
      institution,
      0,
      from
    );
    await certificatesManager.requestCertificate(
      faculty3,
      institution,
      0,
      from
    );
    await certificatesManager.requestCertificate(
      faculty4,
      institution,
      0,
      from
    );
    await certificatesManager.requestCertificate(
      faculty1,
      institution,
      0,
      from
    );
    await certificatesManager.requestCertificate(
      faculty2,
      institution,
      0,
      from
    );
    await certificatesManager.requestCertificate(
      faculty3,
      institution,
      0,
      from
    );
    await certificatesManager.requestCertificate(
      faculty4,
      institution,
      0,
      from
    );
    await certificatesManager.requestCertificate(
      faculty1,
      institution,
      0,
      from
    );
    await certificatesManager.requestCertificate(
      faculty2,
      institution,
      0,
      from
    );
    await certificatesManager.requestCertificate(
      faculty3,
      institution,
      0,
      from
    );
    await certificatesManager.requestCertificate(
      faculty4,
      institution,
      0,
      from
    );
    console.log(institution);
    let certificates = await certificatesManager.pendingCertificateForInstitution(
      institution,
      0
    );
    assert(certificates.filter((c) => c !== EMPTY).length, 10);
    console.log(institution);
    certificates = await certificatesManager.pendingCertificateForInstitution(
      institution,
      10
    );
    assert(certificates.filter((c) => c !== EMPTY).length, 2);
  });
});
