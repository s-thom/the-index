import { Suspense } from 'react';
import LoadingPage from '../LoadingPage';
import LoggedInApp from '../LoggedInApp';
import './index.css';

export default function BodyArea() {
  return (
    <div className="BodyArea">
      <Suspense fallback={<LoadingPage />}>
        <LoggedInApp />
      </Suspense>
    </div>
  );
}
