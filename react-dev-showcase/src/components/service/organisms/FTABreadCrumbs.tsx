import { ComponentProps } from 'react';

import { BreadCrumbs } from '@src/components/organisms';

export interface FTABreadCrumbsProps extends ComponentProps<typeof BreadCrumbs> {}

const FTABreadCrumbs = ({ ...rest }: FTABreadCrumbsProps) => {
  return <BreadCrumbs {...rest} />;
};

FTABreadCrumbs.displayName = 'FTABreadCrumbs';

export default FTABreadCrumbs;
