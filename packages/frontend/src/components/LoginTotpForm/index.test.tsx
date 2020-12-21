import ReactDOM from 'react-dom';
import LoginTotpForm from '.';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LoginTotpForm onSubmit={() => undefined} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
