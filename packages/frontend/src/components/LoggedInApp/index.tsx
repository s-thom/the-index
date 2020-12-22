import { lazy } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
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
            <Link to="/search" className="Header-nav-link hide-link">
              <TextButton>Search</TextButton>
            </Link>
            <Link to="/new" className="Header-nav-link hide-link">
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
