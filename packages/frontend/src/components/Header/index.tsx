import './index.css';
import { Link } from 'react-router-dom';
import TextButton from '../TextButton';
import { useHasToken } from '../../hooks/token';

export default function Header() {
  const hasToken = useHasToken();

  return (
    <div className="Header">
      <div className="Header-heading-container">
        <Link to="/" className="hide-link">
          <h1 className="Header-heading">The Index</h1>
        </Link>
      </div>
      <nav className="Header-nav">
        <Link to="/search" className="Header-nav-link hide-link">
          <TextButton>Search</TextButton>
        </Link>
        <Link to="/new" className="Header-nav-link hide-link">
          <TextButton>New Link</TextButton>
        </Link>
        {!hasToken && (
          <Link to="/login" className="Header-nav-link hide-link">
            <TextButton>Log in</TextButton>
          </Link>
        )}
      </nav>
    </div>
  );
}
