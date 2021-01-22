module.exports = {
  contracts_build_directory: "./src/contracts",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      gas: 99999999,
      gasPrice: 2000,
    },
  },
  compilers: {
    solc: {
      version: "0.7.5",
    },
  },
};
