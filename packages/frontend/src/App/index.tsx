import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import BodyArea from '../components/BodyArea';
import Header from '../components/Header';
import LoadingPage from '../components/LoadingPage';
import LoggedOutApp from '../components/LoggedOutApp';
import AuthorizationRoot from '../context/AuthorizationContext';
import './index.css';

export default function App() {
  return (
    <div className="App">
      <Suspense fallback={<LoadingPage />}>
        <BrowserRouter>
          <AuthorizationRoot fallback={<LoggedOutApp />}>
            <Header />
            <BodyArea />
          </AuthorizationRoot>
        </BrowserRouter>
      </Suspense>
    </div>
  );
}
