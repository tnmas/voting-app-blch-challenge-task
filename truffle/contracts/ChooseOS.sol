// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;
import "./DeviceSeller.sol";
contract ChooseOS {
    DeviceSeller sellerInstance;
    address payable private owner;

    struct device {
        uint256 deviceId;
        string deviceName;
        uint256 price;
        uint256 voteCount;
    }

    mapping(uint256 => device) devices;

    uint256 private devicesCount;
    device[] private allDevices;
    uint256 private voteCount;

    constructor() {
        owner = payable(msg.sender);
        addDevice(1, "IOS", 20000000000000000000, 0);
        addDevice(2, "Windows", 10000000000000000000, 0);
        sellerInstance = new DeviceSeller();
    }

    receive() external payable{}

    function getAllDevices() public view returns (device[] memory) {
        return allDevices;
    }

    function getVoteCount(uint256 _deviceId) public view returns (uint256) {
        return devices[_deviceId].voteCount;
    }

    function getDeviceCount() public view returns (uint256) {
        return devicesCount;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function getDevicePrice(uint256 _deviceId) public view returns (uint256) {
        return devices[_deviceId].price;
    }

    function getSellerAddress() public view returns (address) {
        return address(sellerInstance);
    }

    function getOwnerBlance() public view returns (uint256) {
        return owner.balance;
    }

    function getSellerBlance() public view returns (uint256) {
        return sellerInstance.getSellerBalance();
    }
    function addDevice(
        uint256 _deviceId,
        string memory _deviceName,
        uint256 _price, 
        uint256 _voteCount
    ) private {
        devicesCount++;
        devices[devicesCount] = device(_deviceId, _deviceName, _price, _voteCount);
        allDevices.push(devices[devicesCount]);
    }

    function buyDevice(uint256 _deviceId) public payable {
        uint256 devicePrice = getDevicePrice(_deviceId);
        (bool success, ) = payable(getSellerAddress()).call{value: devicePrice}("");
        devices[_deviceId].voteCount++;
    }
}
