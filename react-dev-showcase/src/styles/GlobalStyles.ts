import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyles = createGlobalStyle`    
  ${reset}

  #root {
    font-family : "LG-smart-UI"
  }

  * {
    box-sizing: border-box;
  }

`;

export default GlobalStyles;
