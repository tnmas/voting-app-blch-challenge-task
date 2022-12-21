// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;
contract DeviceSeller {
    event paymentReceived(address _sender, uint256 amount);
    mapping(address => uint256) balance;
    receive() external payable {}

    fallback() external payable {
        emit paymentReceived(msg.sender, msg.value);
    }

    function getSellerBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
