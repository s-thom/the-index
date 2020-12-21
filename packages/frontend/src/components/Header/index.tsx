import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

interface HeaderProps {
  navigation?: ReactNode;
}

export default function Header({ navigation }: HeaderProps) {
  return (
    <div className="Header">
      <div className="Header-heading-container">
        <Link to="/" className="hide-link">
          <h1 className="Header-heading">The Index</h1>
        </Link>
      </div>
      {navigation && <nav className="Header-nav">{navigation}</nav>}
    </div>
  );
}
