import { DefaultTheme } from 'styled-components';

// NOTE: 프로젝트 별 GUI에 존재하는 기본 스타일(font / color / size 등...)

const lightColors = {
  // Primary
  /** #f2ebe0 */
  brown01: '#f2ebe0',
  /** #bba283 */
  brown02: '#bba283',
  /** #847258 */
  brown03: '#847258',
  /** #605039 */
  brown04: '#605039',
  /** #423626 */
  brown05: '#423626',
  // Secondary
  /** #e5f7f1 */
  green01: '#e5f7f1',
  /** #44655b */
  green02: '#44655b', // NOTE[CS] graphy02와 색이 동일
  // Gray
  /** #ffffff */
  gray01: '#ffffff',
  /** #fafafa */
  gray02: '#fafafa',
  /** #f2f2f2 */
  gray03: '#f2f2f2',
  /** #e5e5e5 */
  gray04: '#e5e5e5',
  /** #cccccc */
  gray05: '#cccccc',
  /** #999999 */
  gray06: '#999999',
  /** #666666 */
  gray07: '#666666',
  /** #4c4c4c */
  gray08: '#4c4c4c',
  /** #303030 */
  gray09: '#303030',
  /** #202020 */
  gray10: '#202020', // NOTE[CS] button과 색이 동일
  /** #e0e0e0 */
  gray11: '#e0e0e0', // NOTE[CS] modal에 사용 : w.pse
  /** #222222 */
  gray12: '#222222', // NOTE[CS] FTAPageTitle에 사용
  // Semantic
  /** #f44b4a */
  red: '#f44b4a',
  /** #f9b811 */
  yellow: '#f9b811',
  /** #44a280 */
  green: '#44a280',
  // Graphy
  /** #b8a283 */
  graphy01: '#b8a283',
  /** #44655b */
  graphy02: '#44655b',
  /** #3089da */
  graphy03: '#3089da',
  // hover color
  /** #f0f0f0 */
  hover01: '#f0f0f0', // rgba(0, 0, 0, 0.05)
  // DropdownMult add seunghoon
  /** #e9ecef */
  hover02: '#e9ecef',
};

// eslint-disable-next-line
const darkColors = {
  // FIXME: 다크모드 컬러 아직 미정
};

export type ColorsTypes = typeof lightColors;

const lightTheme: DefaultTheme = {
  colors: lightColors,
};

const darkTheme: DefaultTheme = {
  ...lightTheme,
  // colors: darkColors,
};

const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export default themes;

/**
 * NOTE[CS] 사용은 되고 있지만 정의되어 있지 않는 색
 *
 * - #343c47
 * - #00a0b6
 * - #262626
 * - #7f7f7f
 * - #006eb9
 * - #eeeeee
 * - #222222
 * - #e1e1e1
 * - #e9e9e9
 * - #dbdbdb
 * - #7f7f7f
 * - #e0e0e0
 * - #dddddd
 * - #767676
 * - #d9d9d9
 * - #111111
 * - #dbd7d4
 * - #e9e9ed
 * - #f5f6fa
 * - #e4e4e4
 * - #b4b4b4
 */
