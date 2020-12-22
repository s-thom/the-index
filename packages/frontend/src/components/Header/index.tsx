import { ReactNode } from 'react';
import BlackLink from '../BlackLink';
import './index.css';

interface HeaderProps {
  navigation?: ReactNode;
}

export default function Header({ navigation }: HeaderProps) {
  return (
    <div className="Header">
      <div className="Header-heading-container">
        <BlackLink to="/">
          <h1 className="Header-heading">The Index</h1>
        </BlackLink>
      </div>
      {navigation && <nav className="Header-nav">{navigation}</nav>}
    </div>
  );
}
