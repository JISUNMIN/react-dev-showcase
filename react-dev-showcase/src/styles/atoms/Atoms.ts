import { css } from 'styled-components';

// TODO: 공통적으로 많이 쓰이는 Atom 컴포넌트 스타일 모음

// NOTE: 기본 Input
export const DefaultInput = css`
  width: 100%;
  padding: 5px;
  border: 1px solid #777;
  border-radius: 5px;

  &:required {
    border: 1px solid red;
  }

  &:disabled {
    background-color: lightgray;
  }
`;

// NOTE: 기본 Button
export const DefaultButton = css`
  width: 100%;
  padding: 5px;
  border: 1px solid #777;
  border-radius: 5px;
  cursor: pointer;

  &:required {
    border: 1px solid red;
  }

  &:disabled {
    background-color: lightgray;
  }
`;
