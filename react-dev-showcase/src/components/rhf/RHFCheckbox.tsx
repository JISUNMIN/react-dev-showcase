import { ChangeEvent, ComponentProps, FocusEvent } from 'react';

import { FieldValues, Path, RegisterOptions, useFormContext } from 'react-hook-form';

import { Checkbox } from '@components/atoms';

export interface RHFCheckboxProps<T extends FieldValues> extends ComponentProps<typeof Checkbox> {
  name: Path<T>;
  options?: RegisterOptions<T, Path<T>>;
}

const RHFCheckbox = <T extends FieldValues>({ name, options, onChange, onBlur, ...rest }: RHFCheckboxProps<T>) => {
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

  return <Checkbox onChange={onChangeHandler} onBlur={onBlurHandler} {...rest} {...registerReturnRest} />;
};

RHFCheckbox.displayName = 'RHFCheckbox';

export default RHFCheckbox;
