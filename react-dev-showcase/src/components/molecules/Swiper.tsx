import React, { useRef } from 'react';

import styled from 'styled-components';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Keyboard, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { Swiper as SwiperContainer, SwiperRef, SwiperSlide } from 'swiper/react';

import { Div } from '@components/atoms';
import { NextButtonIcon, PrevButtonIcon } from '@src/assets/images';
import { grid } from '@src/styles/variables';

export interface SwiperProps {
  /** 좌/우 버튼 여부 */
  navigation?: boolean;
  /** 하단 페이지네이션 여부 */
  pagination?: boolean;
  /** 한 슬라이드에 표시할 항목 개수 */
  slidesPerView?: number;
  /** 슬라이드 사이의 gap */
  spaceBetween?: number;
  /** SwiperSlides */
  children: React.ReactNode;
}

const Container = styled(Div)`
  ${grid({})}
`;

const ExtendedSwiper = styled(SwiperContainer)`
  width: 100%;
  height: 110%;

  .swiper-button-next {
    width: 44px;
    height: 44px;
    background-image: url(${NextButtonIcon});
  }

  .swiper-button-next::after {
    display: none;
  }

  .swiper-button-prev {
    width: 44px;
    height: 44px;
    background-image: url(${PrevButtonIcon});
  }
  .swiper-button-prev::after {
    display: none;
  }

  .swiper-pagination-bullet {
    width: 12px;
    height: 7px;
    border-radius: 30px;
    background-color: #e5e5e5;
    opacity: 1;
  }
  .swiper-pagination-bullet-active {
    width: 28px;
    height: 7px;
    border-radius: 30px;
    background-color: ${({ theme }) => theme.colors.gray08};
  }
`;

const Swiper: React.FC<SwiperProps> = ({
  navigation = true,
  pagination = true,
  slidesPerView = 2,
  spaceBetween = 30,
  children,
  ...rest
}) => {
  const swiperRef = useRef<SwiperRef | null>(null);

  const handleMouseEnter = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.allowTouchMove = false;
    }
  };

  const handleMouseLeave = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.allowTouchMove = true;
    }
  };
  return (
    <Container>
      <ExtendedSwiper
        ref={swiperRef}
        navigation={navigation}
        pagination={pagination}
        slidesPerView={slidesPerView}
        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
        spaceBetween={spaceBetween}
        {...rest}
      >
        {React.Children.map(children, (child, index) => (
          <SwiperSlide
            onMouseEnter={index === 3 ? handleMouseEnter : undefined}
            onMouseLeave={index === 3 ? handleMouseLeave : undefined}
          >
            {child}
          </SwiperSlide>
        ))}
      </ExtendedSwiper>
    </Container>
  );
};

export default Swiper;
