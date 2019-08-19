import React from "react";
import "./index.css";
import { RouteComponentProps } from "@reach/router";

interface NotFoundPageProps extends RouteComponentProps {}

export default function NotFoundPage(props: NotFoundPageProps) {
  return (
    <div className="NotFoundPage">
      <h2 className="NotFoundPage-heading">Not Found</h2>
    </div>
  );
}
