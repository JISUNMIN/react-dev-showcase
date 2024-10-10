import { ReactNode } from 'react';

import Skeleton, { SkeletonOwnProps } from '@mui/material/Skeleton';

type SkeletonVariant = SkeletonOwnProps['variant'];
export interface AtomSkeletonProps {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  isLoading?: boolean;
  children?: ReactNode;
}
const AtomSkeleton = ({ variant, width, height, isLoading = true, children }: AtomSkeletonProps) =>
  isLoading ? <Skeleton variant={variant} width={width} height={height} /> : <>{children}</>;
export default AtomSkeleton;
