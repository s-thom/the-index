import { lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { PlainLink } from '../components/PlainComponents';
import Header from '../components/Header';
import TextButton from '../components/TextButton';

const SearchPage = lazy(() => import('../pages/SearchPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const NewLinkPage = lazy(() => import('../pages/NewLinkPage'));
const LinkDetailPage = lazy(() => import('../pages/LinkDetailPage'));

const NavLink = styled(PlainLink)`
  margin: 0 0.5em;
`;

export default function LoggedInApp() {
  return (
    <>
      <Header
        navigation={
          <>
            <NavLink to="/">
              <TextButton>Search</TextButton>
            </NavLink>
            <NavLink to="/new">
              <TextButton>New Link</TextButton>
            </NavLink>
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
