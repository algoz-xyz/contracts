const Algoz = artifacts.require("Algoz");

module.exports = function (deployer) {
  deployer.deploy(Algoz, "0x3454d3ce8d3cd97e4d0f42e72f9e277881d9759bebe0d86b0a005f7c7cfc72a1", 20);
};