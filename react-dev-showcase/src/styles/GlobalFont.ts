import { createGlobalStyle } from 'styled-components';

import KoddiUDOnGothicBoldEot from '@assets/fonts/KoddiUDOnGothic-Bold.eot';
import KoddiUDOnGothicBoldWoff from '@assets/fonts/KoddiUDOnGothic-Bold.woff';
import KoddiUDOnGothicBoldWoff2 from '@assets/fonts/KoddiUDOnGothic-Bold.woff2';
import KoddiUDOnGothicExtraBoldEot from '@assets/fonts/KoddiUDOnGothic-ExtraBold.eot';
import KoddiUDOnGothicExtraBoldWoff from '@assets/fonts/KoddiUDOnGothic-ExtraBold.woff';
import KoddiUDOnGothicExtraBoldWoff2 from '@assets/fonts/KoddiUDOnGothic-ExtraBold.woff2';
import KoddiUDOnGothicRegularEot from '@assets/fonts/KoddiUDOnGothic-Regular.eot';
import KoddiUDOnGothicRegularWoff from '@assets/fonts/KoddiUDOnGothic-Regular.woff';
import KoddiUDOnGothicRegularWoff2 from '@assets/fonts/KoddiUDOnGothic-Regular.woff2';
import LGSmartUIRegular from '@assets/fonts/LGEITextTTF-Regular.ttf';

const GlobalFont = createGlobalStyle`
    @font-face {
        font-family: 'LG-smart-UI';
        src: url(${LGSmartUIRegular}) format('ttf');
    }
    @font-face {
        font-family: 'KoddiUD_r';
        src: url(${KoddiUDOnGothicRegularWoff}) format('woff1'), 
        url(${KoddiUDOnGothicRegularWoff2}) format('woff2'),
        url(${KoddiUDOnGothicRegularEot}) format('eot');
    }
    @font-face {
        font-family: 'KoddiUD_b';
        src: url(${KoddiUDOnGothicBoldWoff}) format('woff2'), 
        url(${KoddiUDOnGothicBoldWoff2}) format('woff'),
        url(${KoddiUDOnGothicBoldEot}) format('eot');
    }
    @font-face {
        font-family: 'KoddiUD_x';
        src: url(${KoddiUDOnGothicExtraBoldWoff}) format('woff2'), 
        url(${KoddiUDOnGothicExtraBoldWoff2}) format('woff'),
        url(${KoddiUDOnGothicExtraBoldEot}) format('eot');
    }
`;

export default GlobalFont;
