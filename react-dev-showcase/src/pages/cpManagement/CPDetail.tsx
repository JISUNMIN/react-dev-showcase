import { useCallback } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { Div, FTAPageTitle, FTATitleWithDivider, Img, Span, Text } from '@src/components';
import useCPs, { RequestStatus } from '@src/hooks/rest/CPs/useCPs';
import ApprovalButton from '@src/pages/modules/detailButtons/ApprovalButton';
import DeleteButton from '@src/pages/modules/detailButtons/DeleteButton';
import GoToEditButton from '@src/pages/modules/detailButtons/GoToEditButton';
import GoToListButton from '@src/pages/modules/detailButtons/GoToListButton';
import RefusalButton from '@src/pages/modules/detailButtons/RefusalButton';
import ReqApprovalButton from '@src/pages/modules/detailButtons/ReqApprovalButton';
import PATHS from '@src/router/path';
import { flex, font } from '@src/styles/variables';

interface GridCellStyleProps {
  $last?: boolean;
}

const GridCellStyle = css<GridCellStyleProps>`
  ${font({ size: '16px', weight: '700' })}
  line-height: var(--row-height);
  color: ${({ theme }) => theme.colors.gray10};
  padding-bottom: 24px;
  border-bottom: ${({ theme, $last }) => !$last && `1px solid ${theme.colors.gray03}`};
`;

const GridTitle = styled(FTATitleWithDivider)<{ $multi?: boolean }>`
  margin-top: ${({ $multi }) => ($multi ? '60px' : '0')};
`;

const GridBox = styled(Div)`
  --row-height: 50px;

  display: grid;
  grid-template-columns: 140px 1fr;
  row-gap: 32px;
`;

const GridHeader = styled(Text)<GridCellStyleProps>`
  ${GridCellStyle}
`;

const GridContent = styled(Div)<GridCellStyleProps>`
  ${GridCellStyle}
  color: ${({ theme }) => theme.colors.gray08};
  font-weight: 600;
`;

const GridImage = styled(Img)<GridCellStyleProps>`
  width: 120px;
  aspect-ratio: 1;
  margin-bottom: 24px;
  border-bottom: ${({ theme, $last }) => !$last && `1px solid ${theme.colors.gray03}`};
`;

const Feature = styled(Span)<{ $first: boolean }>`
  ${font({ size: '14px' })}
  padding:8px 14px;
  border-radius: 56px;
  background-color: ${({ theme }) => theme.colors.green01};
  margin-left: ${({ $first }) => ($first ? '0' : '4px')};
`;

const ButtonBox = styled(Div)`
  ${flex({})}
  margin-top: 60px;
`;

const CPDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDetailPending, processedDetailData, approvalMutate, deleteMutate } = useCPs(id!);

  const handleReqApprovalButtonClick = useCallback(() => {
    approvalMutate(RequestStatus.REQAPPROVAL);
  }, [approvalMutate]);

  const handleApprovalButtonClick = useCallback(() => {
    approvalMutate(RequestStatus.APPROVAL);
  }, [approvalMutate]);

  const handleGoToEditButtonClick = () => {
    navigate(`/${PATHS.CP_INFO_EDIT}/${id}`);
  };

  const handleRefusalButtonClick = () => {
    approvalMutate(RequestStatus.REFUSAL);
  };

  const handleDeleteButtonClick = () => {
    deleteMutate();
  };

  const handleGoToListButtonClick = () => {
    navigate(`/${PATHS.CP_INFO}`);
  };

  return (
    <>
      {/* FIXME 구체적인 skeleton size, skeleton 사용 여부 등은 논의가 필요할 것으로 보임 */}
      <FTAPageTitle title='CP 정보' />
      <GridTitle title='기본 정보' />
      <GridBox>
        <GridHeader>CP명</GridHeader>
        <GridContent isLoading={isDetailPending}>{processedDetailData.cpName}</GridContent>
        <GridHeader>컨텐츠 분류 1</GridHeader>
        <GridContent isLoading={isDetailPending}>{processedDetailData.mainCategory}</GridContent>
        <GridHeader>컨텐츠 분류 2</GridHeader>
        <GridContent isLoading={isDetailPending}>{processedDetailData.subCategory}</GridContent>
        <GridHeader $last>국가 / 언어</GridHeader>
        <GridContent
          isLoading={isDetailPending}
          $last
        >{`${processedDetailData.national} / ${processedDetailData.language}`}</GridContent>
      </GridBox>
      <GridTitle $multi title='외부 센터 프로그램 CP 정보' />
      <GridBox>
        {/* FIXME: preview 구현 필요 */}
        <GridHeader>로고</GridHeader>
        <GridImage isLoading={isDetailPending} src={processedDetailData.logoImage?.fileUrl} />
        <GridHeader>소개 이미지</GridHeader>
        <GridImage isLoading={isDetailPending} src={processedDetailData.introductionImage?.fileUrl} />
        <GridHeader>센터 소개 이미지</GridHeader>
        <GridImage isLoading={isDetailPending} src={processedDetailData.centerIntroductionImage?.fileUrl} />
        <GridHeader>소개글</GridHeader>
        <GridContent isLoading={isDetailPending}>{processedDetailData.introduction}</GridContent>
        <GridHeader>특징</GridHeader>
        <GridContent isLoading={isDetailPending}>
          {processedDetailData.features?.map((feature, index) => (
            <Feature key={index} $first={index === 0}>
              {feature}
            </Feature>
          ))}
        </GridContent>
        <GridHeader $last>노출 여부</GridHeader>
        <GridContent isLoading={isDetailPending} $last>
          {processedDetailData.exposeYn ? '노출' : '비노출'}
        </GridContent>
      </GridBox>
      <ButtonBox>
        <ReqApprovalButton handleConfirm={handleReqApprovalButtonClick} />
        <ApprovalButton handleConfirm={handleApprovalButtonClick} />
        <GoToEditButton onClick={handleGoToEditButtonClick} />
        <RefusalButton handleConfirm={handleRefusalButtonClick} />
        <DeleteButton
          handleConfirm={handleDeleteButtonClick}
          bodyText={['등록된 정보를 삭제하시겠습니까?', 'CP 정보를 삭제하게 되면 해당 CP는 탈퇴 처리됩니다.']}
        />
        <GoToListButton onClick={handleGoToListButtonClick} />
      </ButtonBox>
    </>
  );
};

export default CPDetail;
