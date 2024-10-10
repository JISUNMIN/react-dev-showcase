import { ComponentProps } from 'react';

import { RHFDropDown } from '@src/components/rhf';

export interface FTADropdownProps extends ComponentProps<typeof RHFDropDown> {}

const FTADropdown = ({ ...rest }: FTADropdownProps) => {
  return <RHFDropDown {...rest} />;
};

FTADropdown.displayName = 'FTADropdown';

export default FTADropdown;
