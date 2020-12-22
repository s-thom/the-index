import { Link } from 'react-router-dom';
import styled from 'styled-components';

const BlackLink = styled(Link)`
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
