import { useQuery } from 'react-query';
import styled from 'styled-components';
import { postSearch } from '../../api-types';
import LinkItem from '../../components/LinkItem';
import SearchForm from '../../components/SearchForm';
import { useArrayParam, useStringParam } from '../../hooks/useParam';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;
const StyledFormWrapper = styled.div`
  margin: 0.5em;

  @media (min-width: 768px) {
    width: 250px;
  }
`;

const StyledListWrapper = styled.div`
  margin: 0.5em;
  flex-grow: 1;
`;

export default function SearchPage() {
  const [tags] = useArrayParam('t');
  const [beforeString] = useStringParam('b');
  const [afterString] = useStringParam('a');

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
        <SearchForm />
      </StyledFormWrapper>
      <StyledListWrapper>{links && links.map((link) => <LinkItem key={link.id} link={link} />)}</StyledListWrapper>
    </StyledWrapper>
  );
}
