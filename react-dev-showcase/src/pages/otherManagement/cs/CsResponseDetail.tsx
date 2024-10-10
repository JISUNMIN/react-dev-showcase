/** 기타 관리 > cs 대응 (테이블) / cs 대응 단건 조회 */
import { useCallback } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Div, FTALineButton, FTAPageTitle, FTAPrimaryButton, FTATitleWithDivider, Text } from '@src/components';
import useCS from '@src/hooks/rest/etc/useCS';
import GridField from '@src/layout/grid/GridField';
import PATHS from '@src/router/path';
import { flex, font } from '@src/styles/variables';

const Wrapper = styled(Div)`
  padding: 20px;
`;

const BasicInfoContainer = styled(Div)``;

const ButtonContainer = styled(Div)`
  ${flex({})}
  padding: 50px 0;
`;

const AnswerContainer = styled(Div)``;

const SectionTitle = styled(Text)`
  ${font({ size: '22px', weight: '700' })}
  color: ${({ theme }) => theme.colors.gray10};
  padding-top: 50px;
`;

const CsResponseDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const index = location?.state?.itemIndex || 0;

  const { processedDetailData } = useCS();

  const handleGoList = useCallback(() => {
    navigate(`${PATHS.ROOT}${PATHS.CS_RESPONSE}`);
  }, [navigate]);

  const handleGoAnswer = useCallback(() => {
    navigate(`${PATHS.ROOT}${PATHS.CS_RESPONSE_EDIT}/${processedDetailData?.csRequestInfoId}`);
  }, [navigate, processedDetailData?.csRequestInfoId]);

  return (
    <Wrapper>
      <FTAPageTitle title='CS 대응' />
      <BasicInfoContainer>
        <GridField label='번호'>
          <Text>{index || '-'}</Text>
        </GridField>
        <GridField label='등록 날짜'>
          <Text>{processedDetailData?.registDate ?? '-'}</Text>
        </GridField>
        <GridField label='상태'>
          <Text>{processedDetailData?.csStatus ?? '-'}</Text>
        </GridField>
        <GridField label='아이디'>
          <Text>{processedDetailData?.userId ?? '-'}</Text>
        </GridField>
        <GridField label='국가'>
          <Text>{processedDetailData?.country ?? '-'}</Text>
        </GridField>
        <GridField label='TV 사양'>
          <Text>{processedDetailData?.userTvSpec ?? '-'}</Text>
        </GridField>
        <GridField label='카테고리'>
          <Text>{processedDetailData?.category ?? '-'}</Text>
        </GridField>
        <GridField label='제목'>
          <Text>{processedDetailData?.title ?? '-'}</Text>
        </GridField>
        <GridField label='내용'>
          {processedDetailData?.content ? (
            <Text dangerouslySetInnerHTML={{ __html: processedDetailData?.content }} />
          ) : (
            <Text>-</Text>
          )}
        </GridField>
      </BasicInfoContainer>

      {/** csResponseList 의 값은 배열이지만 답변을 여러개 적어도 마지막 값만 갱신 1:1 답변 */}
      {processedDetailData?.csResponseList?.length > 0 && (
        <AnswerContainer key={index}>
          <SectionTitle>답변</SectionTitle>
          <FTATitleWithDivider />
          <GridField label='제목'>
            <Text>{processedDetailData?.csResponseList?.[0]?.title ?? '-'}</Text>
          </GridField>
          <GridField label='내용'>
            {processedDetailData?.csResponseList?.[0]?.content ? (
              <Text dangerouslySetInnerHTML={{ __html: processedDetailData?.csResponseList?.[0]?.content }} />
            ) : (
              <Text>-</Text>
            )}
          </GridField>
        </AnswerContainer>
      )}

      <ButtonContainer>
        <FTAPrimaryButton onClick={handleGoAnswer}>답변</FTAPrimaryButton>
        <FTALineButton onClick={handleGoList}>목록</FTALineButton>
      </ButtonContainer>
    </Wrapper>
  );
};

export default CsResponseDetail;
