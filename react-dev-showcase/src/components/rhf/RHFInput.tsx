import { ChangeEvent, ComponentProps, FocusEvent } from 'react';

import { FieldValues, Path, RegisterOptions, useFormContext } from 'react-hook-form';

import { Input } from '@components/atoms';

export interface RHFInputProps<T extends FieldValues> extends ComponentProps<typeof Input> {
  name: Path<T>;
  options?: RegisterOptions<T, Path<T>>;
  maxLength?: number;
}

const RHFInput = <T extends FieldValues>({ name, options, maxLength, onChange, onBlur, ...rest }: RHFInputProps<T>) => {
  const { register } = useFormContext<T>();
  const {
    onChange: registerReturnOnChange,
    onBlur: registerReturnOnBlur,
    ...restRegisterReturn
  } = register(name, { ...options, maxLength });

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    registerReturnOnChange(event);
    onChange && onChange(event);
  };

  const onBlurHandler = (event: FocusEvent<HTMLInputElement>) => {
    registerReturnOnBlur(event);
    onBlur && onBlur(event);
  };

  return (
    <Input onChange={onChangeHandler} onBlur={onBlurHandler} maxLength={maxLength} {...rest} {...restRegisterReturn} />
  );
};

RHFInput.displayName = 'RHFInput';

export default RHFInput;
