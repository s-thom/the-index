import React from "react";
import "./index.css";
import { Link } from "@reach/router";
import TextButton from "../TextButton";
import { useHasToken } from "../../hooks/token";

interface HeaderProps {}

export default function Header(props: HeaderProps) {
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
