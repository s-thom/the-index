import ReactDOM from 'react-dom';
import LoginTotpSetup from '.';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LoginTotpSetup code="test" url="test" />, div);
  ReactDOM.unmountComponentAtNode(div);
});
