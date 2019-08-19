import React from "react";
import "./index.css";
import { RouteComponentProps, Link } from "@reach/router";

interface NotFoundPageProps extends RouteComponentProps {}

export default function NotFoundPage(props: NotFoundPageProps) {
  return (
    <div className="NotFoundPage">
      <h2 className="NotFoundPage-heading">Not Found</h2>
      <p className="NotFoundPage-text">
        Try refreshing the page, or <Link to="/">go to the home page</Link>.
      </p>
    </div>
  );
}
