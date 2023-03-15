import React, {
  FC,
  ReactNode,
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import * as anchor from '@project-serum/anchor';
import toast, { LoaderIcon } from 'react-hot-toast';

import { useProvider } from '@app/contexts/provider';
import { useStore } from '@app/contexts/store';
import { useWallet } from '@app/contexts/wallet';
import Loader from '@app/components/shared/Loader';
import {
  formatPreciseNumber,
  toBigNumber,
  // PRECISION,
} from '@app/utils/bn';
import { alertRequestError } from '@app/utils/request';
import { getTxUrl } from '@app/utils/explorer';

export type TxState =
  | 'unsent'
  | 'prompting'
  | 'signing'
  | 'sending'
  | 'sent'
  | 'signed'
  | 'failed';
export type SendFn = () => Promise<{
  ixs?: anchor.web3.TransactionInstruction[];
  signers?: Array<anchor.web3.Signer | undefined>;
  opts?: anchor.web3.ConfirmOptions;
  tx?: anchor.web3.Transaction;
} | null>;
export type SignFn = (sig: Uint8Array | null) => Promise<void>;

// const MIN_FEE = toBigNumber(0.01).times(toBigNumber(PRECISION));

const TxContext = createContext<{
  error: Error | null;
  send: (fn: SendFn) => Promise<string>;
  sign: (msg?: Uint8Array | null, fn?: SignFn) => Promise<void>;
  working: ReactNode | null;
} | null>(null);

export const TxProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const provider = useProvider();
  const { solBalance } = useStore();
  const { publicKey: walletPubkey, signMessage, signTransaction } = useWallet();

  const [status, setStatus] = useState<TxState>('unsent');
  const [error, setError] = useState<Error | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    switch (status) {
      case 'failed': {
        if (error) {
          alertRequestError(error);
        }
        break;
      }

      case 'sent': {
        id &&
          toast.success(
            <div className='flex flex-wrap'>
              Transaction sent with success!
              <a
                href={getTxUrl(id)}
                target='_blank'
                rel='noreferrer'
                style={{ color: '#190834' }}
                className='ml-1 underline'
              >
                View on Explorer
              </a>
            </div>,
            {
              duration: 15 * 1e3,
            }
          );
        break;
      }

      case 'signed': {
        toast.success(<div className='flex flex-wrap'>Success!</div>, {
          duration: 2 * 1e3,
        });
        break;
      }

      case 'sending': {
        toast('Sending...', {
          icon: <LoaderIcon />,
          duration: Infinity,
        });
        break;
      }

      case 'prompting': {
        toast(
          <div className='flex justify-center'>
            Confirm this transaction in your wallet...
          </div>,
          {
            icon: <LoaderIcon />,
            duration: Infinity,
          }
        );
        break;
      }

      case 'signing': {
        toast(
          <div className='flex justify-center'>
            Sign this transaction in your wallet...
          </div>,
          {
            icon: <LoaderIcon />,
            duration: Infinity,
          }
        );
        break;
      }

      default:
    }

    return () => toast.remove();
  }, [status, error, id]);

  const send = useCallback(
    async (fn: SendFn) => {
      try {
        if (!(provider && walletPubkey)) return;

        setWorking(true);

        if (solBalance.isZero()) {
          throw new Error('You require some SOL to execute transactions.');
        }

        const fnOpts = await fn();
        if (!fnOpts) throw new Error('Missing tx params.');

        const { ixs } = fnOpts;
        let { signers, opts, tx } = fnOpts;

        setStatus('prompting');
        setError(null);

        // lifted from anchor
        // so we can better capture tx statuses: prompting vs sending
        const { connection, opts: defaultOpts } = provider;

        if (signers === undefined) {
          signers = [];
        }
        if (opts === undefined) {
          opts = defaultOpts;
        }

        if (!tx) {
          tx = new anchor.web3.Transaction();
          if (ixs) tx.add(...ixs);

          tx.feePayer = walletPubkey;
        }

        tx.recentBlockhash = (
          await connection.getLatestBlockhash(opts.preflightCommitment)
        ).blockhash;

        const fee = toBigNumber(await tx.getEstimatedFee(connection));
        if (solBalance.lt(fee)) {
          throw new Error(
            `You require a minimum of ${formatPreciseNumber(
              toBigNumber(fee),
              2
            )} SOL to execute the transaction.`
          );
        }

        setId(null);
        const originalSignatures = Object.assign(
          [],
          tx.signatures
        ) as anchor.web3.SignaturePubkeyPair[];
        const filteredSignatures = originalSignatures.filter(
          (item) => item.signature != null
        );
        const signedTx = await signTransaction(tx);
        if (!signedTx) throw new Error('Transaction was not signed.');

        tx = signedTx;

        signers
          .filter((s): s is anchor.web3.Signer => s !== undefined)
          .forEach((kp) => {
            tx!.partialSign(kp);
          });

        filteredSignatures.forEach((sign) => {
          tx!.addSignature(sign.publicKey, sign.signature as Buffer);
        });

        const rawTx = tx.serialize();

        setStatus('sending');
        const txId = await anchor.web3.sendAndConfirmRawTransaction(
          connection,
          rawTx,
          opts
        );
        setId(txId);
        setStatus('sent');
        return txId;
      } catch (ex: any) {
        let e = new Error(ex.message);
        let logs: string[] = [];

        if (ex instanceof anchor.web3.SendTransactionError) {
          const sendTransactionError = ex as anchor.web3.SendTransactionError;
          if (sendTransactionError.logs) {
            logs = sendTransactionError.logs;
            // remove log once sentry plan is upgraded
            console.error(logs); // eslint-disable-line no-console
            for (const log of sendTransactionError.logs) {
              if (~log.search('insufficient lamports')) {
                const m = log.match(
                  /Transfer: insufficient lamports (\d+), need (\d+)/
                );
                let errMessage =
                  'You did not have enough SOL to execute the transaction.';
                if (m && m.length === 3) {
                  const solRequired = parseInt(m[2]);
                  if (solRequired) {
                    errMessage += ` Needed ${formatPreciseNumber(
                      toBigNumber(solRequired),
                      4
                    )} SOL`;
                  }
                }
                e = new Error(errMessage);
                break;
              }
            }
          }
        }

        setError(e as Error);
        setStatus('failed');

        throw e;
      } finally {
        setWorking(false);

        // do not enable
        //
        // await sleep(1000)
        // setStatus('unsent')
      }
    },
    [provider, solBalance, signTransaction, walletPubkey]
  );

  const sign = useCallback(
    async (msg?: Uint8Array | null, fn?: SignFn) => {
      try {
        setWorking(true);
        if (!walletPubkey) throw new Error('Connect wallet');

        setStatus('signing');
        setError(null);

        const sig = await signMessage(msg || walletPubkey.toBytes());
        if (fn) {
          setStatus('sending');
          await fn(sig);
        }
        setStatus('signed');
      } catch (e) {
        setError(e as Error);
        setStatus('failed');
        throw e;
      } finally {
        setWorking(false);

        // do not enable
        //
        // await sleep(1000)
        // setStatus('unsigned')
      }
    },
    [signMessage, walletPubkey]
  );

  const workingLoader = useMemo(
    () => (!working ? null : <Loader text='Please wait' />),
    [working]
  );

  const ret = useMemo(
    () => ({
      error,
      send,
      sign,
      working: workingLoader,
    }),
    [error, send, sign, workingLoader]
  );

  return <TxContext.Provider value={ret}>{children}</TxContext.Provider>;
};

export function useTx() {
  const context = useContext(TxContext);
  if (!context) {
    throw new Error('Missing Tx context');
  }
  return context;
}
