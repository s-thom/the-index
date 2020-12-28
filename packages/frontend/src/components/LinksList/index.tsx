import styled from 'styled-components';
import { Link, Pagination as PaginationType } from '../../api-types';
import LinkItem from '../../components/LinkItem';
import Pagination from '../Pagination';

interface LinksListProps {
  links: Link[];
  pagination: PaginationType;
  onPageChange?: (newPage: number) => void;
  className?: string;
}

const StyledListWrapper = styled.div`
  margin: 0.5em;
  flex-grow: 1;
`;

export default function LinksList({ links, pagination, onPageChange, className }: LinksListProps) {
  const numPages = Math.max(Math.ceil(pagination.total / pagination.limit), 1);

  return (
    <div className={className}>
      {numPages > 1 && <Pagination page={pagination.page} numPages={numPages} onPageSelect={onPageChange} />}
      <StyledListWrapper>
        {links.map((link) => (
          <LinkItem key={link.id} link={link} />
        ))}
      </StyledListWrapper>
      {numPages > 1 && <Pagination page={pagination.page} numPages={numPages} onPageSelect={onPageChange} />}
    </div>
  );
}
