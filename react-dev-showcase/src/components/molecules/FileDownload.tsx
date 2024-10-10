import { ReactNode } from 'react';

import { Button } from '@src/components';
import Api from '@src/libs/Api';

interface DownloadButtonProps {
  children: ReactNode;
  fileId: number;
}

interface FileResponse {
  fileId: number;
  fileType: string;
  fileLocation: string;
  fileUrl: string;
  originalFileName: string;
  realFileName: string;
  playTime: number;
  fileSize: number;
  useYn: boolean;
  registDate: string;
  registUser: string;
  registUtc: string;
}

/** FIXME  FileDownload 파일 다운로드 수정, 작동 X */
const FileDownload = ({ fileId, children }: DownloadButtonProps) => {
  const handleDownload = () => {
    if (!fileId) {
      console.error('File ID is not provided.');
      return;
    }

    Api.get<FileResponse>(`v1/mys3/media/${fileId}`)
      .then((response) => {
        const { fileUrl, originalFileName } = response.data;

        if (!fileUrl) {
          console.error('File URL is not available.');
          return;
        }

        const link = document.createElement('a');
        link.href = `${fileUrl}`;
        link.download = originalFileName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('File download failed:', error);
      });
  };

  return <Button onClick={handleDownload}>{children}</Button>;
};

export default FileDownload;
