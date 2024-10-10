import { ComponentProps } from 'react';

import { FieldValues, Path, RegisterOptions } from 'react-hook-form';

import { Radio } from '@src/components/atoms';
import { RHFRadio } from '@src/components/rhf';

export interface FTARadioProps<T extends FieldValues> extends ComponentProps<typeof Radio> {
  name: Path<T>;
  options?: RegisterOptions<T, Path<T>>;
}

const FTARadio = <T extends FieldValues>({ children, ...rest }: FTARadioProps<T>) => {
  return <RHFRadio {...rest}>{children}</RHFRadio>;
};

export default FTARadio;
