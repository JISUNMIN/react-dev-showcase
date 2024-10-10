/** 기타 관리 > faq (테이블) / faq 단건 조회 */
import { useCallback } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Div, FTAPageTitle, Text } from '@src/components';
import useFaq from '@src/hooks/rest/useFaq';
import DeleteButton from '@src/pages/modules/detailButtons/DeleteButton';
import GoToEditButton from '@src/pages/modules/detailButtons/GoToEditButton';
import GoToListButton from '@src/pages/modules/detailButtons/GoToListButton';
import PATHS from '@src/router/path';
import { flex, grid } from '@src/styles/variables';

const Wrapper = styled(Div)`
  padding: 20px;
`;

const BasicInfoContainer = styled(Div)``;

const GridBox = styled(Div)`
  ${grid({ columns: 'minmax(140px, 1fr) 15fr', gap: '20px', align: 'center' })}
  padding: 24px 0;
`;

const ItemTitle = styled(Text)`
  display: inline;
  position: relative;
  font-weight: bold;
  word-break: keep-all;
`;

const ButtonContainer = styled(Div)`
  ${flex({})}
  padding: 50px 0;
`;

const FaqDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { index } = location.state || {};

  const { processedDetailData, deleteMutation } = useFaq();

  const handleGoList = useCallback(() => {
    navigate(`${PATHS.ROOT}${PATHS.FAQ}`);
  }, [navigate]);

  /** FIXME 모달 추가 / 삭제, 저장, 되돌아가기, 반려, 승인 등 모달 공통으로 빼는 건 어떨 지 */
  const handleDelete = useCallback(() => {
    const param = {
      faqInfoId: processedDetailData?.faqInfoId || 0,
    };

    deleteMutation.mutate(param, {
      onSuccess: () => {
        navigate(`${PATHS.ROOT}${PATHS.FAQ}`);
      },
      onError: () => {
        console.error('Failed to register/update FAQ');
      },
    });
  }, [deleteMutation, navigate, processedDetailData?.faqInfoId]);

  const handleGoEdit = useCallback(() => {
    navigate(`${PATHS.ROOT}${PATHS.FAQ_EDIT}/${processedDetailData?.faqInfoId}`);
  }, [navigate, processedDetailData?.faqInfoId]);

  return (
    <Wrapper>
      <FTAPageTitle title='FAQ' />
      <BasicInfoContainer>
        <GridBox>
          <ItemTitle>번호</ItemTitle>
          <Text>{index + 1}</Text>
        </GridBox>
        <GridBox>
          <ItemTitle>제목</ItemTitle>
          <Text>{processedDetailData?.title}</Text>
        </GridBox>
        <GridBox>
          <ItemTitle>국가</ItemTitle>
          <Text>{processedDetailData?.country} </Text>
        </GridBox>
        <GridBox>
          <ItemTitle>카테고리</ItemTitle>
          <Text>{processedDetailData?.category}</Text>
        </GridBox>
        <GridBox>
          <ItemTitle>내용</ItemTitle>
          <Text dangerouslySetInnerHTML={{ __html: processedDetailData?.content }} />
        </GridBox>
      </BasicInfoContainer>
      <ButtonContainer>
        <GoToEditButton onClick={handleGoEdit} />
        <DeleteButton handleConfirm={handleDelete} />
        <GoToListButton onClick={handleGoList} />
      </ButtonContainer>
    </Wrapper>
  );
};

export default FaqDetail;
