import { useEffect, useState } from 'react';
import { LinkDetail } from '../../api-types';
import { useRequester } from '../../hooks/requests';
import { getParamAsArray, getParamAsString } from '../../util/getParam';
import LinkItem from '../LinkItem';
import SearchForm from '../SearchForm';
import './index.css';

export default function SearchPage() {
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
