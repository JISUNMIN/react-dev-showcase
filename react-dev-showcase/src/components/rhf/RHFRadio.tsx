import { ChangeEvent, ComponentProps, FocusEvent } from 'react';

import { FieldValues, Path, RegisterOptions, useFormContext } from 'react-hook-form';

import { Radio } from '@components/atoms';

export interface RHFRadioProps<T extends FieldValues> extends ComponentProps<typeof Radio> {
  name: Path<T>;
  options?: RegisterOptions<T, Path<T>>;
}

const RHFRadio = <T extends FieldValues>({ name, options, onChange, onBlur, ...rest }: RHFRadioProps<T>) => {
  const { register } = useFormContext<T>();
  const {
    onChange: registerReturnOnChange,
    onBlur: registerReturnOnBlur,
    ...registerReturnRest
  } = register(name, options);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    registerReturnOnChange(event);
    onChange && onChange(event);
  };

  const onBlurHandler = (event: FocusEvent<HTMLInputElement>) => {
    registerReturnOnBlur(event);
    onBlur && onBlur(event);
  };

  return <Radio onChange={onChangeHandler} onBlur={onBlurHandler} {...rest} {...registerReturnRest} />;
};

RHFRadio.displayName = 'RHFRadio';

export default RHFRadio;
