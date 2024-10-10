import { useRef } from 'react';

import { MinusIcon, PlusIcon } from '@images';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import IconButton from '@components/Input/Button/IconButton';

const Button = css`
  display: inline-block;
  vertical-align: middle;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 50%;
  font-size: 0;
  background: no-repeat center;
`;

const Span = styled.span`
  display: inline-block;
  vertical-align: middle;
  min-width: 60px;
  font-size: 18px;
  font: -apple-system-title3;
  margin: 0 8px;
  text-align: center;
`;

const Input = styled.input``;

const Counter = ({ onChange, maxValue, minValue, ariaLabel, value, unit }) => {
  const inputRef = useRef(null);
  const textRef = useRef(null);

  const changeEvent = () => {
    const getValue = Number(inputRef.current.value);
    textRef.current.innerHTML = getValue;
    onChange && onChange(getValue);
  };

  const minus = () => {
    const minusNumber = Number(inputRef.current.value) - 1;
    inputRef.current.value = minusNumber < minValue ? minValue : minusNumber;
    changeEvent();
  };

  const plus = () => {
    const plusNumber = Number(inputRef.current.value) + 1;
    inputRef.current.value = plusNumber > maxValue ? maxValue : plusNumber;
    changeEvent();
  };

  return (
    <>
      <IconButton
        classes={{ Icon: Button }}
        icon={MinusIcon}
        onClick={minus}
        disabled={minValue !== undefined && minValue >= value}
      />
      <Span aria-label={`${ariaLabel}, ${value}${unit}`}>
        <Input type='hidden' value={value} ref={inputRef} />
        <span aria-hidden='true' ref={textRef}>
          {value}
        </span>
        <span aria-hidden='true'>{unit}</span>
      </Span>
      <IconButton
        classes={{ Icon: Button }}
        icon={PlusIcon}
        disabled={maxValue !== undefined && maxValue <= value}
        onClick={plus}
      />
    </>
  );
};

Counter.propTypes = {
  /** 카운터 초기 값 */
  value: PropTypes.number.isRequired,
  /** 카운터 단위 */
  unit: PropTypes.string,

  /** 카운터 최대 값 */
  maxValue: PropTypes.number,

  /** 카운터 최소 값 */
  minValue: PropTypes.number,

  /** 카운터 값 변경 이벤트 */
  onChange: PropTypes.func,
  ariaLabel: PropTypes.string,
};

Counter.defaultProps = {
  maxValue: Number.MAX_SAFE_INTEGER,
  minValue: Number.MIN_SAFE_INTEGER,
};

export default Counter;
