import * as Utils from '@utils';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import { Div, Text } from '@components/Atoms/Atoms';
import Icon from '@components/Atoms/Icon';

const Container = styled(Div)`
  position: relative;
  display: block;
  width: 100%;
  height: 56px;
  padding: 0;
  justify-content: space-between;
  align-items: center;
  background-color: green;

  ${(props) =>
    props.underline &&
    css`
      border-bottom: 1px solid red;
    `}
  ${(props) => props.classes && props.classes.Header}
`;

const Title = styled.h2`
  line-height: 1.34375;
  font-size: 16px;
  font: -apple-system-body;
  font-weight: 700;
  color: #262626;
  /* margin-right: 16px; */
  width: 100%;
  margin: 0;

  ${(props) => props.classes && props.classes.Title}
`;

const SubTitle = styled(Text)`
  ${(props) => props.icon && `max-width: calc(100% - 50px);`}
  line-height: 1.458333;
  /* margin: 6px 0 0; */
  font-size: 14px;
  font: -apple-system-subheadline;
  font-weight: 400;
  color: rgba(38, 38, 38, 0.6);
  word-break: keep-all;

  ${(props) => props.classes && props.classes.SubTitle}
`;

const styleIcon = css`
  display: none;
  position: absolute;
  bottom: 16%;
  background: no-repeat center/cover;
`;

const Header = ({ title, ...props }) => (
  <Container {...props} isLoading={false}>
    {title && typeof title === 'string' && (
      <Title
        classes={props.classes}
        isLoading={props.isLoading}
        loader={props.loader}
        aria-label={Utils.appOS !== 'IOS' ? title.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/g, '') : ''}
        dangerouslySetInnerHTML={{
          __html: title,
        }}
      />
    )}
    {title && typeof title === 'object' && (
      <Title classes={props.classes} isLoading={props.isLoading} loader={props.loader}>
        {title}
      </Title>
    )}
    {props.subTitle && (
      <SubTitle
        classes={props.classes}
        icon={props.icon}
        isLoading={props.isLoading}
        loader={{ width: 'calc(100% - 70px)' }}
        dangerouslySetInnerHTML={{
          __html: props.subTitle,
        }}
      />
    )}
    {props.icon && <Icon classes={{ Icon: styleIcon }} icon={props.icon} w={48} h={48} isLoading={props.isLoading} />}
    {props.children}
  </Container>
);

Header.propTypes = {
  /** Children */
  children: PropTypes.node,
  /** 해더의 메인 타이틀명 */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /** 해더의 서브 타이틀 문구 */
  subTitle: PropTypes.string,
  /** 해더 오른쪽에 보여줄 아이콘 이미지 오브젝트 */
  icon: PropTypes.string,
  /** 해더 아이콘 클릭시 동작할 이벤트 함수 */
  iconClick: PropTypes.func,
  /** 해더 컴포넌트 커스텀 스타일 오브젝트 */
  classes: PropTypes.objectOf(PropTypes.string),
  /** Loading 화면 표시 */
  isLoading: PropTypes.bool,
  /** Loader 설정 */
  loader: PropTypes.shape({
    variant: PropTypes.oneOf(['text', 'rectangular', 'rounded', 'circular']).isRequired,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
};

export default Header;
