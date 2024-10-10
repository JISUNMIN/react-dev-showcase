import { ComponentProps } from 'react';

import { FieldValues } from 'react-hook-form';

import RHFDropDownMult from '@src/components/rhf/RHFDropDownMult';

export interface FTADropdownMultProps<T extends FieldValues> extends ComponentProps<typeof RHFDropDownMult<T>> {}

const FTADropdownMult = <T extends FieldValues>({ name, ...rest }: FTADropdownMultProps<T>) => {
  return <RHFDropDownMult name={name} {...rest} />;
};

FTADropdownMult.displayName = 'FTADropdownMult';

export default FTADropdownMult;
