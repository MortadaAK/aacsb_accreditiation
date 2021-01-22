const { assert } = require("chai");

const Application = artifacts.require("Application");
const Faculty = artifacts.require("Faculty");
const Institution = artifacts.require("Institution");
const Certificate = artifacts.require("Certificate");
const EMPTY = "0x0000000000000000000000000000000000000000";

contract("Institution", async (accounts) => {
  let instance;
  let institution;

  beforeEach(async () => {
    instance = await Application.new();
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

  it("creates Staff Member", async () => {
    assert.equal(0, await institution.staffMembersLength());
    await institution.createStaffMember("Ahmed", {
      from: accounts[0],
    });
    assert.equal(1, await institution.staffMembersLength());
    let staffMember = await institution.staffMember(1);
    assert.equal(staffMember.name, "Ahmed");
    assert.equal(staffMember.active, true);
  });

  it("update Staff Member", async () => {
    await institution.createStaffMember("Ahmed", {
      from: accounts[0],
    });
    let staffMember = await institution.staffMember(1);
    assert.equal(staffMember.name, "Ahmed");
    assert.equal(staffMember.active, true);
    await institution.updateStaffMember(staffMember.id, "Ahmed Ali", false);
    staffMember = await institution.staffMember(1);
    assert.equal(staffMember.name, "Ahmed Ali");
    assert.equal(staffMember.active, false);
  });

  it("list staff member", async () => {
    await institution.createStaffMember("Ahmed", {
      from: accounts[0],
    });
    const staffMembers = await institution.listStaffMembers(0, false);
    assert.equal(staffMembers.length, 10);
    assert.equal(staffMembers[0].id, 1);
    assert.equal(staffMembers[1].id, 0);
  });

  it("should skip inactive staff member", async () => {
    await institution.createStaffMember("Ahmed", {
      from: accounts[0],
    });
    let staffMembers = await institution.listStaffMembers(0, true);
    await institution.updateStaffMember(staffMembers[0].id, "Ahmed Ali", false);
    staffMembers = await institution.listStaffMembers(0, true);
    assert.equal(staffMembers.length, 10);
    assert.equal(staffMembers[0].id, 0);
  });
});
