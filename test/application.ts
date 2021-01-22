const { assert } = require("chai");

const Application = artifacts.require("Application");
const Faculty = artifacts.require("Faculty");
const Institution = artifacts.require("Institution");
const Certificate = artifacts.require("Certificate");
const EMPTY = "0x0000000000000000000000000000000000000000";

contract("Application", async (accounts) => {
  let instance;
  beforeEach(async () => {
    instance = await Application.new();
  });
  it("can create institution", async () => {
    await instance.createInstitution("PMU", {
      from: accounts[0],
    });
    let address = await instance.institutions(0);
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
      instance.createInstitution("PMU 1", {
        from: accounts[0],
      }),
      instance.createInstitution("PMU 2", {
        from: accounts[0],
      }),
    ]);
    let address1 = await instance.institutions(0);
    let address2 = await instance.institutions(1);
    let address3 = await instance.institutions(2);
    let addresses = await instance.listInstitutions(0);
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
      instance.createInstitution("PMU 1", {
        from: accounts[0],
      }),
      instance.createInstitution("PMU 2", {
        from: accounts[0],
      }),
    ]);
    let length = await instance.institutionsLength();
    assert.equal(length, 2);
  });

  it("can create faculty", async () => {
    await instance.createFaculty("Mortada", {
      from: accounts[0],
    });
    let address = await instance.faculties(accounts[0]);
    let faculty = await Faculty.at(address);
    let name = await faculty.name();
    assert.equal(name, "Mortada");
    let owner = await faculty.owner();
    assert.equal(owner, accounts[0]);
  });

  it("returns faculties length", async () => {
    await instance.createFaculty("Mohammad", {
      from: accounts[4],
    });
    await instance.createFaculty("Ali", {
      from: accounts[5],
    });
    let length = await instance.facultiesLength();
    assert.equal(length, 2);
  });

  it("returns pending certificates length for a faculty", async () => {
    const from = { from: accounts[0] };
    await instance.createFaculty("Mohammad", from);
    await instance.createInstitution("PMU", from);
    const [faculty] = await instance.listFaculties(0);
    const [institution] = await instance.listInstitutions(0);
    assert.equal(0, await instance.pendingCertificateLengthForFaculty(faculty));
    await instance.requestCertificate(faculty, institution, 0, from);
    assert.equal(1, await instance.pendingCertificateLengthForFaculty(faculty));
  });
  it("returns pending certificates for a faculty", async () => {
    const from = { from: accounts[0] };
    await instance.createFaculty("Mohammad", from);
    await instance.createInstitution("PMU", from);
    const [faculty] = await instance.listFaculties(0);
    const [institution] = await instance.listInstitutions(0);
    await instance.requestCertificate(faculty, institution, 0, from);
    await instance.requestCertificate(faculty, institution, 0, from);
    await instance.requestCertificate(faculty, institution, 0, from);
    await instance.requestCertificate(faculty, institution, 0, from);
    await instance.requestCertificate(faculty, institution, 0, from);
    await instance.requestCertificate(faculty, institution, 0, from);
    await instance.requestCertificate(faculty, institution, 0, from);
    await instance.requestCertificate(faculty, institution, 0, from);
    await instance.requestCertificate(faculty, institution, 0, from);
    await instance.requestCertificate(faculty, institution, 0, from);
    await instance.requestCertificate(faculty, institution, 0, from);
    await instance.requestCertificate(faculty, institution, 0, from);
    let certificates = await instance.pendingCertificateForFaculty(faculty, 0);
    assert(certificates.filter((c) => c !== EMPTY).length, 10);
    certificates = await instance.pendingCertificateForFaculty(faculty, 10);
    assert(certificates.filter((c) => c !== EMPTY).length, 2);
  });
  it("returns pending certificates length for an institution", async () => {
    const from = { from: accounts[0] };
    await instance.createFaculty("Mohammad", from);
    await instance.createInstitution("PMU", from);
    const [faculty] = await instance.listFaculties(0);
    const [institution] = await instance.listInstitutions(0);
    assert.equal(
      0,
      await instance.pendingCertificateLengthForInstitution(institution)
    );
    await instance.requestCertificate(faculty, institution, 0, from);
    assert.equal(
      1,
      await instance.pendingCertificateLengthForInstitution(institution)
    );
  });
  it("returns pending certificates for a institution", async () => {
    const from = { from: accounts[0] };
    await instance.createFaculty("Mohammad", from);
    await instance.createInstitution("PMU", from);
    const [
      faculty1,
      faculty2,
      faculty3,
      faculty4,
    ] = await instance.listFaculties(0);
    const [institution] = await instance.listInstitutions(0);
    await instance.requestCertificate(faculty1, institution, 0, from);
    await instance.requestCertificate(faculty2, institution, 0, from);
    await instance.requestCertificate(faculty3, institution, 0, from);
    await instance.requestCertificate(faculty4, institution, 0, from);
    await instance.requestCertificate(faculty1, institution, 0, from);
    await instance.requestCertificate(faculty2, institution, 0, from);
    await instance.requestCertificate(faculty3, institution, 0, from);
    await instance.requestCertificate(faculty4, institution, 0, from);
    await instance.requestCertificate(faculty1, institution, 0, from);
    await instance.requestCertificate(faculty2, institution, 0, from);
    await instance.requestCertificate(faculty3, institution, 0, from);
    await instance.requestCertificate(faculty4, institution, 0, from);
    let certificates = await instance.pendingCertificateForInstitution(
      institution,
      0
    );
    assert(certificates.filter((c) => c !== EMPTY).length, 10);
    certificates = await instance.pendingCertificateForInstitution(
      institution,
      10
    );
    assert(certificates.filter((c) => c !== EMPTY).length, 2);
  });
});
