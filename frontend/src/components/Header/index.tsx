import React from "react";
import "./index.css";

interface HeaderProps {}

export default function Header(props: HeaderProps) {
  return (
    <div className="Header">
      <h1 className="Header-heading">The Index</h1>
    </div>
  );
}
