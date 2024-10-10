import { memo } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

const FooterContainer = styled.div.attrs((props) => props.className && { className: props.className })`
  position: fixed;
  display: block;
  width: 100%;
  height: 56px;
  bottom: 0;
  padding: 0;
  background-color: blue;
  border-top: 1px solid #e1e1e1;
  ${(props) => props.align && `text-align: -webkit-${props.align}`}
  ${(props) => props.classes && props.classes.Footer}
`;

const Footer = memo((props) => (
  <FooterContainer classes={props.classes} {...props}>
    {props.children}
  </FooterContainer>
));

Footer.propTypes = {
  /** 컴포넌트의 정렬 방향 */
  align: PropTypes.oneOf(['center', 'left', 'right']),
  /** 커스텀 스타일 오브젝트 */
  classes: PropTypes.objectOf(PropTypes.string),
  /** Children */
  children: PropTypes.node,
};

export default Footer;
