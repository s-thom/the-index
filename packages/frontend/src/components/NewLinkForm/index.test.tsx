import ReactDOM from 'react-dom';
import NewLinkForm from '.';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NewLinkForm />, div);
  ReactDOM.unmountComponentAtNode(div);
});
