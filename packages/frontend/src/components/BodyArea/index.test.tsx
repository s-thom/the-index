import ReactDOM from 'react-dom';
import BodyArea from '.';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BodyArea />, div);
  ReactDOM.unmountComponentAtNode(div);
});
