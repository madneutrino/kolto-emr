import { Logo } from '@mantine/core';
import { Header as BaseHeader } from '@medplum/react';
import elyxLogo from '../img/homePage/elyx-logo-blue.svg';

export function Header(): JSX.Element {
  return (
    <BaseHeader
      logo={
        <img
          src={elyxLogo}
          alt="Elyx Logo"
          style={{
            height: '32px',
            width: 'auto',
            marginLeft: '16px',
            marginTop: '10px',
            padding: '4px'
          }}
        />
      }
    />
  );
}