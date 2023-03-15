import BigNumber from 'bignumber.js';

export const PRECISION = 1e9;

export const toBigNumber = (n: any) => new BigNumber(n);

export const formatNumber = (n: any, decimals: number = 2) => {
  n = toBigNumber(n);
  return n.isNaN() ? '0' : n.toFormat(decimals);
};

export const formatPreciseNumber = (n: any, decimals?: number) =>
  formatNumber(toBigNumber(n).div(PRECISION), decimals);
