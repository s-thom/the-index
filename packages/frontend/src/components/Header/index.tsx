import { ReactNode } from 'react';
import styled from 'styled-components';
import { PlainLink } from '../PlainComponents';

const HeaderWrapper = styled.div`
  text-align: center;
  padding: 1em 0;
`;

const HeaderHeading = styled.h1`
  font-size: 2.4em;
  margin: 0;
`;

interface HeaderProps {
  navigation?: ReactNode;
}

export default function Header({ navigation }: HeaderProps) {
  return (
    <HeaderWrapper>
      <div>
        <PlainLink to="/">
          <HeaderHeading>the-index</HeaderHeading>
        </PlainLink>
      </div>
      {navigation && <nav>{navigation}</nav>}
    </HeaderWrapper>
  );
}
