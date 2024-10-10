import PropTypes from 'prop-types';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 998;
  ${(props) => props.classes && props.classes.Container}
`;

const LoadingBox = styled.div`
  position: fixed;
  display: table;
  top: 50%;
  left: 50%;
  width: ${({ requiredText }) => `${requiredText ? '310px' : '94px'}`};
  height: ${({ requiredText }) => `${requiredText ? 'fit-content' : '94px'}`};
  min-height: ${({ requiredText }) => `${requiredText ? '186px' : '0px'}`};
  padding: ${({ requiredText }) => `${requiredText ? `40px 0 ${'24px'}` : `${'5px'}`}`};
  z-index: 997;
  border-radius: ${({ requiredText }) => `${requiredText ? '20px' : '50%'}`};
  transform: translate(-50%, -50%);
  box-shadow: 0 1px 8px 0 var(--popup_background_stroke_color_50);
  background-color: var(--popup_background_color_90);
  & CircularProgress {
    width: 58px;
    height: 58px;
  }
  ${(props) => props.classes && props.classes.Loading}
`;

const ProgressContainer = styled.div`
  position: inherit;
  margin-left: ${`calc(50% - 42px)`};
`;

const LoaderComment = styled.p`
  font-size: 16px;
  font: -apple-system-body;
  color: #262626;
  text-align: center;
  padding: 72px 18px 0;
  _line-height: 1;
`;

const Span = styled.span`
  ${({ classes }) => classes && classes.Span}
`;

const Loading = ({ show, classes, title, comment, requiredText }) => {
  if (!show) {
    return null;
  }

  return (
    <LoadingContainer classes={classes}>
      <LoadingBox classes={classes} aria-label='로딩중' requiredText={requiredText}>
        {requiredText && (
          <>
            <ProgressContainer />
            {(title || comment) && (
              <LoaderComment>
                {title}
                {comment && (
                  <>
                    <br />
                    <Span
                      dangerouslySetInnerHTML={{
                        __html: comment,
                      }}
                    />
                  </>
                )}
              </LoaderComment>
            )}
          </>
        )}
      </LoadingBox>
    </LoadingContainer>
  );
};

Loading.propTypes = {
  /** Loading 화면 표시 */
  show: PropTypes.bool,
  /** 부모 컴포넌트에서 전달한 style */
  classes: PropTypes.string,
  /** 로딩 box 내부 title */
  title: PropTypes.string,
  /** 로딩 box 내부 comment */
  comment: PropTypes.string,
  /** 로딩 표시 문자열 ex)로딩중 */
  requiredText: PropTypes.string,
};

export default Loading;
