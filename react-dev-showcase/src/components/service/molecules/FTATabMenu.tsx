import { ComponentProps } from 'react';

import { TabMenu } from '@src/components/molecules';

export interface FTATabMenuProps extends ComponentProps<typeof TabMenu> {}

const FTATabMenu = ({ children, ...rest }: FTATabMenuProps) => {
  return <TabMenu {...rest}>{children}</TabMenu>;
};

export default FTATabMenu;
