import { ComponentProps } from 'react';

import { FieldValues, Path, RegisterOptions } from 'react-hook-form';

import RHFCheckbox from '@components/rhf/RHFCheckbox';
import { Checkbox } from '@src/components/atoms';

export interface FTACheckboxProps<T extends FieldValues> extends ComponentProps<typeof Checkbox> {
  name: Path<T>;
  options?: RegisterOptions<T, Path<T>>;
  size?: number;
}

const FTACheckbox = <T extends FieldValues>({ children, ...rest }: FTACheckboxProps<T>) => {
  return <RHFCheckbox {...rest}>{children}</RHFCheckbox>;
};

export default FTACheckbox;
