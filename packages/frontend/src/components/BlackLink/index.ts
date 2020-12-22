import styled from 'styled-components';

const BlackLink = styled.a`
  &,
  &:hover,
  &:active,
  &:focus,
  &:visited {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:not(:hover) {
    text-decoration: none;
  }
`;
export default BlackLink;
