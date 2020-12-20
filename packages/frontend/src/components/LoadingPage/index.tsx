import React from 'react';
import './index.css';
import { RouteComponentProps } from '@reach/router';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function LoadingPage(props: RouteComponentProps) {
  return (
    <div className="LoadingPage">
      <div className="Loading">
        <span className="Loading-text">Loading</span>
        <span className="Loading-dot">.</span>
        <span className="Loading-dot">.</span>
        <span className="Loading-dot">.</span>
      </div>
    </div>
  );
}
