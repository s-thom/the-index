import { useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getV2Links } from '../../api-types';
import LinksList from '../../components/LinksList';
import SearchForm, { SearchFormValues } from '../../components/SearchForm';
import useParams, { QueryType } from '../../hooks/useParams';

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
const StyledList = styled(LinksList)`
  flex-grow: 1;
`;

interface SearchPageQueryParams {
  tags: string[];
  after?: string;
  before?: string;
  page?: number;
}

function extractParams(params: QueryType): SearchPageQueryParams {
  const { tags, after, before, page } = params;

  let finalTags: string[];
  if (Array.isArray(tags)) {
    finalTags = tags.map((tag) => tag.toString());
  } else if (typeof tags !== 'undefined') {
    finalTags = [tags.toString()];
  } else {
    finalTags = [];
  }
  const finalAfter = typeof after === 'string' ? after : undefined;
  const finalBefore = typeof before === 'string' ? before : undefined;
  const finalPage = typeof page === 'number' ? page : undefined;

  return {
    tags: finalTags,
    after: finalAfter,
    before: finalBefore,
    page: finalPage,
  };
}

const NUM_LINKS = 25;

export default function SearchPage() {
  const [params, setParams] = useParams();
  const { tags, after, before, page } = useMemo(() => extractParams(params), [params]);
  const currentPage = Math.floor(Math.max(page ?? 1, 0));

  const [initialFormValues] = useState<SearchFormValues>({
    tags,
    before: before || undefined,
    after: after || undefined,
  });

  const formChangeCallback = useCallback(
    (values: SearchFormValues) => {
      const newParams: SearchPageQueryParams = {
        tags: values.tags,
        after: values.after || undefined,
        before: values.before || undefined,
        page: undefined,
      };
      setParams(newParams);
    },
    [setParams],
  );

  const pageChangeCallback = useCallback(
    (newPage: number) => {
      const newParams: SearchPageQueryParams = {
        tags,
        after,
        before,
        page: newPage,
      };
      setParams(newParams);
    },
    [after, before, setParams, tags],
  );

  const { data } = useQuery(
    ['links.search', tags, before, after, currentPage],
    async () => {
      const response = await getV2Links({
        queryParams: {
          tags,
          before: before || undefined,
          after: after || undefined,
          limit: NUM_LINKS,
          offset: currentPage > 1 ? (currentPage - 1) * NUM_LINKS : 0,
        },
      });
      return response;
    },
    { keepPreviousData: true },
  );

  return (
    <StyledWrapper>
      <StyledFormWrapper>
        <SearchForm initialValues={initialFormValues} onChange={formChangeCallback} />
      </StyledFormWrapper>
      {data && <StyledList links={data.links} pagination={data.pagination} onPageChange={pageChangeCallback} />}
    </StyledWrapper>
  );
}
