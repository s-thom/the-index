import { lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from '../components/Header';

const LoginPage = lazy(() => import('../pages/LoginPage'));

export default function LoggedOutApp() {
  return (
    <>
      <Header />
      <Switch>
        <Route path="*" component={LoginPage} />
      </Switch>
    </>
  );
}
