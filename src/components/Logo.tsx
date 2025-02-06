import { Link } from 'react-router-dom';
import elyxLogo from '../img/homePage/elyx-logo-blue.svg';

export interface LogoProps {
  size?: number;
}

export function Logo({ size = 32 }: LogoProps): JSX.Element {
  return (
    <Link to="/">
      <img
        src={elyxLogo}
        alt="Elyx Logo"
        style={{
          height: `${size}px`,
          width: 'auto',
          padding: '2px',
          marginTop: '12px',
          objectFit: 'contain'
        }}
      />
    </Link>
  );
}