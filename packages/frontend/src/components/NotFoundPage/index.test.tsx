import ReactDOM from 'react-dom';
import NotFoundPage from '.';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NotFoundPage />, div);
  ReactDOM.unmountComponentAtNode(div);
});
