import { RouteComponentProps } from '@reach/router';
import React, { useEffect, useState } from 'react';
import { useRequester } from '../../hooks/requests';
import { LinkDetail } from '../../types';
import { getParamAsArray, getParamAsString } from '../../util/getParam';
import LinkItem from '../LinkItem';
import SearchForm from '../SearchForm';
import './index.css';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function SearchPage(props: RouteComponentProps) {
  const [links, setLinks] = useState<LinkDetail[]>([]);
  const requester = useRequester();

  const tags = getParamAsArray('t');
  const beforeString = getParamAsString('b');
  const afterString = getParamAsString('a');

  const tagsString = tags.join(',');
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const beforeDate = beforeString ? new Date(beforeString) : undefined;
    const afterDate = afterString ? new Date(afterString) : undefined;

    async function requestLinksByTags() {
      const newLinks = await requester.searchByTag(tags, beforeDate, afterDate);
      setLinks(newLinks);
    }

    requestLinksByTags();
  }, [tagsString, beforeString, afterString]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <div className="SearchPage">
      <div className="SearchPage-form">
        <SearchForm />
      </div>
      <div className="SearchPage-link-list">
        {links.map((link) => (
          <LinkItem key={link.id} link={link} />
        ))}
      </div>
    </div>
  );
}
