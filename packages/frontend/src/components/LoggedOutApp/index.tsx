import { lazy } from 'react';
import { Route, Switch } from 'react-router-dom';

const LoginPage = lazy(() => import('../LoginPage'));

export default function LoggedOutApp() {
  return (
    <Switch>
      <Route path="*" component={LoginPage} />
    </Switch>
  );
}
