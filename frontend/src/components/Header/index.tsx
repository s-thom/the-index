import React from "react";
import "./index.css";
import { Link } from "@reach/router";

interface HeaderProps {}

export default function Header(props: HeaderProps) {
  return (
    <div className="Header">
      <Link to="/" className="hide-link">
        <h1 className="Header-heading">The Index</h1>
      </Link>
    </div>
  );
}
