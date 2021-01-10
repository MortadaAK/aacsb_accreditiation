const { assert } = require("chai");

const Application = artifacts.require("Application");
const Faculty = artifacts.require("Faculty");
const Institution = artifacts.require("Institution");
const EMPTY = "0x0000000000000000000000000000000000000000";
contract("Application", async (accounts) => {
  it("can create institution", async () => {
    let instance = await Application.deployed();
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
    let instance = await Application.deployed();
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
    let instance = await Application.deployed();
    let length = await instance.institutionsLength();
    assert.equal(length, 3);
  });

  it("can create faculty", async () => {
    let instance = await Application.deployed();
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
    let instance = await Application.deployed();
    await instance.createFaculty("Mohammad", {
      from: accounts[4],
    });
    await instance.createFaculty("Ali", {
      from: accounts[5],
    });
    assert.notEqual(EMPTY, await instance.faculties(accounts[0]));
    assert.notEqual(EMPTY, await instance.faculties(accounts[4]));
    assert.notEqual(EMPTY, await instance.faculties(accounts[5]));
    let length = await instance.facultiesLength();
    assert.equal(length, 3);
  });
});

contract("Institution", async (accounts) => {
  let instance;
  let institution;

  beforeEach(async () => {
    instance = await Application.deployed();
    await instance.createInstitution("PMU", {
      from: accounts[0],
    });
    let address = await instance.institutions(0);
    institution = await Institution.at(address);
  });

  it("should allow owner to modify the contract", async () => {
    assert.equal(true, await institution.allowed(accounts[0]));
    assert.equal(false, await institution.allowed(accounts[1]));
    await institution.addModifier(accounts[1], { from: accounts[0] });
    assert.equal(true, await institution.allowed(accounts[1]));
  });

  it("can add modifier address", async () => {
    await institution.addModifier(accounts[1], { from: accounts[0] });
    assert.equal(accounts[0], await institution.allowedModifiers(0));
    assert.equal(accounts[1], await institution.allowedModifiers(1));
  });

  it("should not add modifier address using an address outside the modifier list", async () => {
    assert.equal(false, await institution.allowed(accounts[2]));
    await institution.addModifier(accounts[2], { from: accounts[2] });
    assert.equal(false, await institution.allowed(accounts[2]));
  });

  it("should return false if the address to remove is the owner address", async () => {
    assert.equal(
      false,
      await institution.allowedToRemove(accounts[1], accounts[0])
    );
  });

  it("should return false if the address to remove is the same address that used in the request", async () => {
    assert.equal(
      false,
      await institution.allowedToRemove(accounts[1], accounts[1])
    );
  });

  it("should return false if the sender is not in the modifiers list", async () => {
    assert.equal(
      false,
      await institution.allowedToRemove(accounts[5], accounts[1])
    );
  });

  it("should return true if the sender in the modifiers list and the address is not the owner nor same sender address", async () => {
    assert.equal(
      true,
      await institution.allowedToRemove(accounts[0], accounts[2])
    );
  });

  it("can remove address from modifiers list", async () => {
    await institution.addModifier(accounts[1], { from: accounts[0] });
    await institution.addModifier(accounts[2], { from: accounts[0] });
    assert.equal(true, await institution.allowed(accounts[1]));
    assert.equal(true, await institution.allowed(accounts[2]));
    await institution.removeModifier(accounts[2], { from: accounts[0] });
    assert.equal(true, await institution.allowed(accounts[1]));
    assert.equal(false, await institution.allowed(accounts[2]));
  });

  it("lists modifiers", async () => {
    await institution.addModifier(accounts[1], { from: accounts[0] });
    await institution.addModifier(accounts[2], { from: accounts[0] });
    await institution.addModifier(accounts[3], { from: accounts[0] });
    await institution.removeModifier(accounts[2], { from: accounts[0] });
    await institution.addModifier(accounts[2], { from: accounts[0] });
    let addresses = await institution.listModifiers(0);
    assert.equal(addresses[0], accounts[0]);
    assert.equal(addresses[1], accounts[1]);
    assert.equal(addresses[2], accounts[3]);
    assert.equal(addresses[3], accounts[2]);
  });

  it("can update the name", async () => {
    await institution.update("Prince Mohammad bin Fahd University", {
      from: accounts[0],
    });
    let name = await institution.name();
    assert.equal("Prince Mohammad bin Fahd University", name);
  });

  it("cannot update the name using an address which is not in the modifiers list", async () => {
    await institution.update("New Name", {
      from: accounts[6],
    });
    let name = await institution.name();
    assert.notEqual("New Name", name);
  });

  it("creates department", async () => {
    await institution.createDepartment("Business", {
      from: accounts[0],
    });
    let department = await institution.department(1);
    assert.equal(department.id, 1);
    assert.equal(department.name, "Business");
  });

  it("updates department", async () => {
    await institution.updateDepartment(1, "Business Department", {
      from: accounts[0],
    });
    let department = await institution.department(1);
    assert.equal(department.id, 1);
    assert.equal(department.name, "Business Department");
  });

  it("list department", async () => {
    await institution.createDepartment("Computer Science", {
      from: accounts[0],
    });
    assert.equal(2, await institution.departmentsLength());
    let departments = await institution.listDepartments(0);
    assert.equal(departments[0].id, 1);
    assert.equal(departments[1].id, 2);
    assert.equal(departments[2].id, 0);
    assert.equal(departments[3].id, 0);
    assert.equal(departments[4].id, 0);
    assert.equal(departments[5].id, 0);
    assert.equal(departments[6].id, 0);
    assert.equal(departments[7].id, 0);
    assert.equal(departments[8].id, 0);
    assert.equal(departments[9].id, 0);
  });

  it("creates Staff Member", async () => {
    let [{ id: departmentId }] = await institution.listDepartments(0);
    assert.equal(0, await institution.staffMembersLength());
    await institution.createStaffMember("Ahmed", departmentId, {
      from: accounts[0],
    });
    assert.equal(1, await institution.staffMembersLength());
    let staffMember = await institution.staffMember(1);
    assert.equal(staffMember.name, "Ahmed");
    assert.equal(staffMember.departmentId, departmentId);
    assert.equal(staffMember.active, true);
  });

  it("update Staff Member", async () => {
    let [
      { id: departmentId1 },
      { id: departmentId2 },
    ] = await institution.listDepartments(0);
    // we are going to use the previously created staff member
    assert.equal(1, await institution.staffMembersLength());
    let staffMember = await institution.staffMember(1);
    assert.equal(staffMember.name, "Ahmed");
    assert.equal(staffMember.departmentId, departmentId1);
    assert.equal(staffMember.active, true);
    await institution.updateStaffMember(
      staffMember.id,
      "Ahmed Ali",
      departmentId2,
      false
    );
    staffMember = await institution.staffMember(1);
    assert.equal(staffMember.name, "Ahmed Ali");
    assert.equal(staffMember.departmentId, departmentId2);
    assert.equal(staffMember.active, false);
  });

  it("list staff member", async () => {
    const staffMembers = await institution.listStaffMembers(0);
    assert.equal(staffMembers.length, 10);
    assert.equal(staffMembers[0].id, 1);
  });

  it("should skip inactive staff member", async () => {
    const staffMembers = await institution.listStaffMembers(0, true);
    assert.equal(staffMembers.length, 10);
    assert.equal(staffMembers[0].id, 0);
  });
});
