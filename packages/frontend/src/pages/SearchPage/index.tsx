import { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { postSearch } from '../../api-types';
import LinkItem from '../../components/LinkItem';
import SearchForm, { SearchFormValues } from '../../components/SearchForm';
import { useArrayParam, useParams, useStringParam } from '../../hooks/useParam';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
  }
`;
const StyledFormWrapper = styled.div`
  margin: 0.5em;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 250px;
  }
`;

const StyledListWrapper = styled.div`
  margin: 0.5em;
  flex-grow: 1;
`;

interface SearchPageQueryParams {
  t: string[];
  a?: string;
  b?: string;
}

export default function SearchPage() {
  const [, setParams] = useParams();
  const [tags] = useArrayParam('t');
  const [beforeString] = useStringParam('b');
  const [afterString] = useStringParam('a');

  const [initialValues] = useState<SearchFormValues>({
    tags,
    before: beforeString || undefined,
    after: afterString || undefined,
  });

  const formChangeCallback = useCallback(
    (values: SearchFormValues) => {
      const newParams: SearchPageQueryParams = {
        t: values.tags,
        a: values.after || undefined,
        b: values.before || undefined,
      };
      setParams(newParams);
    },
    [setParams],
  );

  const { data: links } = useQuery(
    ['links.search', tags, beforeString, afterString],
    async () => {
      const response = await postSearch({
        body: { tags, before: beforeString || undefined, after: afterString || undefined },
      });
      return response.links;
    },
    { keepPreviousData: true },
  );

  return (
    <StyledWrapper>
      <StyledFormWrapper>
        <SearchForm initialValues={initialValues} onChange={formChangeCallback} />
      </StyledFormWrapper>
      <StyledListWrapper>{links && links.map((link) => <LinkItem key={link.id} link={link} />)}</StyledListWrapper>
    </StyledWrapper>
  );
}
