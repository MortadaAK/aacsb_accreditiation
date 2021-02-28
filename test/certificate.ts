const { assert } = require("chai");

const Application = artifacts.require("Application");
const Faculty = artifacts.require("Faculty");
const Institution = artifacts.require("Institution");
const Certificate = artifacts.require("Certificate");
const CertificatesManager = artifacts.require("CertificatesManager");
const FacultiesManager = artifacts.require("FacultiesManager");
const InstituionsManager = artifacts.require("InstituionsManager");
const EMPTY = "0x0000000000000000000000000000000000000000";

contract("Certificate", async (accounts) => {
  let instance;
  let institution;
  let institutionAddress;
  let faculty;
  let facultyAddress;
  let instituionsManager;
  let facultiesManager;
  let certificateManager;
  beforeEach(async () => {
    instance = await Application.new();
    instituionsManager = await InstituionsManager.at(
      await instance.instituionsManager()
    );
    await instituionsManager.createInstitution("PMU", {
      from: accounts[0],
    });
    institutionAddress = await instituionsManager.institutions(0);
    institution = await Institution.at(institutionAddress);
    facultiesManager = await FacultiesManager.at(
      await instance.facultiesManager()
    );
    certificateManager = await CertificatesManager.at(
      await instance.certificatesManager()
    );

    await facultiesManager.createFaculty("Mohammad", { from: accounts[1] });

    facultyAddress = await facultiesManager.faculties(accounts[1]);
    faculty = await Faculty.at(facultyAddress);
  });

  it("allow instituion and modify certificate", async () => {
    await certificateManager.requestCertificate(
      facultyAddress,
      institutionAddress,
      0,
      {
        from: accounts[1],
      }
    );
    const [
      certificateAddress,
    ] = await certificateManager.pendingCertificatesForFaculty(
      facultyAddress,
      0
    );
    const certificate = await Certificate.at(certificateAddress);
    assert.equal(true, await certificate.editable(accounts[0]));
    assert.equal(false, await certificate.editable(accounts[1]));
    assert.equal(false, await certificate.editable(accounts[2]));
  });

  it("instituion can reject certificate", async () => {
    await certificateManager.requestCertificate(
      facultyAddress,
      institutionAddress,
      0,
      {
        from: accounts[1],
      }
    );
    const [
      certificateAddress,
    ] = await certificateManager.pendingCertificatesForFaculty(
      facultyAddress,
      0
    );
    let certificate = await Certificate.at(certificateAddress);
    assert.equal(0, await certificate.status());
    await certificate.reject({ from: accounts[0] });
    assert.equal(2, await certificate.status());
  });

  it("others cannot reject certificate", async () => {
    await certificateManager.requestCertificate(
      facultyAddress,
      institutionAddress,
      0,
      {
        from: accounts[1],
      }
    );
    const [
      certificateAddress,
    ] = await certificateManager.pendingCertificatesForFaculty(
      facultyAddress,
      0
    );
    let certificate = await Certificate.at(certificateAddress);
    assert.equal(0, await certificate.status());
    await certificate.reject({ from: accounts[2] });
    assert.equal(0, await certificate.status());
  });

  it("after reject certificate, should be removed from list of certificates", async () => {
    await certificateManager.requestCertificate(
      facultyAddress,
      institutionAddress,
      0,
      {
        from: accounts[1],
      }
    );
    const [
      certificateAddress,
    ] = await certificateManager.pendingCertificatesForFaculty(
      facultyAddress,
      0
    );
    assert.equal(
      1,
      await certificateManager.pendingCertificatesLengthForFaculty(
        facultyAddress
      )
    );
    assert.equal(
      1,
      await certificateManager.pendingCertificatesLengthForInstitution(
        institutionAddress
      )
    );
    let certificate = await Certificate.at(certificateAddress);
    await certificate.reject({ from: accounts[0] });

    assert.equal(
      0,
      await certificateManager.pendingCertificatesLengthForFaculty(
        facultyAddress
      )
    );

    assert.equal(
      0,
      await certificateManager.pendingCertificatesLengthForInstitution(
        institutionAddress
      )
    );
  });

  it("instituion can approve certificate", async () => {
    await certificateManager.requestCertificate(
      facultyAddress,
      institutionAddress,
      0,
      {
        from: accounts[1],
      }
    );
    const [
      certificateAddress,
    ] = await certificateManager.pendingCertificatesForFaculty(
      facultyAddress,
      0
    );
    let certificate = await Certificate.at(certificateAddress);
    assert.equal(0, await certificate.status());
    await certificate.approve({ from: accounts[0] });
    assert.equal(1, await certificate.status());
  });

  it("faculty cannot approve certificate", async () => {
    await certificateManager.requestCertificate(
      facultyAddress,
      institutionAddress,
      0,
      {
        from: accounts[1],
      }
    );
    const [
      certificateAddress,
    ] = await certificateManager.pendingCertificatesForFaculty(
      facultyAddress,
      0
    );
    let certificate = await Certificate.at(certificateAddress);
    assert.equal(0, await certificate.status());
    await certificate.approve({ from: accounts[1] });
    assert.equal(0, await certificate.status());
  });

  it("others cannot approve certificate", async () => {
    await certificateManager.requestCertificate(
      facultyAddress,
      institutionAddress,
      0,
      {
        from: accounts[1],
      }
    );
    const [
      certificateAddress,
    ] = await certificateManager.pendingCertificatesForFaculty(
      facultyAddress,
      0
    );
    let certificate = await Certificate.at(certificateAddress);
    assert.equal(0, await certificate.status());
    await certificate.approve({ from: accounts[2] });
    assert.equal(0, await certificate.status());
  });

  it("after approve certificate, should be removed from list of pending certificates and add it to issued certificates", async () => {
    await certificateManager.requestCertificate(
      facultyAddress,
      institutionAddress,
      0,
      {
        from: accounts[1],
      }
    );
    const [
      certificateAddress,
    ] = await certificateManager.pendingCertificatesForFaculty(
      facultyAddress,
      0
    );

    assert.equal(
      1,
      await certificateManager.pendingCertificatesLengthForFaculty(
        facultyAddress
      )
    );
    assert.equal(
      1,
      await certificateManager.pendingCertificatesLengthForInstitution(
        institutionAddress
      )
    );
    assert.equal(0, await institution.issuedCertificatesLength());
    assert.equal(0, await faculty.certificatesLength());

    let certificate = await Certificate.at(certificateAddress);
    await certificate.approve({ from: accounts[0] });

    assert.equal(
      0,
      await certificateManager.pendingCertificatesLengthForFaculty(
        facultyAddress
      )
    );

    assert.equal(
      0,
      await certificateManager.pendingCertificatesLengthForInstitution(
        institutionAddress
      )
    );
    assert.equal(1, await institution.issuedCertificatesLength());
    assert.equal(1, await faculty.certificatesLength());
  });
});
