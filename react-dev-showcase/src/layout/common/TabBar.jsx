import { cloneElement, forwardRef, useEffect, useRef } from 'react';

import * as Utils from '@utils';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import { Div, Span } from '@components/Atoms/Atoms';

const StyledTabBar = styled(Div)`
  position: relative;
  padding: 0 16px;
  border-bottom: 1px solid #e0e0e0;
  background-color: ${({ theme }) => theme.gray01};
  z-index: 50;
  ${(props) => props.classes && props.classes.TabBar}
`;

const StyledTablist = styled.ul`
  position: relative;
  display: inline-flex;
  width: 100%;
  ${(props) => props.classes && props.classes.Tablist}
`;

const SelectedStyle = (props) =>
  props.selected &&
  css`
    font-weight: 700;
    color: #00a0b6;
  `;

const TabSlider = styled(Span)`
  position: absolute;
  display: block;
  content: '';
  bottom: 0;
  min-width: 5.857142857142857em;
  height: 2px;
  border-radius: 20px 20px 0 0;
  background: #00a0b6;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  ${(props) => props.classes && props.classes.TabSliderStyle}
`;

const TabContainer = styled.li`
  display: inline-block;
  ${(props) => props.classes && props.classes.Tab}
`;

const StyledTab = styled.button`
  overflow: hidden;
  position: relative;
  display: inline-block;
  vertical-align: top;
  min-width: 5.857142857142857em;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #7f7f7f;
  padding: 12px 16px;
  border: 0;
  font-size: 14px;
  font: -apple-system-body;
  font-weight: 400;
  background: none;
  text-align: center;

  ${SelectedStyle}
  ${(props) => props.classes && props.classes.TabButton}
  ${(props) => props.selected && props.classes.TabSelected}
`;

const Tab = forwardRef((props, ref) => (
  <TabContainer role='presentation' classes={props.classes}>
    <StyledTab
      role='tab'
      aria-selected={Utils.appOS === 'IOS' ? !!props.selected : false}
      ref={ref}
      {...props}
      onClick={() => {
        props.onClick(props.index, props.value);
      }}
    >
      {props.children}
    </StyledTab>
  </TabContainer>
));

Tab.displayName = 'Tab';
const tabChildrenRef = [];

const TabBar = forwardRef((props, ref) => {
  const sliderRef = useRef(null);
  const moveSlider = (position) => {
    if (sliderRef.current && tabChildrenRef && tabChildrenRef[position]) {
      let trasformX = 0;
      for (let i = 0; i < position; i += 1) {
        trasformX += tabChildrenRef[i].getBoundingClientRect().width;
      }
      sliderRef.current.style.width = `${tabChildrenRef[position].getBoundingClientRect().width}px`;
      sliderRef.current.style.transform = `translate3d(${trasformX}px, 0px, 0px)`;
    }
  };

  const onItemClickEvent = (index, value) => {
    moveSlider(index);
    if (props.onSelect) {
      props.onSelect(index, value);
    }
  };

  const resizeSliderEvent = () => {
    sliderRef.current.style.width = `${tabChildrenRef[props.selectedIndex].getBoundingClientRect().width}px`;
  };

  useEffect(() => {
    moveSlider(props.selectedIndex);
    window.addEventListener('resize', resizeSliderEvent);
    return () => {
      window.removeEventListener('resize', resizeSliderEvent);
    }; // eslint-disable-next-line
  }, [props.selectedIndex]);

  return (
    <StyledTabBar id={props.id} ref={ref} className={props.className} classes={props.classes}>
      <StyledTablist classes={props.classes} role='tablist'>
        {props.children &&
          props.children.map((child, index) => {
            if (child && child.type && child.type.displayName === 'Tab') {
              return cloneElement(child, {
                // eslint-disable-next-line react/no-array-index-key
                key: index,
                index,
                selected: props.selectedIndex === index,
                ref: (el) => {
                  tabChildrenRef[index] = el;
                },
                onClick: onItemClickEvent,
              });
            }
            // eslint-disable-next-line react/no-array-index-key
            return cloneElement(child, { key: index });
          })}
        <TabSlider ref={sliderRef} classes={props.classes} />
      </StyledTablist>
    </StyledTabBar>
  );
});

TabBar.propTypes = {
  /** 선택한 tab의 index number <br> index는 TabBar 내부에 작성된 <Tab> 테그에 대해 위에서 부터 차례대로 0부터 자동 부여된다. */
  selectedIndex: PropTypes.number,
  /** ClassName */
  className: PropTypes.string,
  /** 커스텀 스타일 오브젝트 */
  classes: PropTypes.objectOf(PropTypes.string),
  /** Children */
  children: PropTypes.node,
  /** 사용자가 항목을 선택했을 때 실행되는 콜백 함수 */
  onSelect: PropTypes.func,
  /** TabBar의 id */
  id: PropTypes.string,
};

Tab.propTypes = {
  classes: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  index: PropTypes.number, // PropTypes.string,
  value: PropTypes.string,
  children: PropTypes.node,
};

TabBar.defaultProps = {
  selectedIndex: 0,
};

export { TabBar, Tab };
