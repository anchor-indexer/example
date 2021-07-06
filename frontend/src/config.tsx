export const BORDER_RADIUS = 2;
export const APP_NAME = 'Counter';

export const LG_BREAKPOINT = 'md';
export const SM_BREAKPOINT = 'sm';

export const { REACT_APP_IS_DEV: IS_DEV } = process.env;

export const ENDPOINTS = [
  {
    name: 'mainnet-beta',
    endpoint: 'https://solana-api.projectserum.com',
    custom: false,
    tokens: [
      {
        tokenSymbol: 'BTC',
        mintAddress: '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E',
        tokenName: 'Wrapped Bitcoin',
        icon:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
      },
      {
        tokenSymbol: 'ETH',
        mintAddress: '2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk',
        tokenName: 'Wrapped Ethereum',
        icon:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      },
    ],
  },
  {
    name: 'localnet',
    endpoint: 'http://127.0.0.1:8899',
    custom: false,
    tokens: [],
  },
];

export const ENDPOINT = ENDPOINTS[IS_DEV ? 1 : 0];
