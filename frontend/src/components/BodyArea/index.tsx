import React from "react";
import "./index.css";
import { Router, Redirect } from "@reach/router";
import SearchPage from "../SearchPage";
import NotFoundPage from "../NotFoundPage";
import NewLinkPage from "../NewLinkPage";

interface BodyAreaProps {}

export default function BodyArea(props: BodyAreaProps) {
  return (
    <div className="BodyArea">
      <Router primary={true}>
        <SearchPage path="search" />
        <NewLinkPage path="new" />
        <Redirect from="/" to="search" noThrow />
        <NotFoundPage default />
      </Router>
    </div>
  );
}
