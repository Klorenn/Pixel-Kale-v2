// Network Configuration for PixelKale
const StellarSdk = require('stellar-sdk');

const NETWORKS = {
  testnet: {
    name: 'testnet',
    server: 'https://horizon-testnet.stellar.org',
    passphrase: StellarSdk.Networks.TESTNET,
    contractId: 'CDSWUUXGPWDZG76ISK6SUCVPZJMD5YUV66J2FXFXFGDX25XKZJIEITAO',
    assetCode: 'KALE',
    assetIssuer: 'GCHPTWXMT3HYF4RLZHWBNRF4MPXLTJ76ISHMSYIWCCDXWUYOQG5MR2AB',
    sac: 'CAAVU2UQJLMZ3GUZFM56KVNHLPA3ZSSNR4VP2U53YBXFD2GI3QLIVHZZ'
  },
  mainnet: {
    name: 'mainnet',
    server: 'https://horizon.stellar.org',
    passphrase: StellarSdk.Networks.PUBLIC,
    // Ben Wallet KALE Ecosystem
    homestead: 'CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA', // KALE Homestead
    tractor: 'CBGSBKYMYO6OMGHQXXNOBRGVUDFUDVC2XLC3SXON5R2SNXILR7XCKKY3', // KALE Tractor
    sac: 'CB23WRDQWGSP6YPMY4UV5C4OW5CBTXKYN3XEATG7KJEZCXMJBYEHOUOV', // KALE SAC Contract
    contractId: 'CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA', // Default to Homestead
    assetCode: 'KALE',
    assetIssuer: 'GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE',
    // Launchtube Integration
    launchtube: 'https://launchtube.xyz/'
  }
};

module.exports = NETWORKS;
