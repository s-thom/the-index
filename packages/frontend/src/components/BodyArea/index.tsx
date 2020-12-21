import { Redirect, BrowserRouter, Route, Switch } from 'react-router-dom';
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
        <BrowserRouter>
          <Switch>
            <Route path="login" component={LoginPage} />
            <Route path="loading" component={LoadingPage} />
            <Route path="search" component={SearchPage} />
            <Route path="new" component={NewLinkPage} />
            <Route path="links/:id" component={LinkDetailPage} />
            <Redirect from="/" to="search" />
            <Route path="*" component={NotFoundPage} />
          </Switch>
        </BrowserRouter>
      </Suspense>
    </div>
  );
}
