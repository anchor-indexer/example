import { FC, ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Link: FC<{ external?: boolean; to: string; children: ReactNode }> = ({
  external = false,
  to,
  children,
  ...rest
}) => {
  if (external) {
    return (
      <a href={to} target='_blank' rel='noopener noreferrer' {...rest}>
        {children}
      </a>
    );
  }
  return (
    <RouterLink {...{ to }} {...rest}>
      {children}
    </RouterLink>
  );
};

export default Link;
