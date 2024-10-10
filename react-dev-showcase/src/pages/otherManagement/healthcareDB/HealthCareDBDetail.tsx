/** 기타 관리 > 헬스케어 DB (테이블) / 헬스케어 DB 단건 조회 */
import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Div, FTAPageTitle, Text } from '@src/components';
import FileDownload from '@src/components/molecules/FileDownload';
import useHealthcareDB from '@src/hooks/rest/useHealthcareDB';
import GridField from '@src/layout/grid/GridField';
import DeleteButton from '@src/pages/modules/detailButtons/DeleteButton';
import GoToEditButton from '@src/pages/modules/detailButtons/GoToEditButton';
import GoToListButton from '@src/pages/modules/detailButtons/GoToListButton';
import PATHS from '@src/router/path';
import { flex } from '@src/styles/variables';

const Wrapper = styled(Div)`
  padding: 20px;
`;

const BasicInfoContainer = styled(Div)``;

const ButtonContainer = styled(Div)`
  ${flex({})}
  padding: 50px 0;
`;

const FileDownloadText = styled(Text)`
  ${flex({ justify: 'flex-start' })}
`;

const HealthCareDBDetail = () => {
  const navigate = useNavigate();

  const { processedDetailData, deleteMutation } = useHealthcareDB();

  const handleGoList = () => {
    navigate(`${PATHS.ROOT}${PATHS.HEALTHCAREDB}`);
  };

  const handleGoEdit = () => {
    navigate(`${PATHS.ROOT}${PATHS.HEALTHCAREDB_EDIT}/${processedDetailData?.healthCareInfoId}`);
  };

  const handleDelete = useCallback(() => {
    const param = { healthCareInfoId: processedDetailData?.healthCareInfoId };

    deleteMutation.mutate(param, {
      onSuccess: () => {
        navigate(`${PATHS.ROOT}${PATHS.HEALTHCAREDB}`);
      },
      onError: () => {
        console.error('error delete');
      },
    });
  }, [deleteMutation, navigate, processedDetailData?.healthCareInfoId]);

  return (
    <Wrapper>
      <FTAPageTitle title='헬스케어 DB' />
      <BasicInfoContainer>
        <GridField label='DB 종류 선택'>
          <Text>
            {`${processedDetailData?.mainCategoryType ?? 'DB 종류 없음'} / ${processedDetailData?.subCategoryType ?? '2차 DB 종류 없음'}`}
          </Text>
        </GridField>
        <GridField label='업데이트 사항'>
          <Text>{processedDetailData?.content ?? '업데이트 사항 없음'}</Text>
        </GridField>
        <GridField label='국가 / 언어'>
          <Text>{`${processedDetailData?.country ?? ' - '} / ${processedDetailData?.languageType ?? ' - '}`}</Text>
        </GridField>
        <GridField label='DB 파일'>
          {/** FIXME  FileDownload 파일 다운로드 수정 */}
          {processedDetailData?.healthCareFile ? (
            <FileDownload fileId={processedDetailData?.healthCareFile?.fileId}>
              <FileDownloadText>{processedDetailData?.healthCareFile?.originalFileName}</FileDownloadText>
            </FileDownload>
          ) : (
            <Text>DB 파일 없음</Text>
          )}
        </GridField>
      </BasicInfoContainer>
      <ButtonContainer>
        <GoToEditButton onClick={handleGoEdit} />
        <DeleteButton handleConfirm={handleDelete} />
        <GoToListButton onClick={handleGoList} />
      </ButtonContainer>
    </Wrapper>
  );
};

export default HealthCareDBDetail;
