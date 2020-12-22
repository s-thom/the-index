import { lazy } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
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
            <Link component={BlackLink} to="/" className="Header-nav-link">
              <TextButton>Search</TextButton>
            </Link>
            <Link component={BlackLink} to="/new" className="Header-nav-link">
              <TextButton>New Link</TextButton>
            </Link>
          </>
        }
      />
      <Switch>
        <Route path="/" component={SearchPage} />
        <Route path="/new" component={NewLinkPage} />
        <Route path="/links/:id" component={LinkDetailPage} />
        <Route path="*" component={NotFoundPage} />
      </Switch>
    </>
  );
}
