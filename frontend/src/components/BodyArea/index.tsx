import React from "react";
import "./index.css";
import { Router, Redirect } from "@reach/router";
import SearchPage from "../SearchPage";
import NotFoundPage from "../NotFoundPage";

interface BodyAreaProps {}

export default function BodyArea(props: BodyAreaProps) {
  return (
    <div className="BodyArea">
      <Router primary={true}>
        <SearchPage path="search" />
        <Redirect from="/" to="search" noThrow />
        <NotFoundPage default />
      </Router>
    </div>
  );
}
