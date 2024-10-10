import { ChangeEvent, useCallback, useEffect, useState } from 'react';

import { FieldValues, Path, useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import { Div, Img, RHFFileInput, Text } from '@components/index';
import Api from '@src/libs/Api';
import { flex, font } from '@src/styles/variables';

import { RHFFileInputProps } from '../../rhf/RHFFileInput';

const Container = styled(Div)`
  ${flex({ direction: 'column', gap: '12px' })}
  width: 400px;
  border: 1px solid ${({ theme }) => theme.colors.gray04};
  border-radius: 8px;
  padding: 20px;
`;

const TextContainer = styled(Div)`
  ${flex({ direction: 'column', gap: '12px' })}
  margin-top: 12px;
`;

const PlaceholderText = styled(Text)`
  ${font({ size: '14px', weight: '400' })}
  color: ${({ theme }) => theme.colors.gray07};
`;

const ImgPreview = styled(Img)`
  width: 100%;
  height: 100%;
  margin: 0 auto;
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
  imageUrl?: string;
}

const FTAImageUpload = ({ name, imageUrl }: FTAImageUploadProps) => {
  const [image, setImage] = useState<string | null>(null);
  const { setValue } = useFormContext();
  const uuid = uuidv4();

  const handleImagePreview = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event?.target?.files?.[0];
      if (!selectedFile) return;

      const reader = new FileReader();

      reader.onload = async () => {
        setImage(reader.result as string);
        const formData = new FormData();
        formData.append('file', selectedFile);
        const response = await Api.multiPartForm('v1/mys3/image', { data: formData });

        setValue(name as Path<{ name: string }>, response.data);
      };

      reader.readAsDataURL(selectedFile);
    },
    [name, setValue]
  );

  useEffect(() => {
    if (imageUrl) {
      setImage(imageUrl);
    }
  }, [imageUrl]);

  return (
    <Container>
      {image && <ImgPreview src={image} />}
      {!image && (
        <TextContainer>
          <PlaceholderText>소개 이미지는 JPG, GIF, PNG 포맷으로</PlaceholderText>
          <PlaceholderText>이미지 크기는 최대 0000*0000 px 이내여야 합니다.</PlaceholderText>
        </TextContainer>
      )}

      <Label htmlFor={`image-fileInput-${name}-${uuid}`}>
        <UploadBtn>이미지 업로드</UploadBtn>
        <FileInputStyled
          id={`image-fileInput-${name}-${uuid}`}
          onChange={handleImagePreview}
          name={name}
          required={true}
          accept='.jpg, .jpeg, .png'
        />
      </Label>
    </Container>
  );
};

export default FTAImageUpload;
