import { FieldValues, Path, useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';

import { CloseLightIcon } from '@assets/images';
import { Div, Img, Text } from '@components/atoms';
import Button, { ButtonProps } from '@components/atoms/Button';
import RHFInput, { RHFInputProps } from '@components/rhf/RHFInput';

export interface FTAInputProps<T extends FieldValues> extends RHFInputProps<T> {
  name: Path<T>;
  maxLength?: number;
  hasDeleteIcon?: boolean;
}

const Container = styled(Div)``;

const InputBox = styled(Div)`
  position: relative;
`;

const ExtendedInput = styled(RHFInput)<FieldValues>`
  width: 400px;
  height: 50px;
`;

const ButtonBox = styled(Div)`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: 10;
  padding-right: 22px;
`;

const IconButton = styled(Button)<ButtonProps>`
  cursor: pointer;
  background-color: transparent;
  border: none;
  outline: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 18px;
  height: 18px;
  background-color: ${({ theme }) => theme.colors.gray05};
`;

const InfoText = styled(Text)`
  margin-top: 5px;
  color: ${({ theme }) => theme.colors.red};
  font-size: 14px;
  font-weight: 400;
`;

const Length = styled(InfoText)`
  color: ${({ theme }) => theme.colors.gray07};
`;

const FTAInput = <T extends FieldValues>({ name, maxLength, hasDeleteIcon, ...rest }: FTAInputProps<T>) => {
  const {
    resetField,
    formState: { errors },
  } = useFormContext<T>();

  const inputValue = useWatch({ name });

  const handleClear = () => {
    resetField(name);
  };

  return (
    <Container>
      <InputBox>
        <ExtendedInput name={name} maxLength={maxLength} {...rest} />
        {/* FIXME: IconButton 완성된 후 실제 아이콘으로 수정 필요 */}
        {hasDeleteIcon && inputValue && (
          <ButtonBox>
            <IconButton onClick={handleClear}>
              <Img src={CloseLightIcon} />
            </IconButton>
          </ButtonBox>
        )}
      </InputBox>
      {errors[name] && <InfoText>{errors[name]?.message as string}</InfoText>}
      {maxLength && (
        <Length>
          {!inputValue ? 0 : inputValue.length}/{maxLength}
        </Length>
      )}
    </Container>
  );
};

FTAInput.displayName = 'FTAInput';

export default FTAInput;
