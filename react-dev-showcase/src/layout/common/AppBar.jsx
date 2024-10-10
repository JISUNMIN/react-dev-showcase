import { cloneElement, memo, useEffect, useRef } from 'react';

import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import { Div } from '@components/Atoms/Atoms';
import IconButton from '@components/Input/Button/IconButton';
import { BackIcon } from '@images/';

const Container = styled(Div)`
  position: fixed;
  top: 0;
  width: calc(100% - env(safe-area-inset-right) - env(safe-area-inset-left));
  min-height: 56px;
  border-bottom: 1px solid #e1e1e1;
  background: ${({ theme }) => theme.gray01};
  z-index: 100;
  font-size: 0;
  ${(props) => props.classes && props.classes.AppBar}
`;

const HeaderContainer = styled(Div)`
  display: flex;
  align-items: center;
  height: 56px;
  padding: 12px 10px 12px 15px;
  ${(props) => props.classes && props.classes.HeaderContainer}
`;

const Title = styled.h1`
  display: inline-block;
  vertical-align: middle;
  width: 100%;
  max-width: calc(100vw - 75px);
  color: #262626;
  font-size: 18px;
  font: -apple-system-title3;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${(props) => props.classes && props.classes.Title}
`;

const BackButtonIcon = css`
  margin-right: 3px !important;
`;

const RightIcon = css``;

const AppBar = memo((props) => {
  const appBarRef = useRef(null);

  const onBackEvent = () => {
    if (window.dialog && props?.open) {
      return false;
    }
    if (window.bottomSheet && window.modal !== true) {
      let findClosableBottomSheet = false;
      if (Array.isArray(window.bottomSheet)) {
        // eslint-disable-next-line
        window.bottomSheet.map((bottomSheet, index) => {
          if (bottomSheet && bottomSheet.open) {
            bottomSheet.dismiss();
            window.bottomSheet[index] = undefined;
            findClosableBottomSheet = true;
          }
        });
        if (findClosableBottomSheet) {
          findClosableBottomSheet = false;
          return false;
        }
      } else if (window.modal === true) {
        return false;
      }
      if (props.onBack && props.onBack() === false) {
        return false;
      }
      // 모든 조건이 충족되지 않았을 때 기본값 반환
      return true;
    }
    // 모든 경우에 해당하는 값을 반환하도록 수정
    // native go back
    return false;
  };

  useEffect(() => {
    document.addEventListener('backbutton', onBackEvent);
    return () => {
      document.removeEventListener('backbutton', onBackEvent);
    }; // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (appBarRef && appBarRef.current) {
      setTimeout(() => {
        appBarRef.current.focus();
      }, 0);
    }
  }, [appBarRef]);

  useEffect(() => {
    if (appBarRef && appBarRef.current && props?.needAppBarFocus) {
      setTimeout(() => {
        appBarRef.current.focus();
        if (props.afterAppBarFocus) {
          props.afterAppBarFocus();
        }
      }, 500);
    }
  }, [props?.needAppBarFocus]);

  return (
    <Container classes={props.classes} ref={appBarRef}>
      <HeaderContainer classes={props.classes}>
        {/* <State
          type="back"
          onBeforeState={props.onBack}
          label={`${t("@CP_UX30_ACCESS_BACK")}`}
        > */}
        <IconButton classes={{ IconButton: BackButtonIcon }} icon={BackIcon} />
        {/* </State> */}
        {props.title && <Title classes={props.classes}>{props.title}</Title>}
        {props.icons &&
          props.icons.map((icon, index) =>
            cloneElement(icon, {
              // eslint-disable-next-line react/no-array-index-key
              key: `appbar-icon${index}`,
              classes: { IconButton: RightIcon, ...icon.props.classes },
            })
          )}
        {props.input && props.input}
      </HeaderContainer>
    </Container>
  );
});

AppBar.propTypes = {
  /** AppBar가 open된 여부 */
  open: PropTypes.bool,
  /** AppBar가 Back된 여부 */
  onBack: PropTypes.bool,
  /** AppBar의 Focus 속성이 필요한지 여부 */
  needAppBarFocus: PropTypes.bool,
  /** AppBar의 Focus가 이루어진후 수행할 함수 */
  afterAppBarFocus: PropTypes.func, // PropTypes.bool
  /** 커스텀 스타일 오브젝트 */
  classes: PropTypes.objectOf(PropTypes.string),
  /** AppBar의 메인 타이틀명 */
  title: PropTypes.string,
  /** AppBar의 아이콘 Array */
  icons: PropTypes.arrayOf(PropTypes.element),
  /** AppBar의 Input 태그 */
  input: PropTypes.node,
};

export default AppBar;
