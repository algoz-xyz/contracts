const Algoz = artifacts.require("Algoz");

module.exports = function (deployer) {
  deployer.deploy(Algoz, "0x4F8Aa64CB65C7f7d2dB66EB7B49C76De870B243E");
};