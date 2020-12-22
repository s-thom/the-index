import { lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import BlackLink from '../components/BlackLink';
import Header from '../components/Header';
import TextButton from '../components/TextButton';

const SearchPage = lazy(() => import('../pages/SearchPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const NewLinkPage = lazy(() => import('../pages/NewLinkPage'));
const LinkDetailPage = lazy(() => import('../pages/LinkDetailPage'));

export default function LoggedInApp() {
  return (
    <>
      <Header
        navigation={
          <>
            <BlackLink to="/" className="Header-nav-link">
              <TextButton>Search</TextButton>
            </BlackLink>
            <BlackLink to="/new" className="Header-nav-link">
              <TextButton>New Link</TextButton>
            </BlackLink>
          </>
        }
      />
      <Switch>
        <Route path="/" exact component={SearchPage} />
        <Route path="/new" exact component={NewLinkPage} />
        <Route path="/links/:id" exact component={LinkDetailPage} />
        <Route path="*" component={NotFoundPage} />
      </Switch>
    </>
  );
}
