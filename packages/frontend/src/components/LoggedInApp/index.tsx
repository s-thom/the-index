import { lazy } from 'react';
import { Route, Switch } from 'react-router-dom';

const SearchPage = lazy(() => import('../SearchPage'));
const NotFoundPage = lazy(() => import('../NotFoundPage'));
const NewLinkPage = lazy(() => import('../NewLinkPage'));
const LinkDetailPage = lazy(() => import('../LinkDetailPage'));

export default function LoggedInApp() {
  return (
    <Switch>
      <Route path="/search" component={SearchPage} />
      <Route path="/new" component={NewLinkPage} />
      <Route path="/links/:id" component={LinkDetailPage} />
      <Route path="*" component={NotFoundPage} />
    </Switch>
  );
}
