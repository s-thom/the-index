import { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

const ButtonBase = styled.button`
  background: transparent;
  border: none;
  display: inline-block;
  padding: 0;
  margin: 0;
  vertical-align: baseline;
  outline: 0;
  font-size: 1em;

  &:not(:disabled) {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  &:disabled {
    opacity: 0.8;
  }
`;

export default function TextButton({ children, ...props }: ButtonHTMLAttributes<{}>) {
  return (
    <ButtonBase type="button" {...props}>
      <span>[</span>
      {children}
      <span>]</span>
    </ButtonBase>
  );
}
