module.exports = {
  contracts_build_directory: "../src/contracts",
  networks: {
    development: {
      host: "backend",
      port: 8545,
      network_id: "*" // Match any network id
    },
    develop: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    }
  },
  compilers: {
    solc: {
      version: "pragma"
    }
  }
};
