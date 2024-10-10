import { cloneElement, useCallback, useEffect, useRef, useState } from 'react';

import * as Utils from '@utils';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { Div, Span } from '@components/Atoms/Atoms';
import Html from '@components/DataDisplay/Html';
import ScrollableContainer from '@components/Layout/ScrollableContainer';
import HiddenDiv from '@components/Surface/HiddenDiv';

const Container = styled(Div)`
  display: ${({ isShow }) => (isShow ? 'inline-block' : 'none')};
  visibility: ${({ isShow }) => (isShow ? 'visible' : 'hidden')};
  position: absolute;
  padding: 7px ${({ closable }) => (closable ? '4.89%' : '21px')} 12px 21px;
  border: 1px solid #00a0b6;
  border-radius: 11px;
  background: ${({ theme }) => theme.gray01};
  margin: 0 6px;
  top: -1000px;
  z-index: 101;
  max-width: calc(100% - 12px - env(safe-area-inset-left) - env(safe-area-inset-right));
  margin-left: calc(env(safe-area-inset-left) + 6px);
  margin-right: calc(env(safe-area-inset-right) + 6px);

  ${({ classes }) => classes && classes.Tooltip}
`;

const Arrow = styled(Div)`
  position: absolute;
  display: inline-block;
  content: '';
  top: -5px;
  right: 14px;
  width: 10px;
  height: 10px;
  border: 1px solid #00a0b6;
  border-bottom: 0;
  border-right: 0;
  border-radius: 3px 0 0 0;
  transform: rotate(45deg);
  background: ${({ theme }) => theme.gray01};
  ${({ classes }) => classes && classes.Arrow};
`;

const Header = styled(Div)`
  margin-bottom: 4px;
  ${({ classes }) => classes && classes.Header}
`;

const Title = styled(Span)`
  display: inline-block;
  line-height: 1;
  font-size: 16px;
  font: -apple-system-body;
  color: #262626;
  -webkit-text-size-adjust: none;

  & span {
    display: inline-block;
    vertical-align: top;
    line-height: 1.6;
    margin-left: 8px;
    font-size: 10px;
    font: -apple-system-caption2;
    color: #7f7f7f;
    -webkit-text-size-adjust: none;
  }

  ${({ classes }) => classes && classes.Title}
`;

const Contents = styled(ScrollableContainer)`
  padding-right: 6px;
  -webkit-text-size-adjust: none;
  ${({ classes }) => classes && classes.Contents}
`;

let tootipId = 0;

const OriginTooltip = ({ title, classes, closable, contents, tooltip, tooltipRef, arrowRef, doNothing }) => (
  <Container
    {...(Utils.appOS === 'IOS' ? { 'aria-expanded': tooltip } : {})}
    ref={tooltipRef}
    onTouchStart={doNothing}
    role='dialog'
    aria-hidden={!tooltip}
    id={`tooltipbox-${tootipId}`}
    isShow={tooltip}
    closable={closable}
    classes={classes}
    tabIndex={-1}
  >
    <Arrow ref={arrowRef} classes={classes} />
    <Header id='tooltipTit' classes={classes}>
      {title && (
        <Title tabIndex={0} classes={classes}>
          <Html html={title} />
        </Title>
      )}
    </Header>
    <Contents tabIndex={0} classes={classes}>
      {contents || null}
    </Contents>
  </Container>
);

OriginTooltip.propTypes = {
  title: PropTypes.string,
  /** 커스텀 스타일 오브젝트 */
  classes: PropTypes.objectOf(PropTypes.string),
  closable: PropTypes.bool,
  contents: PropTypes.string,
  tooltip: PropTypes.bool,
  tooltipRef: PropTypes.shape({ current: PropTypes.objectOf(PropTypes.string) }),
  arrowRef: PropTypes.shape({ current: PropTypes.objectOf(PropTypes.string) }),
  doNothing: PropTypes.func,
};

const tooltipMargin = 12;
const tooltipArrowDefaultLeft = 8;
const tooltipMarginTop = 5;
const arrowTop = 6;

const Tooltip = ({ children, show, onClose, onOpen, autoHide, fixedtop, fixed, ...props }) => {
  tootipId += 1;
  const [tooltip, setTooltip] = useState(!!show);
  const tooltipRef = useRef(null);
  const arrowRef = useRef(null);
  const childRef = useRef(null);

  function handleClick() {
    setTooltip(!tooltip);
  }

  const doNothing = useCallback(
    (e) => {
      if (tooltip) e.stopPropagation();
    },
    [tooltip]
  );

  const tootipClickEvent = (e) => {
    e.stopPropagation();
    handleClick(e);
  };

  const hideTooltip = () => {
    setTooltip(false);
    onClose && onClose();
  };

  // only for blog type contents
  function fixedtopCal() {
    return !!fixedtop;
  }

  const computeTooltilp = () => {
    const targetRect = childRef.current.getBoundingClientRect();
    const targetTop = targetRect.top;
    const targetLeft = targetRect.left;
    const targetWidth = targetRect.width;
    const targetHeight = targetRect.height;
    const iosSafeArea = Number(getComputedStyle(document.documentElement).getPropertyValue('--sal').split('px', 1));

    const tooltipWidth =
      tooltipRef.current.offsetWidth > tooltipRef.current.offsetHeight
        ? tooltipRef.current.offsetWidth + tooltipMargin
        : document.body.clientWidth;

    const tooltipHeight = tooltipRef.current.offsetHeight;

    const scrollHeight = window.innerHeight;
    const scrollWidth = Math.max(
      tooltipWidth,
      window.innerWidth < document.body.scrollWidth ? window.innerWidth : document.body.scrollWidth
    );

    const arrowWidth = arrowRef.current.offsetWidth;

    let computedTooltipTop = targetTop + targetHeight + tooltipMarginTop;
    let arrowOverTop = 0;
    if (computedTooltipTop + tooltipHeight > scrollHeight || fixedtopCal()) {
      arrowOverTop = -1;
      computedTooltipTop = targetTop - tooltipHeight - tooltipMarginTop;
    }

    // left
    let computedTooltipLeft = targetLeft + targetWidth / 2 - tooltipWidth / 2 - iosSafeArea;
    let arrowOverLeft = 0;
    if (computedTooltipLeft + tooltipWidth > scrollWidth) {
      arrowOverLeft = computedTooltipLeft + tooltipWidth - scrollWidth;
      computedTooltipLeft -= arrowOverLeft;
    }

    // normalize
    if (computedTooltipTop < 0) {
      computedTooltipTop = 0;
    }

    if (computedTooltipLeft < 0) {
      arrowOverLeft = computedTooltipLeft;
      computedTooltipLeft = 0;
    }

    if (fixedtopCal()) {
      tooltipRef.current.style.top = `${computedTooltipTop + window.scrollY}px`;
    } else {
      tooltipRef.current.style.top = `${computedTooltipTop + (!fixed ? window.scrollY : 0)}px`;
    }
    tooltipRef.current.style.left = `${computedTooltipLeft}px`;

    // arrow
    let arrowLeft = tooltipWidth / 2 + arrowOverLeft - arrowWidth / 2 - (tooltipArrowDefaultLeft - 1);
    if (arrowLeft + arrowWidth / 2 > tooltipWidth - tooltipArrowDefaultLeft + tooltipMargin) {
      arrowLeft = tooltipWidth - tooltipArrowDefaultLeft + tooltipMargin - arrowWidth;
    } else if (arrowLeft < tooltipArrowDefaultLeft) {
      arrowLeft = tooltipArrowDefaultLeft;
    }

    arrowRef.current.style.left = `${arrowLeft}px`;
    arrowRef.current.style.top = arrowOverTop < 0 ? `${tooltipHeight - arrowTop}px` : `-${arrowTop}px`;
    arrowRef.current.style.transform = arrowOverTop < 0 ? 'rotate(225deg)' : 'rotate(45deg)';
  };

  useEffect(() => {
    setTooltip(!!show);
  }, [show]);

  useEffect(() => {
    tooltip && onOpen && onOpen();
    tooltip && computeTooltilp();
    if (Utils.appOS === 'IOS') {
      if (tooltip && tooltipRef && tooltipRef.current) {
        setTimeout(() => {
          tooltipRef.current.focus();
        }, 0);
      }
    }
    // eslint-disable-next-line
  }, [tooltip]);

  function closeTooltipEvent() {
    hideTooltip();
  }

  function orientationEvent() {
    autoHide !== false && hideTooltip();
    setTimeout(() => {
      computeTooltilp();
    }, 50);
  }

  useEffect(() => {
    window.addEventListener('touchstart', closeTooltipEvent);
    window.addEventListener('orientationchange', orientationEvent);
    return () => {
      window.removeEventListener('touchstart', closeTooltipEvent);
      window.removeEventListener('orientationchange', orientationEvent);
    }; // eslint-disable-next-line
  }, []);

  return (
    <>
      {children && (
        <>
          {cloneElement(children, {
            ref: childRef,
            'aria-haspopup': 'true',
            tabIndex: 0,
            id: `hdvi-${tootipId}`,
            onTouchStart: doNothing,
            onClick: (children.props && children.props.onClick) || tootipClickEvent,
            props: children.props,
          })}
          <HiddenDiv aria-owns={`tooltipbox-${tootipId}`} />
        </>
      )}
      {ReactDOM.createPortal(
        OriginTooltip({
          children,
          show,
          onClose,
          onOpen,
          autoHide,
          fixedtop,
          fixed,
          ...props,
          // Tooltip component에서 생성된 OriginTooltip을 위한 props
          tooltip,
          tooltipRef,
          arrowRef,
          doNothing,
        }),
        document.getElementById('root')
      )}
    </>
  );
};

Tooltip.propTypes = {
  /** Children */
  children: PropTypes.node,
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  autoHide: PropTypes.bool,
  fixedtop: PropTypes.bool,
  fixed: PropTypes.bool,
};

export default Tooltip;
