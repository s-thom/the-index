import { BrowserRouter } from 'react-router-dom';
import BodyArea from '../components/BodyArea';
import Header from '../components/Header';
import './index.css';

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <BodyArea />
      </BrowserRouter>
    </div>
  );
}
