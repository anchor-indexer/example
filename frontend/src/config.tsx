import { ENV as ChainID } from '@solana/spl-token-registry';
// import { clusterApiUrl } from '@solana/web3.js';

export const BORDER_RADIUS = 2;
export const APP_NAME = 'Counter';

export const LG_BREAKPOINT = 'md';
export const SM_BREAKPOINT = 'sm';

export const { REACT_APP_IS_DEV: IS_DEV } = process.env;

export type ENV = 'mainnet-beta' | 'testnet' | 'devnet' | 'localnet';

export const ENDPOINTS = [
  // {
  //   name: 'devnet' as ENV,
  //   endpoint: clusterApiUrl('devnet'),
  //   chainID: ChainID.Devnet,
  //   config: {},
  // },
  {
    name: 'localnet' as ENV,
    endpoint: 'http://127.0.0.1:8899',
    chainID: ChainID.Devnet,
    config: {
      programId: '3eGGxWCo5t6we2cZXpoeEzDbrmbgJHVyjTASBrJKAmfp',
    },
  },
];

export const ENDPOINT = ENDPOINTS[IS_DEV ? 1 : 0];
