import { ComponentProps } from 'react';

import { FieldValues, Path, RegisterOptions } from 'react-hook-form';

import { DropDown } from '@components/molecules';

export interface RHFDropDownProps<T extends FieldValues> extends ComponentProps<typeof DropDown> {
  name: Path<T>;
  options?: RegisterOptions<T, Path<T>>;
}

const RHFDropDown = <T extends FieldValues>({
  name,
  placeholder,
  content,
  setCheckedIndex,
  ...rest
}: RHFDropDownProps<T>) => {
  return (
    <DropDown name={name} placeholder={placeholder} content={content} setCheckedIndex={setCheckedIndex} {...rest} />
  );
};

RHFDropDown.displayName = 'RHFDropDown';

export default RHFDropDown;
