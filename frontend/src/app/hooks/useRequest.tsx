import { useState, useMemo, useEffect } from 'react';

import { poll, sleep } from '@app/utils/promise';

type Status = 'pending' | 'fetching' | 'done';

export const COUNT = 15;

export const DEFAULT_QUERY = {};

export function useRequest<T>(
  subgraph: string,
  pending: boolean,
  query: string | null,
  doPoll: boolean = false
) {
  const [result, setResult] = useState<T | null>(null);
  const [status, setStatus] = useState<Status>('pending');

  useEffect(() => {
    if (!query) return;

    let isMounted = true;
    const unsubs = [
      () => {
        isMounted = false;
      },
    ];

    const load = async () => {
      try {
        const res = await fetch(
          `https://${
            import.meta.env.VITE_API_URL
          }/subgraph-data/${subgraph}?pending=${pending}`,
          {
            method: 'POST',
            body: JSON.stringify({ query }),
            headers: {
              'content-type': 'application/json',
            },
            mode: 'cors',
            credentials: 'omit',
          }
        );
        if (res.status !== 200) {
          throw new Error(await res.text());
        }
        const { data } = await res.json();
        if (isMounted) {
          setResult(data);
        }
      } finally {
        if (isMounted) {
          setStatus('done');
        }
        await sleep(1);
        if (isMounted) {
          setStatus('pending');
        }
      }
    };

    load();

    if (doPoll) {
      poll(unsubs, load);
    }

    return () => unsubs.forEach((unsub) => unsub());
  }, [subgraph, pending, query, doPoll]);

  const working = useMemo(() => status === 'fetching', [status]);

  return {
    result,
    status,
    working,
  };
}
