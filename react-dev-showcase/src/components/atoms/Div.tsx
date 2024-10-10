import React, { ComponentProps, forwardRef } from 'react';

import { SkeletonOwnProps } from '@mui/material';
import styled, { CSSObject } from 'styled-components';

import Skeleton from './Skeleton';

const Container = styled.div<{ classes?: CSSObject }>``;
type SkeletonVariant = SkeletonOwnProps['variant'];

export interface DivProps extends ComponentProps<'div'> {
  classes?: CSSObject;
  isLoading?: boolean;
  loader?: {
    variant: SkeletonVariant;
    width?: number | string;
    height?: number | string;
  };
  children?: React.ReactNode;
}

const Div = forwardRef<HTMLDivElement, DivProps>(
  ({ className, classes, isLoading = false, loader = {}, children, ...props }, ref) => (
    <Container ref={ref} className={className} classes={classes} {...props}>
      {isLoading ? (
        <Skeleton
          variant={loader.variant || 'rectangular'}
          width={loader.width || '100%'}
          height={loader.height || '100%'}
        />
      ) : (
        children
      )}
    </Container>
  )
);

Div.displayName = 'Div';

export default Div;
