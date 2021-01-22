const { assert } = require("chai");

const Application = artifacts.require("Application");
const Faculty = artifacts.require("Faculty");
const Institution = artifacts.require("Institution");
const Certificate = artifacts.require("Certificate");
const EMPTY = "0x0000000000000000000000000000000000000000";

contract("Certificate", async (accounts) => {
  let instance;
  let institution;
  let institutionAddress;
  let faculty;
  let facultyAddress;
  beforeEach(async () => {
    instance = await Application.new();
    await instance.createInstitution("PMU", {
      from: accounts[0],
    });
    institutionAddress = await instance.institutions(0);
    institution = await Institution.at(institutionAddress);

    await instance.createFaculty("Mohammad", { from: accounts[1] });

    facultyAddress = await instance.faculties(accounts[1]);
    faculty = await Faculty.at(facultyAddress);
  });

  it("allow instituion and the faculty to edit certificate", async () => {
    await instance.requestCertificate(facultyAddress, institutionAddress, 0, {
      from: accounts[1],
    });
    const [certificateAddress] = await instance.pendingCertificateForFaculty(
      facultyAddress,
      0
    );
    const certificate = await Certificate.at(certificateAddress);
    assert.equal(true, await certificate.editable(accounts[0]));
    assert.equal(true, await certificate.editable(accounts[1]));
    assert.equal(false, await certificate.editable(accounts[2]));
  });

  it("allow change degree", async () => {
    await instance.requestCertificate(facultyAddress, institutionAddress, 0, {
      from: accounts[1],
    });
    const [certificateAddress] = await instance.pendingCertificateForFaculty(
      facultyAddress,
      0
    );
    let certificate = await Certificate.at(certificateAddress);
    assert.equal(0, await certificate.degree());
    await certificate.update(1, { from: accounts[0] });
    assert.equal(1, await certificate.degree());
    await certificate.update(2, { from: accounts[1] });
    assert.equal(2, await certificate.degree());
    await certificate.update(3, { from: accounts[2] });
    assert.equal(2, await certificate.degree());
  });

  it("faculty can reject certificate", async () => {
    await instance.requestCertificate(facultyAddress, institutionAddress, 0, {
      from: accounts[1],
    });
    const [certificateAddress] = await instance.pendingCertificateForFaculty(
      facultyAddress,
      0
    );
    let certificate = await Certificate.at(certificateAddress);
    assert.equal(0, await certificate.status());
    await certificate.reject({ from: accounts[1] });
    assert.equal(2, await certificate.status());
  });

  it("instituion can reject certificate", async () => {
    await instance.requestCertificate(facultyAddress, institutionAddress, 0, {
      from: accounts[1],
    });
    const [certificateAddress] = await instance.pendingCertificateForFaculty(
      facultyAddress,
      0
    );
    let certificate = await Certificate.at(certificateAddress);
    assert.equal(0, await certificate.status());
    await certificate.reject({ from: accounts[0] });
    assert.equal(2, await certificate.status());
  });

  it("others cannot reject certificate", async () => {
    await instance.requestCertificate(facultyAddress, institutionAddress, 0, {
      from: accounts[1],
    });
    const [certificateAddress] = await instance.pendingCertificateForFaculty(
      facultyAddress,
      0
    );
    let certificate = await Certificate.at(certificateAddress);
    assert.equal(0, await certificate.status());
    await certificate.reject({ from: accounts[2] });
    assert.equal(0, await certificate.status());
  });

  it("after reject certificate, should be removed from list of certificates", async () => {
    await instance.requestCertificate(facultyAddress, institutionAddress, 0, {
      from: accounts[1],
    });
    const [certificateAddress] = await instance.pendingCertificateForFaculty(
      facultyAddress,
      0
    );
    assert.equal(
      1,
      await instance.pendingCertificateLengthForFaculty(facultyAddress)
    );
    assert.equal(
      1,
      await instance.pendingCertificateLengthForInstitution(institutionAddress)
    );
    let certificate = await Certificate.at(certificateAddress);
    await certificate.reject({ from: accounts[0] });

    assert.equal(
      0,
      await instance.pendingCertificateLengthForFaculty(facultyAddress)
    );

    assert.equal(
      0,
      await instance.pendingCertificateLengthForInstitution(institutionAddress)
    );
  });

  it("instituion can approve certificate", async () => {
    await instance.requestCertificate(facultyAddress, institutionAddress, 0, {
      from: accounts[1],
    });
    const [certificateAddress] = await instance.pendingCertificateForFaculty(
      facultyAddress,
      0
    );
    let certificate = await Certificate.at(certificateAddress);
    assert.equal(0, await certificate.status());
    await certificate.approve({ from: accounts[0] });
    assert.equal(1, await certificate.status());
  });

  it("faculty cannot approve certificate", async () => {
    await instance.requestCertificate(facultyAddress, institutionAddress, 0, {
      from: accounts[1],
    });
    const [certificateAddress] = await instance.pendingCertificateForFaculty(
      facultyAddress,
      0
    );
    let certificate = await Certificate.at(certificateAddress);
    assert.equal(0, await certificate.status());
    await certificate.approve({ from: accounts[1] });
    assert.equal(0, await certificate.status());
  });

  it("others cannot approve certificate", async () => {
    await instance.requestCertificate(facultyAddress, institutionAddress, 0, {
      from: accounts[1],
    });
    const [certificateAddress] = await instance.pendingCertificateForFaculty(
      facultyAddress,
      0
    );
    let certificate = await Certificate.at(certificateAddress);
    assert.equal(0, await certificate.status());
    await certificate.approve({ from: accounts[2] });
    assert.equal(0, await certificate.status());
  });

  it("after approve certificate, should be removed from list of pending certificates and add it to issued certificates", async () => {
    await instance.requestCertificate(facultyAddress, institutionAddress, 0, {
      from: accounts[1],
    });
    const [certificateAddress] = await instance.pendingCertificateForFaculty(
      facultyAddress,
      0
    );

    assert.equal(
      1,
      await instance.pendingCertificateLengthForFaculty(facultyAddress)
    );
    assert.equal(
      1,
      await instance.pendingCertificateLengthForInstitution(institutionAddress)
    );
    assert.equal(0, await institution.issuedCertificatesLength());
    assert.equal(0, await faculty.certificatesLength());

    let certificate = await Certificate.at(certificateAddress);
    await certificate.approve({ from: accounts[0] });

    assert.equal(
      0,
      await instance.pendingCertificateLengthForFaculty(facultyAddress)
    );

    assert.equal(
      0,
      await instance.pendingCertificateLengthForInstitution(institutionAddress)
    );
    assert.equal(1, await institution.issuedCertificatesLength());
    assert.equal(1, await faculty.certificatesLength());
  });

  it("allow instituion and the faculty to edit certificate", async () => {
    await instance.requestCertificate(facultyAddress, institutionAddress, 0, {
      from: accounts[1],
    });
    const [certificateAddress] = await instance.pendingCertificateForFaculty(
      facultyAddress,
      0
    );
    const certificate = await Certificate.at(certificateAddress);
    assert.equal(true, await certificate.editable(accounts[0]));
    assert.equal(true, await certificate.editable(accounts[1]));
    assert.equal(false, await certificate.editable(accounts[2]));
  });
});
