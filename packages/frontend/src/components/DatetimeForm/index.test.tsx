import React from 'react';
import ReactDOM from 'react-dom';
import DatetimeForm from '.';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DatetimeForm date={undefined} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
