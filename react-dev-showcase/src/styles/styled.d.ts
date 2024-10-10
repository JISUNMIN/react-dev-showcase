import 'styled-components';

import type { ColorsTypes } from '@src/styles/themes';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: ColorsTypes;
  }
}
