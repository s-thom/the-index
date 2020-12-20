import { Link, RouteComponentProps } from '@reach/router';
import React from 'react';
import './index.css';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function NotFoundPage(props: RouteComponentProps) {
  return (
    <div className="NotFoundPage">
      <h2 className="NotFoundPage-heading">Not Found</h2>
      <p className="NotFoundPage-text">
        Try refreshing the page, or <Link to="/">go to the home page</Link>.
      </p>
    </div>
  );
}
