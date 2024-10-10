import { ReactNode, forwardRef } from 'react';

import { SkeletonOwnProps } from '@mui/material';
import styled from 'styled-components';

import Skeleton from './Skeleton';

const PlainSpan = styled.span``;

type SkeletonVariant = SkeletonOwnProps['variant'];

export interface SpanProps extends React.HtmlHTMLAttributes<HTMLSpanElement> {
  isLoading?: boolean;
  loader?: {
    variant: SkeletonVariant;
    width?: number;
    height?: number;
  };
  children?: ReactNode;
}

const Span = forwardRef<HTMLSpanElement, SpanProps>(({ isLoading = false, loader = {}, children, ...rest }, ref) => (
  <PlainSpan ref={ref} {...rest}>
    {isLoading ? <Skeleton variant={loader.variant || 'text'} width={loader.width} height={loader.height} /> : children}
  </PlainSpan>
));

Span.displayName = 'Span';

export default Span;
