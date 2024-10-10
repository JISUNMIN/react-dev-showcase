import { ChangeEvent, useCallback, useState } from 'react';

import { FieldValues } from 'react-hook-form';
import styled from 'styled-components';

import { Div, Text } from '@src/components/atoms';
import { RHFFileInput } from '@src/components/rhf';
import { RHFFileInputProps } from '@src/components/rhf/RHFFileInput';
import Api from '@src/libs/Api';
import { flex, font, size } from '@src/styles/variables';

interface FTAFileInputProps extends RHFFileInputProps<FieldValues> {
  adminId: string | number;
  fileOnChange: (file: File, responseData: number) => void;
}

const Container = styled(Div)`
  ${flex({ gap: '14px', justify: 'start' })};
`;

const FileNameContainer = styled(Div)`
  ${flex({})};
  ${size({ w: '627px', h: '49px' })}
  border: 1px solid ${({ theme }) => theme.colors.gray04};
  border-radius: 8px;
`;

const PlaceholderText = styled(Text)`
  ${font({ size: '14px', weight: '400' })};
  color: ${({ theme }) => theme.colors.gray07};
`;

const Label = styled.label``;

const UploadBtn = styled(Div)`
  ${flex({})};
  ${font({ size: '12px', weight: '600' })};
  ${size({ w: '100px', h: '36px' })}
  background-color: ${({ theme }) => theme.colors.gray03};
  color: ${({ theme }) => theme.colors.gray08};
  border-radius: 50px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray04};
  }
`;

const FileInputStyled = styled(RHFFileInput)`
  display: none;
`;

const FTAFileInput = ({ name, adminId, fileOnChange }: FTAFileInputProps) => {
  const [fileName, setFileName] = useState<string>('파일 등록');

  const handleFilePreview = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event?.target?.files?.[0];
      if (!selectedFile) return;

      if (!adminId) {
        console.error('adminInfoId가 존재하지 않습니다.');
        return;
      }

      const reader = new FileReader();

      reader.onload = async () => {
        setFileName(selectedFile.name);
        const formData = new FormData();
        formData.append('file', selectedFile);

        // FIXME api-controller - uploadFile API  가 맞는 지 ? response 숫자값만 존재
        const response = await Api.multiPartForm(`/v1/api/upload?adminInfoId=${adminId}`, {
          data: formData,
        });
        fileOnChange && fileOnChange(selectedFile, response.data as number);
      };
      reader.readAsDataURL(selectedFile);
    },
    [adminId, fileOnChange]
  );

  return (
    <Container>
      <FileNameContainer>
        <PlaceholderText>{fileName}</PlaceholderText>
      </FileNameContainer>
      <Label htmlFor={`fileInput-${name}`}>
        <UploadBtn>찾아보기</UploadBtn>
        <FileInputStyled id={`fileInput-${name}`} onChange={handleFilePreview} name={name} required={true} />
      </Label>
    </Container>
  );
};

FTAFileInput.displayName = 'FTAFileInput';

export default FTAFileInput;
