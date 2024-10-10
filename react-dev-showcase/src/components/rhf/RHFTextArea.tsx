import { ComponentProps, memo } from 'react';

import { FieldValues, Path, RegisterOptions, useFormContext, useWatch } from 'react-hook-form';
import styled, { CSSObject, RuleSet } from 'styled-components';

import { Div, TextArea } from '@components/atoms';
import { getByte, getLimitedByteText } from '@src/libs/utils/helpers';

const Container = styled(Div)``;

const StyledTextArea = styled(TextArea)<{ classes?: CSSObject }>`
  width: 100%;
  resize: none;
`;

const ByteContainer = styled(Div)`
  display: flex;
  justify-content: end;
  ${({ classes }) => classes && classes.Byte}
`;

export interface RHFTextAreaProps<T extends FieldValues> extends ComponentProps<typeof TextArea> {
  name: Path<T>;
  options?: RegisterOptions<T, Path<T>>;
  /** TextArea의 byteCount 존재 유무 */
  hasByte?: boolean;
  maxByte?: number;
  classes?: {
    Byte?: RuleSet<object>;
  };
  /** TextArea 높이를 위한 row */
  row?: number;
}

const RHFTextArea = <T extends FieldValues>({
  name,
  options,
  hasByte = true,
  maxByte = 10,
  row,
  classes,
  ...rest
}: RHFTextAreaProps<T>) => {
  const { register } = useFormContext<T>();
  const { onChange: registerReturnOnChange, ...restRegisterReturn } = register(name, options);
  const value: string = useWatch<FieldValues>({ name, defaultValue: '' });

  return (
    <Container>
      <StyledTextArea
        onChange={registerReturnOnChange}
        value={hasByte ? getLimitedByteText(value, maxByte) : value}
        classes={classes}
        rows={row}
        {...rest}
        {...restRegisterReturn}
      />
      {hasByte && (
        <ByteContainer classes={classes}>
          <span>{getByte(value)}</span>/<span>{maxByte.toLocaleString()}</span> Bytes
        </ByteContainer>
      )}
    </Container>
  );
};

RHFTextArea.displayName = 'RHFTextArea';

export default memo(RHFTextArea);
