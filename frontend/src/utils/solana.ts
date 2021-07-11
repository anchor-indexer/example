import { useCallback, useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
// import BN from 'bn.js';

export function isValidPublicKey(key: PublicKey) {
  if (!key) {
    return false;
  }
  try {
    new PublicKey(key);
    return true;
  } catch {
    return false;
  }
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// export const percentFormat = new Intl.NumberFormat(undefined, {
//   style: 'percent',
//   minimumFractionDigits: 2,
//   maximumFractionDigits: 2,
// });

// export function floorToDecimal(value: number, decimals: number) {
//   return decimals ? Math.floor(value * 10 ** decimals) / 10 ** decimals : value;
// }

// export function roundToDecimal(value: number, decimals: number) {
//   return decimals ? Math.round(value * 10 ** decimals) / 10 ** decimals : value;
// }

// export function getDecimalCount(value: number) {
//   if (!isNaN(value) && Math.floor(value) !== value)
//     return value.toString().split('.')[1].length || 0;
//   return 0;
// }

// export function divideBnToNumber(numerator: number, denominator: number) {
//   const quotient = numerator.div(denominator).toNumber();
//   const rem = numerator.umod(denominator);
//   const gcd = rem.gcd(denominator);
//   return quotient + rem.div(gcd).toNumber() / denominator.div(gcd).toNumber();
// }

// export function getTokenMultiplierFromDecimals(decimals: number) {
//   return new BN(10).pow(new BN(decimals));
// }

const localStorageListeners: Record<string, any> = {};

export function useLocalStorageStringState(key: string, defaultState: any) {
  const state = localStorage.getItem(key) || defaultState;

  const [, notify] = useState(key + '\n' + state);

  useEffect(() => {
    if (!localStorageListeners[key]) {
      localStorageListeners[key] = [];
    }
    localStorageListeners[key].push(notify);
    return () => {
      localStorageListeners[key] = localStorageListeners[key].filter(
        (listener: any) => listener !== notify
      );
      if (localStorageListeners[key].length === 0) {
        delete localStorageListeners[key];
      }
    };
  }, [key]);

  const setState = useCallback(
    (newState) => {
      const changed = state !== newState;
      if (!changed) {
        return;
      }

      if (newState === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, newState);
      }
      localStorageListeners[key].forEach((listener: any) =>
        listener(key + '\n' + newState)
      );
    },
    [state, key]
  );

  return [state, setState];
}

export function useLocalStorageState(key: string, defaultState: any) {
  let [stringState, setStringState] = useLocalStorageStringState(
    key,
    JSON.stringify(defaultState)
  );
  return [
    stringState && JSON.parse(stringState),
    (newState: any) => setStringState(JSON.stringify(newState)),
  ];
}

export function useEffectAfterTimeout(effect: any, timeout: number) {
  useEffect(() => {
    const handle = setTimeout(effect, timeout);
    return () => clearTimeout(handle);
  });
}

export function useListener(emitter: any, eventName: string) {
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const listener = () => forceUpdate((i) => i + 1);
    emitter.on(eventName, listener);
    return () => emitter.removeListener(eventName, listener);
  }, [emitter, eventName]);
}

export function abbreviateAddress(base58: string, size = 4) {
  return base58.slice(0, size) + '…' + base58.slice(-size);
}

export function isEqual(obj1: any, obj2: any, keys: string[]) {
  if (!keys && Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }
  keys = keys || Object.keys(obj1);
  for (const k of keys) {
    if (obj1[k] !== obj2[k]) {
      // shallow comparison
      return false;
    }
  }
  return true;
}
