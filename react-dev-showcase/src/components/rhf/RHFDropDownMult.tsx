import { ComponentProps } from 'react';

import { FieldValues, Path, RegisterOptions } from 'react-hook-form';

import DropdownMult from '../molecules/dropdown/DropdownMult';

export interface RHFDropDownMultiProps<T extends FieldValues> extends ComponentProps<typeof DropdownMult> {
  name: Path<T>;
  options?: RegisterOptions<T, Path<T>>;
}

const RHFDropDownMult = <T extends FieldValues>({ name, placeholder, content, ...rest }: RHFDropDownMultiProps<T>) => {
  return <DropdownMult name={name} placeholder={placeholder} content={content} {...rest} />;
};

RHFDropDownMult.displayName = 'RHFDropDownMult';

export default RHFDropDownMult;
