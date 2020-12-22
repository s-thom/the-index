import { PropsWithChildren, Suspense } from 'react';
import LoadingPage from '../../pages/LoadingPage';
import './index.css';

export default function BodyArea({ children }: PropsWithChildren<{}>) {
  return (
    <div className="BodyArea">
      <Suspense fallback={<LoadingPage />}>{children}</Suspense>
    </div>
  );
}
