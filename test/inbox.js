const Inbox = artifacts.require("Inbox");

contract("first test", async (accounts) => {
  it("should initialized with initial message", async () => {
    let instance = await Inbox.deployed();
    let message = await instance.message.call();
    assert.equal(message, "initial");
  });
});
