export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function retry<T>(
  run: () => Promise<T>,
  confirm: (t: T) => boolean,
  maxRetries: number = 10,
  retryIndex: number = 0
) {
  if (maxRetries === retryIndex) throw new Error('max retries reached');

  const retryFn = () => {
    return new Promise<T>((resolve, reject) => {
      setTimeout(() => {
        try {
          resolve(retry<T>(run, confirm, maxRetries, retryIndex + 1));
        } catch (e) {
          reject(e);
        }
      }, 2000);
    });
  };

  let result: T;
  try {
    result = await run();
  } catch (e) {
    return retryFn();
  }
  if (!confirm(result)) {
    return retryFn();
  }
  return result;
}

export function poll(
  unsubs: (() => void)[],
  fn: () => void,
  ms: number = 5_000
) {
  const id = setInterval(fn, ms);
  unsubs.push(() => {
    clearInterval(id);
  });
}
