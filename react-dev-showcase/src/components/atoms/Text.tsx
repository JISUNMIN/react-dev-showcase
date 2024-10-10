import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { SkeletonOwnProps } from '@mui/material';
import styled, { CSSObject } from 'styled-components';

import { Skeleton } from '.';

const Container = styled.div<{ classes?: CSSObject }>``;
type SkeletonVariant = SkeletonOwnProps['variant'];

export interface TextProps extends ComponentPropsWithoutRef<'p'> {
  classes?: CSSObject;
  isLoading?: boolean;
  loader?: {
    variant: SkeletonVariant;
    width?: number | string;
    height?: number | string;
  };
}

const PlainText = styled.p``;

const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, classes, isLoading = false, loader = {}, ...rest }, ref) => (
    <Container ref={ref} className={className} classes={classes}>
      {isLoading ? (
        <Skeleton
          variant={loader.variant || 'rectangular'}
          width={loader.width || '100%'}
          height={loader.height || '100%'}
        />
      ) : (
        <PlainText ref={ref} {...rest} />
      )}
    </Container>
  )
);

Text.displayName = 'Text';

export default Text;
