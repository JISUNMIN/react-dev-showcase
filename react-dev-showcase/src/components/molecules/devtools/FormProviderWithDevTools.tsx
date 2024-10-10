import { ReactNode } from 'react';

import { DevTool } from '@hookform/devtools';
import { FormProvider, UseFormReturn } from 'react-hook-form';

export interface FormProviderProps extends UseFormReturn {
  children: ReactNode;
}

const FormProviderWithDevTools = ({ children, ...UseFormReturn }: FormProviderProps) => {
  const { control } = UseFormReturn;

  return (
    <FormProvider {...UseFormReturn}>
      {children}
      <DevTool control={control} />
    </FormProvider>
  );
};

export default FormProviderWithDevTools;
