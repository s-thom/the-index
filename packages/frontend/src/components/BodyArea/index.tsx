import { lazy, Suspense } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import LoadingPage from '../LoadingPage';
import './index.css';

const SearchPage = lazy(() => import('../SearchPage'));
const NotFoundPage = lazy(() => import('../NotFoundPage'));
const NewLinkPage = lazy(() => import('../NewLinkPage'));
const LinkDetailPage = lazy(() => import('../LinkDetailPage'));
const LoginPage = lazy(() => import('../LoginPage'));

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
