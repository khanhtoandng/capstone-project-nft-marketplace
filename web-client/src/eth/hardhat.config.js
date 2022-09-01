require('@nomiclabs/hardhat-waffle');

const projectId = '99dba96f8c4045cab48434f064faccdf';
const privateKey =
  '1817814433bc6e0fdb87d418fa1356aaa99fc81e7a8243358c9842e9b08ca8ea';

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${projectId}`,
      accounts: [privateKey],
    },
  },
  solidity: '0.8.4',
};
