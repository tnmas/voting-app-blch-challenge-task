const ChooseOS = artifacts.require("ChooseOS.sol");
const DeviceSeller = artifacts.require("DeviceSeller.sol");

module.exports = function(deployer) {
    deployer.deploy(ChooseOS);
    deployer.deploy(DeviceSeller);
}
