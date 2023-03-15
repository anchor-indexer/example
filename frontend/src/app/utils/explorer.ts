export function getTxUrl(signature: string): string {
  return getUrl(`/tx/${signature}`);
}

export function getAddressUrl(account: string): string {
  return getUrl(`/account/${account}`);
}

function getUrl(path: string) {
  return `https://solscan.io${path}?cluster=devnet`;
}
