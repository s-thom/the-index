import styled from 'styled-components';

const StyledWrapper = styled.div`
  text-align: center;
`;

const StyledInner = styled.div`
  font-size: 3.6em;
`;

export default function LoadingPage() {
  return (
    <StyledWrapper>
      <StyledInner>
        <span>Loading</span>
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </StyledInner>
    </StyledWrapper>
  );
}
