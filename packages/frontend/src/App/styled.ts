import { createGlobalStyle, DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
  colors: {
    primary: '#000000',
    warning: '#ff9800',
    error: '#f44336',
    outline: '#767676',
  },
  breakpoints: {
    tablet: '768px',
  },
};

const GlobalStyle = createGlobalStyle`
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: ${(props) => props.theme.colors.primary};
}

code {
  font-family: "Fira Code", source-code-pro, Menlo, Monaco, Consolas,
    "Courier New", monospace;
}
`;

export default GlobalStyle;
