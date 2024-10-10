import { InputHTMLAttributes, forwardRef } from 'react';

import styled from 'styled-components';

export interface FileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: 'file';
}

const PlainFileInput = styled.input``;

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(({ ...rest }, ref) => {
  return <PlainFileInput type='file' {...rest} ref={ref} />;
});

FileInput.displayName = 'FileInput';

export default FileInput;
