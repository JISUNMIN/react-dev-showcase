import { ComponentProps } from 'react';

import { FieldValues, Path, RegisterOptions } from 'react-hook-form';

import { DropDown } from '@src/components/molecules';
import RHFDropDown from '@src/components/rhf/RHFDropDown';

export interface FTADropdownProps<T extends FieldValues> extends ComponentProps<typeof DropDown> {
  name: Path<T>;
  options?: RegisterOptions<T, Path<T>>;
}

const FtHfDropdown = <T extends FieldValues>({ name, ...rest }: FTADropdownProps<T>) => {
  return <RHFDropDown name={name} {...rest} />;
};

FtHfDropdown.displayName = 'FTADropdown';

export default FtHfDropdown;
