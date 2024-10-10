import { ChangeEvent, useCallback, useEffect, useState } from 'react';

import { FieldValues, Path, useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import { Div, RHFFileInput, Text } from '@components/index';
import Api from '@src/libs/Api';
import { flex, font } from '@src/styles/variables';

import { RHFFileInputProps } from '../../rhf/RHFFileInput';

const Container = styled(Div)`
  ${flex({ gap: '14px', justify: 'start' })}
`;

const FileNameContainer = styled(Div)`
  ${flex({})}
  border: 1px solid ${({ theme }) => theme.colors.gray04};
  width: 627px;
  height: 49px;
  border-radius: 8px;
`;

const PlaceholderText = styled(Text)`
  ${font({ size: '14px', weight: '400' })}
  color: ${({ theme }) => theme.colors.gray07};
`;

const Label = styled.label``;

const UploadBtn = styled(Div)`
  ${flex({})}
  ${font({ size: '12px', weight: '600' })}
  background-color: ${({ theme }) => theme.colors.gray03};
  color: ${({ theme }) => theme.colors.gray08};
  width: 100px;
  height: 36px;
  border-radius: 50px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray04};
  }
`;

const FileInputStyled = styled(RHFFileInput)`
  display: none;
`;
interface FTAImageUploadProps extends RHFFileInputProps<FieldValues> {
  videoFileName?: string;
}
const FTAVideoUpload = ({ name, videoFileName }: FTAImageUploadProps) => {
  const [fileName, setFileName] = useState<string>(
    '영상 파일은 MP4, MPG, MPEG, MKV, WMV, AVI, MOV 포맷으로 파일 크기는 최대 0.0 GB 이내여야 합니다.'
  );
  const { setValue } = useFormContext();
  const uuid = uuidv4();

  const handleImagePreview = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event?.target?.files?.[0];
      if (!selectedFile) return;

      const reader = new FileReader();

      reader.onload = async () => {
        setFileName(selectedFile.name);
        const formData = new FormData();
        formData.append('file', selectedFile);

        console.log('###selectedFile', selectedFile);
        const response = await Api.multiPartForm('v1/mys3/video', { data: formData });

        setValue(name as Path<{ name: string }>, response.data);
      };

      reader.readAsDataURL(selectedFile);
    },
    [name, setValue]
  );

  useEffect(() => {
    if (videoFileName) {
      setFileName(videoFileName);
    }
  }, [videoFileName]);

  return (
    <Container>
      <FileNameContainer>
        <PlaceholderText>{fileName}</PlaceholderText>
      </FileNameContainer>
      <Label htmlFor={`video-fileInput-${name}-${uuid}`}>
        <UploadBtn>찾아보기</UploadBtn>
        <FileInputStyled
          id={`video-fileInput-${name}-${uuid}`}
          onChange={handleImagePreview}
          name={name}
          required={true}
        />
      </Label>
    </Container>
  );
};

export default FTAVideoUpload;
