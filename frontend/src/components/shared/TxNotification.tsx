import { FC } from 'react';
// import Link from 'components/shared/Link';

const Notification: FC<{
  message?: string;
  description?: string;
  txid?: string;
  type?: string;
  placement?: string;
}> = ({
  message,
  description,
  txid,
  type = 'info',
  placement = 'bottomLeft',
}) => {
  // if (txid) {
  //   description = (
  //     <Link
  //       external
  //       to={'https://explorer.solana.com/tx/' + txid}
  //       style={{ color: '#0000ff' }}
  //     >
  //       View transaction {txid.slice(0, 8)}...{txid.slice(txid.length - 8)}
  //     </Link>
  //   );
  // }
  // notification[type]({
  //   message: <span style={{ color: 'black' }}>{message}</span>,
  //   description: (
  //     <span style={{ color: 'black', opacity: 0.5 }}>{description}</span>
  //   ),
  //   placement,
  //   style: {
  //     backgroundColor: 'white',
  //   },
  // });
  return null;
};

export default Notification;
