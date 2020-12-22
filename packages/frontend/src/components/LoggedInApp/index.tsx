import { lazy } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import BlackLink from '../BlackLink';
import Header from '../Header';
import TextButton from '../TextButton';

const SearchPage = lazy(() => import('../../pages/SearchPage'));
const NotFoundPage = lazy(() => import('../../pages/NotFoundPage'));
const NewLinkPage = lazy(() => import('../../pages/NewLinkPage'));
const LinkDetailPage = lazy(() => import('../../pages/LinkDetailPage'));

export default function LoggedInApp() {
  return (
    <>
      <Header
        navigation={
          <>
            <Link component={BlackLink} to="/search" className="Header-nav-link">
              <TextButton>Search</TextButton>
            </Link>
            <Link component={BlackLink} to="/new" className="Header-nav-link">
              <TextButton>New Link</TextButton>
            </Link>
          </>
        }
      />
      <Switch>
        <Route path="/search" component={SearchPage} />
        <Route path="/new" component={NewLinkPage} />
        <Route path="/links/:id" component={LinkDetailPage} />
        <Route path="*" component={NotFoundPage} />
      </Switch>
    </>
  );
}
