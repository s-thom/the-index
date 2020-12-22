import { useEffect, useState } from 'react';
import { LinkDetail, postSearch } from '../../api-types';
import LinkItem from '../../components/LinkItem';
import SearchForm from '../../components/SearchForm';
import { useArrayParam, useStringParam } from '../../hooks/useParam';
import './index.css';

export default function SearchPage() {
  const [links, setLinks] = useState<LinkDetail[]>([]);

  const [tags] = useArrayParam('t');
  const [beforeString] = useStringParam('b');
  const [afterString] = useStringParam('a');

  const tagsString = tags.join(',');
  // TODO: Memoise tags array properly
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    async function requestLinksByTags() {
      const response = await postSearch({ body: { tags, before: beforeString, after: afterString } });
      setLinks(response.links);
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
