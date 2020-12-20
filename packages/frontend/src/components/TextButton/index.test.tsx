import React from 'react';
import ReactDOM from 'react-dom';
import TextButton from '.';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TextButton>Example</TextButton>, div);
  ReactDOM.unmountComponentAtNode(div);
});
