import { ChangeEvent, ComponentProps } from 'react';

import { FieldValues, Path, RegisterOptions, useFormContext } from 'react-hook-form';

import { FileInput } from '../molecules';

export interface RHFFileInputProps<T extends FieldValues> extends ComponentProps<typeof FileInput> {
  name: Path<T>;
  options?: RegisterOptions<T, Path<T>>;
}

const RHFFileInput = <T extends FieldValues>({ name, options, onChange, ...rest }: RHFFileInputProps<T>) => {
  const { register } = useFormContext<T>();
  const { onChange: registerReturnOnChange, ref, ...restRegisterReturn } = register(name, options);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    registerReturnOnChange(event);
    onChange && onChange(event);
  };

  return <FileInput ref={ref} onChange={onChangeHandler} {...rest} {...restRegisterReturn} />;
};

RHFFileInput.displayName = 'RHFFileInput';

export default RHFFileInput;
