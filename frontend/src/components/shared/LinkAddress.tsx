import { FC } from 'react';
import { Button } from '@material-ui/core';
// import { LinkOutlined } from '@ant-design/icons';

const LinkAddress: FC<{ title?: string; address: string }> = ({
  title,
  address,
}) => {
  return (
    <div>
      {title && <p style={{ color: 'white' }}>{title}</p>}
      <Button
        type='link'
        href={'https://explorer.solana.com/address/' + address}
        target='_blank'
        rel='noopener noreferrer'
      >
        {address}
      </Button>
    </div>
  );
};

export default LinkAddress;
