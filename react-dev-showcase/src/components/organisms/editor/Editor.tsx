import parser from 'html-react-parser';
import styled from 'styled-components';
import SunEditor from 'suneditor-react';
import { UploadBeforeHandler, UploadBeforeReturn, UploadInfo } from 'suneditor-react/dist/types/upload';
import 'suneditor/dist/css/suneditor.min.css';
import SunEditorCore from 'suneditor/src/lib/core';
import {
  align,
  font,
  fontColor,
  fontSize,
  formatBlock,
  hiliteColor,
  horizontalRule,
  image,
  lineHeight,
  link,
  list,
  paragraphStyle,
  table,
  template,
  textStyle,
} from 'suneditor/src/plugins';

import { Div } from '@src/components/atoms';
import Api from '@src/libs/Api';

const Container = styled(Div)`
  width: 1000px;
`;

export interface SunEditorComponentProps {
  isEditMode: boolean; // 에디터 모드 여부
  html?: string | undefined; // 부모로부터 전달받은 초기 콘텐츠
  setContents?: string;
  onChange?: (content: string) => void;
}

interface ImageUploadResponse {
  fileUrl: string;
}

const Editor = ({ isEditMode, html = '', setContents, onChange }: SunEditorComponentProps) => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  //  ** sunEditor 에선 useRef 쓰면 에러나므로 getSunEditorInstance 사용
  const getSunEditorInstance = async (sunEditor: SunEditorCore) => {};

  const handleImageUploadBefore = (
    files: File[],
    info: object,
    uploadCallback: UploadBeforeHandler
  ): UploadBeforeReturn => {
    const file = files[0];

    const formData = new FormData();
    formData.append('file', file);

    Api.multiPartForm<ImageUploadResponse>('v1/mys3/image', { data: formData })
      .then((response) => {
        Api.multiPartForm<ImageUploadResponse>('v1/mys3/image', { data: formData });
        const imageUrl = response.data.fileUrl;
        const uploadResponse = {
          result: [{ url: imageUrl, name: file.name, size: file.size }],
        };

        uploadCallback(uploadResponse);
      })
      .catch((error) => {
        console.error('Image upload failed:', error);
      });
    return undefined; //업로드 진행중
  };

  const handleImageUpload = async (
    targetImgElement: HTMLElement,
    index: number,
    state: string,
    imageInfo: UploadInfo<HTMLImageElement>
  ) => {
    if (state !== 'delete') {
      const imgSrc = targetImgElement.getAttribute('src');
      if (imgSrc && imgSrc.startsWith('data:image/')) {
        imageInfo.delete();
      }

      return;
    }
  };

  return (
    <Container>
      {isEditMode ? (
        <SunEditor
          getSunEditorInstance={getSunEditorInstance}
          onImageUploadBefore={handleImageUploadBefore}
          onImageUpload={handleImageUpload}
          setContents={setContents}
          setOptions={{
            showPathLabel: false,
            minHeight: '50vh',
            maxHeight: '50vh',
            placeholder: '',
            plugins: [
              align, // 정렬기능
              font, // 폰트 선택
              fontColor, // 폰트 색상
              fontSize, // 폰트 크기
              formatBlock, // 블록 레벨의 포맷(예: 본문, 제목, 인용문 등)을 설정할 수 있는 플러그인
              hiliteColor, // 텍스트 배경색
              horizontalRule, // 수평선 삽입
              lineHeight, // 텍스트 줄간격
              list, // 번호,불렛 리스트만들기
              paragraphStyle, // 문단 스타일을 설정할 수 있는 플러그인
              table, // 표 삽입
              template, // 미리 정의된 템플릿을 삽입할 수 있는 플러그인
              textStyle, // 텍스트 스타일(예: 이탤릭)
              image, // 이미지 삽입
              link, // 링크 삽입
            ],
            buttonList: [
              ['undo', 'redo'],
              ['font', 'fontSize', 'formatBlock'],
              ['paragraphStyle'],
              ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
              ['fontColor', 'hiliteColor'],
              ['removeFormat'],
              '/', // Line break
              ['outdent', 'indent'],
              ['align', 'horizontalRule', 'list', 'lineHeight'],
              ['table', 'link', 'image'],
            ],
            formats: ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
            font: [
              'Arial',
              'Calibri',
              'Comic Sans',
              'Courier',
              'Garamond',
              'Georgia',
              'Impact',
              'Lucida Console',
              'Palatino Linotype',
              'Segoe UI',
              'Tahoma',
              'Times New Roman',
              'Trebuchet MS',
            ],
          }}
          onChange={onChange ? onChange : (content) => console.log('content', content)}
        />
      ) : (
        <div>{parser(html)}</div>
      )}
    </Container>
  );
};

Editor.displayName = 'Editor';
export default Editor;
