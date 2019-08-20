import React from 'react';
import ReactDOM from 'react-dom';
import LinkItem from '.';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LinkItem link={{
    id: '1',
    title: 'Example',
    url: 'https://example.com',
    inserted: new Date(0),
    tags: []
  }}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
