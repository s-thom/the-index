import styled from 'styled-components';
import { Link } from '../../api-types';
import { PlainList } from '../PlainComponents';

const LinkItemWrapper = styled.div`
  margin: 1em 0;
`;

const LinkItemHeader = styled.h2`
  margin: 0;
`;

const LinkItemTagList = styled(PlainList)`
  display: flex;
  margin: 0;
`;

const LinkItemTag = styled.li`
  &:not(:first-child) {
    margin-left: 0.25em;
  }

  &:not(:last-child) {
    margin-right: 0.25em;
  }
`;

interface LinkItemProps {
  link: Link;
}

export default function LinkItem({ link }: LinkItemProps) {
  const { url, tags } = link;

  return (
    <LinkItemWrapper>
      <LinkItemHeader>
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      </LinkItemHeader>
      <LinkItemTagList>
        {tags.map((t) => (
          <LinkItemTag key={t}>{t}</LinkItemTag>
        ))}
      </LinkItemTagList>
    </LinkItemWrapper>
  );
}
