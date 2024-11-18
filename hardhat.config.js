require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config();
require("@chainlink/env-enc").config();
require("./tasks/deploy-fundme");
require("./tasks/interact-fundme");
require("hardhat-deploy")

const SPEOLIA_URL = process.env.SPEOLIA_URL;
const SPEOLIA_KEY = process.env.SPEOLIA_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: SPEOLIA_URL,
      accounts: [SPEOLIA_KEY],
      chainId: 11155111
    }
  },
  namedAccounts: {
    firstAccount: {
      default: 0
    },
    secondAccount: {
      default: 1
    },
  }
};
