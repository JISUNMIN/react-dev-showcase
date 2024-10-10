import styled from 'styled-components';

import Swiper, { SwiperProps } from '@src/components/molecules/Swiper';

interface FTASwiper extends SwiperProps {}

const StyledSwiper = styled(Swiper)``;

const FTASwiper = ({ ...rest }: FTASwiper) => {
  return <StyledSwiper {...rest} />;
};

FTASwiper.displayName = 'FTASwiper';

export default FTASwiper;
