import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button } from '@components/index';

const ExtendedButton = styled(Button)`
  border-radius: 8px;
  padding: 20px 24px;
  font-size: 20px;
  font-weight: 700;
  text-decoration: none;
  background-color: ${({ theme }) => theme.gray10};
  color: ${({ theme }) => theme.gray01};

  &:hover {
    text-decoration: none;
    cursor: pointer;
    color: ${({ theme }) => theme.gray01};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.gray10};
    opacity: 0.3;
    color: ${({ theme }) => theme.gray01};
    cursor: not-allowed;
  }
`;

const AuthenticationButton = ({ children, ...rest }) => <ExtendedButton {...rest}>{children}</ExtendedButton>;

AuthenticationButton.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthenticationButton;
