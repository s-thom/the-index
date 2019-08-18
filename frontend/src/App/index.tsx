import React, { useState, useEffect } from 'react';
import './index.css';
import { LinkDetail } from '../types';
import LinkItem from '../components/LinkItem';
import {searchByTag} from '../requests';

export default function App() {
  const [links, setLinks] = useState<LinkDetail[]>([]);

  async function requestLinksByTags(tags: string[]) {
    const links = await searchByTag(tags);
    setLinks(links);
  }

  useEffect(() => {
    requestLinksByTags(['test']);
  }, []);

  return (
    <div className="App">
      <div className="App-link-list">
        {links.map((link) => (<LinkItem key={link.id} link={link} />))}
      </div>
    </div>
  )
}
