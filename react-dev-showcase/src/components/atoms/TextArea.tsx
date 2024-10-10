import { TextareaHTMLAttributes, forwardRef, memo } from 'react';

import styled from 'styled-components';

const StyledTextArea = styled.textarea`
  width: 100%;
  resize: none;
`;

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** TextArea 높이를 위한 row */
  row?: number;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({ row, ...rest }, ref) => {
  return <StyledTextArea ref={ref} rows={row} {...rest} />;
});

TextArea.displayName = 'TextArea';

export default memo(TextArea);
