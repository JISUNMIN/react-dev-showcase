import { SkeletonOwnProps } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

import Skeleton from './Skeleton';
import './lazy.css';

type SkeletonVariant = SkeletonOwnProps['variant'];

export interface ImgProps {
  isLoading?: boolean;
  /** True일 경우 이미지 지연 로드 활성화 */
  lazyLoad?: boolean;
  loader?: {
    variant: SkeletonVariant;
    width?: number | string;
    height?: number | string;
  };
  alt?: string;
  src?: string;
}

const Img = ({ isLoading, loader, lazyLoad = false, ...rest }: ImgProps) =>
  isLoading ? (
    <Skeleton variant={loader?.variant || 'rectangular'} width={loader?.width} height={loader?.height} />
  ) : (
    <LazyLoadImage
      effect='opacity'
      delayMethod='throttle'
      visibleByDefault={!lazyLoad}
      wrapperProps={
        {
          // style: { transitionDelay: '1s' }, // why 필요한가유?
        }
      }
      {...rest}
    />
  );

export default Img;
