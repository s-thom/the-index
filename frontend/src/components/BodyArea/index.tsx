import React from "react";
import "./index.css";
import { Router } from "@reach/router";
import SearchPage from "../SearchPage";

interface BodyAreaProps {}

export default function BodyArea(props: BodyAreaProps) {
  return (
    <div className="BodyArea">
      <Router>
        <SearchPage path="search" />
      </Router>
    </div>
  );
}
