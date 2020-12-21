import { Suspense } from 'react';
import AuthorizationRoot from '../../context/AuthorizationContext';
import LoadingPage from '../LoadingPage';
import LoggedInApp from '../LoggedInApp';
import LoggedOutApp from '../LoggedOutApp';
import './index.css';

export default function BodyArea() {
  return (
    <div className="BodyArea">
      <Suspense fallback={<LoadingPage />}>
        <AuthorizationRoot fallback={<LoggedOutApp />}>
          <LoggedInApp />
        </AuthorizationRoot>
      </Suspense>
    </div>
  );
}
