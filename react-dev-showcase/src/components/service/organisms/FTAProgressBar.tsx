import { ComponentProps } from 'react';

import { ProgressBar } from '@src/components/organisms';

export interface FTAProgressBarProps extends ComponentProps<typeof ProgressBar> {}

const FTAProgressBar = ({ ...rest }: FTAProgressBarProps) => {
  return <ProgressBar {...rest} />;
};

FTAProgressBar.displayName = 'FTAProgressBar';

export default FTAProgressBar;
