/** 기타 관리 > 공지사항 상세 화면 */
import { useCallback } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Div, Text } from '@components/index';
import FTATitleWithDivider from '@components/service/molecules/FTATitleWithDivider';
import { FTAModal } from '@components/service/molecules/index';
import { useModal } from '@hooks/index';
import PATHS from '@router/path';
import { FTALineButton, FTAPrimaryButton } from '@src/components/service/atoms';
import FTAPageTitle from '@src/components/service/organisms/FTAPageTitle';
import useNotice from '@src/hooks/rest/etc/useNotice';
import DeleteButton from '@src/pages/modules/detailButtons/DeleteButton';
import GoToEditButton from '@src/pages/modules/detailButtons/GoToEditButton';
import GoToListButton from '@src/pages/modules/detailButtons/GoToListButton';
import { flex, font, grid } from '@styles/variables';

const MODAL_NAME = 'noticeModal';

const Container = styled(Div)`
  ${flex({ direction: 'column', align: 'flex-start' })}
`;

const ButtonSection = styled(Div)`
  width: 100%;
  ${flex({ justify: 'center', gap: '10px' })}
`;

const GridBox = styled(Div)`
  ${grid({ gap: '0px' })};

  & > :last-child {
    border-bottom: none;
    padding-bottom: 60px;
  }
`;

const GridItem = styled(Div)`
  ${grid({ columns: '140px 15fr', gap: '20px' })};
  padding: 24px 0;
`;

const ContentContainer = styled(Div)`
  min-height: 50px;
  ${flex({ justify: 'flex-start' })}
`;

const Title = styled(Div)<{ $isRequired?: boolean }>`
  padding-right: 8px;
  width: 100%;
  word-break: keep-all;
  ${font({ weight: 'bold' })}
  ${flex({ justify: 'flex-start' })}

  ${({ $isRequired, theme }) =>
    $isRequired &&
    `
      &:after {
        content: '*';
        color: ${theme.colors.red};
        font-size: 13px;
      }
    `}
`;

const ExtendedButton = styled(FTALineButton)`
  min-width: 75px;
  height: 55px;
  padding: 15px 18px;
  ${font({ size: '16px', weight: '700' })}
`;

const ExtendedPrimaryButton = styled(FTAPrimaryButton)`
  width: 75px;
  height: 55px;
  padding: 15px 18px;
  ${font({ size: '16px', weight: '700' })}
`;

const ModalButton = styled(ExtendedButton)`
  width: 100%;
`;

const ModalPrimaryButton = styled(ExtendedPrimaryButton)`
  width: 100%;
`;

const ExtendedText = styled(Text)`
  ${font({ size: '16px', weight: '600' })}
  color: ${({ theme }) => theme.colors.gray08};
`;

const NoticeDetail = () => {
  const formInstance = useForm();

  const navigate = useNavigate();
  const { showModal, closeModal } = useModal();

  const { id: noticeInfoId } = useParams();

  const { noticeDetailData, handleSubmitDeleteNotice } = useNotice();

  const onClickDelete = useCallback(() => {
    showModal(
      <FTAModal
        key={MODAL_NAME}
        handleClose={() => closeModal(MODAL_NAME)}
        children='등록된 정보를 삭제하시겠습니까?'
        footerChildren={
          <ButtonSection>
            <ModalPrimaryButton
              onClick={() => {
                handleSubmitDeleteNotice();
                navigate(`/${PATHS.NOTICE}`);
                closeModal(MODAL_NAME);
              }}
            >
              확인
            </ModalPrimaryButton>
            <ModalButton onClick={() => closeModal(MODAL_NAME)}>취소</ModalButton>
          </ButtonSection>
        }
      />
    );
  }, [closeModal, handleSubmitDeleteNotice, navigate, showModal]);

  const onClickEdit = useCallback(() => {
    navigate(`/${PATHS.NOTICE_EDIT}/${noticeInfoId}`);
  }, [noticeInfoId, navigate]);

  return (
    <Container>
      <FormProvider {...formInstance}>
        <FTAPageTitle title='공지사항' />
        <FTATitleWithDivider />
        <GridBox>
          <GridItem>
            <Title>번호</Title>
            <ContentContainer>
              <ExtendedText>{noticeDetailData?.noticeInfoId}</ExtendedText>
            </ContentContainer>
          </GridItem>
          <GridItem>
            <Title>제목</Title>
            <ContentContainer>
              <ExtendedText>{noticeDetailData?.title}</ExtendedText>
            </ContentContainer>
          </GridItem>
          <GridItem>
            <Title>국가</Title>
            <ContentContainer>
              <ExtendedText>{noticeDetailData?.country}</ExtendedText>
            </ContentContainer>
          </GridItem>
          <GridItem>
            <Title>카테고리</Title>
            <ContentContainer>
              <ExtendedText>{noticeDetailData?.category}</ExtendedText>
            </ContentContainer>
          </GridItem>
          <GridItem>
            <Title>내용</Title>
            <ContentContainer>
              <ExtendedText>{noticeDetailData?.content}</ExtendedText>
            </ContentContainer>
          </GridItem>
        </GridBox>
        <ButtonSection>
          <GoToEditButton onClick={onClickEdit} />
          <DeleteButton handleConfirm={onClickDelete} />
          <GoToListButton
            onClick={() => {
              navigate(`/${PATHS.NOTICE}`);
            }}
          />
        </ButtonSection>
      </FormProvider>
    </Container>
  );
};

export default NoticeDetail;
