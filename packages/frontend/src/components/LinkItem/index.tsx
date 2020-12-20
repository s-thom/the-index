import React from 'react';
import './index.css';
import { LinkDetail } from '../../types';

interface LinkItemProps {
  link: LinkDetail;
}

export default function LinkItem({ link }: LinkItemProps) {
  const { url, tags } = link;

  return (
    <div className="LinkItem">
      <h2 className="LinkItem-link-heading">
        <a href={url} className="LinkItem-link" target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      </h2>
      <ul className="LinkItems-tags-list">
        {tags.map((t) => (
          <li className="LinkItems-tag" key={t}>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
