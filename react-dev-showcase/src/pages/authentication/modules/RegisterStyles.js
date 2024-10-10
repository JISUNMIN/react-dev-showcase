import { css } from 'styled-components';

export const ButtonCss = css`
  width: 75px;
  height: 55px;
  padding: 15px 18px 14px 18px;
  font-size: 16px;
  font-weight: 700;
  line-height: 18.72px;
  text-align: center;
  margin: 5px;
`;

export const IdDuplicationCheckButtonStyles = css`
  font-size: 16px;
  line-height: 1.17;
  font-weight: 600;
  margin: 0;
  height: 100%;
  max-height: 50px;
  border-radius: 8px;
`;

export const ExtendedDividerStyles = css`
  height: 2px;
  opacity: 1;
  background-color: ${({ theme }) => theme.gray10};
`;

export const BottomButtonStyles = css`
  font-size: 18px;
  line-height: 28px;
  font-weight: 600;
  width: 250px;
  border-radius: 8px;
  padding: 14px 20px;
  margin: 0;
`;
