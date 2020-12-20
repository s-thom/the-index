import React from 'react';
import ReactDOM from 'react-dom';
import LoginUserForm from '.';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LoginUserForm onSubmit={() => undefined} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
