import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const PlainList = styled.ul`
  list-style: none;
  margin: 1em;
  padding: 0;
`;

export const PlainInput = styled.input`
  width: 100%;
  font-size: 1.1em;
`;

export const PlainLink = styled(Link)`
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
