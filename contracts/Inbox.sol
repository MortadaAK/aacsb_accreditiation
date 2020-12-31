// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract Inbox {
    string public message = "initial";
    event MessageUpdated(string prevMessage, string message);

    function setMessage(string memory _message) public {
        emit MessageUpdated(message, _message);
        message = _message;
    }
}
