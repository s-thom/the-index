import { Redirect, Router } from '@reach/router';
import React, { Suspense } from 'react';
import LoadingPage from '../LoadingPage';
import './index.css';

const SearchPage = React.lazy(() => import('../SearchPage'));
const NotFoundPage = React.lazy(() => import('../NotFoundPage'));
const NewLinkPage = React.lazy(() => import('../NewLinkPage'));
const LinkDetailPage = React.lazy(() => import('../LinkDetailPage'));
const LoginPage = React.lazy(() => import('../LoginPage'));

export default function BodyArea() {
  return (
    <div className="BodyArea">
      <Suspense fallback={<LoadingPage />}>
        <Router primary>
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
