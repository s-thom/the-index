import React, { Suspense } from "react";
import "./index.css";
import { Router, Redirect } from "@reach/router";
import LoadingPage from "../LoadingPage";

const SearchPage = React.lazy(() => import("../SearchPage"));
const NotFoundPage = React.lazy(() => import("../NotFoundPage"));
const NewLinkPage = React.lazy(() => import("../NewLinkPage"));
const LinkDetailPage = React.lazy(() => import("../LinkDetailPage"));
const LoginPage = React.lazy(() => import("../LoginPage"));

interface BodyAreaProps {}

export default function BodyArea(props: BodyAreaProps) {
  return (
    <div className="BodyArea">
      <Suspense fallback={<LoadingPage />}>
        <Router primary={true}>
          <LoginPage path="login" />
          <LoadingPage path="loading" />
          <SearchPage path="search" />
          <NewLinkPage path="new" />
          <LinkDetailPage path="links/:id" />
          <Redirect from="/" to="search" noThrow />
          <NotFoundPage default />
        </Router>
      </Suspense>
    </div>
  );
}
