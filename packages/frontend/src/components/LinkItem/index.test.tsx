import React from 'react';
import ReactDOM from 'react-dom';
import LinkItem from '.';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <LinkItem
      link={{
        id: '1',
        url: 'https://example.com',
        inserted: '2020-01-01T00:00:00.000Z',
        tags: [],
        user: {
          id: '1',
          name: 'Alice',
        },
      }}
    />,
    div,
  );
  ReactDOM.unmountComponentAtNode(div);
});
