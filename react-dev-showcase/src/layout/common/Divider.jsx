import PropTypes from 'prop-types';
import styled from 'styled-components';

const HorizontalLine = styled.div`
  width: 100%;

  ::after {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background-color: ${({ theme }) => theme.gray01};
    opacity: 0.05;
    ${({ classes }) => classes && classes.Divider}
  }
`;

const Divider = ({ classes }) => {
  return <HorizontalLine classes={classes} />;
};

Divider.propTypes = {
  classes: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
};

export default Divider;
