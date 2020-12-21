import ReactDOM from 'react-dom';
import TagsForm from '.';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TagsForm tags={[]} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
