// eslint-disable-next-line no-restricted-imports
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      warning: string;
      error: string;
    };
  }
}
