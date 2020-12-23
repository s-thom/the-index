import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  text-align: center;
`;

export default function NotFoundPage() {
  return (
    <StyledWrapper>
      <h2>Not Found</h2>
      <p>
        Try refreshing the page, or <Link to="/">go to the home page</Link>.
      </p>
    </StyledWrapper>
  );
}
