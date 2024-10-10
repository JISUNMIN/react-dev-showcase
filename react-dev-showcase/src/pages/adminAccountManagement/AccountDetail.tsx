import { useCallback } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Div, Img, Text } from '@components/index';
import FTATitleWithDivider from '@components/service/molecules/FTATitleWithDivider';
import { FTAModal } from '@components/service/molecules/index';
import { useAuth, useModal } from '@hooks/index';
import PATHS from '@router/path';
import { FTALineButton, FTAPrimaryButton } from '@src/components/service/atoms';
import FTAPageTitle from '@src/components/service/organisms/FTAPageTitle';
import useAccount, { StatusType } from '@src/hooks/rest/accounts/useAccount';
import ApprovalButton from '@src/pages/modules/detailButtons/ApprovalButton';
import DeleteButton from '@src/pages/modules/detailButtons/DeleteButton';
import GoToEditButton from '@src/pages/modules/detailButtons/GoToEditButton';
import GoToListButton from '@src/pages/modules/detailButtons/GoToListButton';
import RefusalButton from '@src/pages/modules/detailButtons/RefusalButton';
import ReqApprovalButton from '@src/pages/modules/detailButtons/ReqApprovalButton';
import { flex, font, grid } from '@styles/variables';

export interface AccountProps {
  adminClassInfoId: string;
}

const ACCOUNT_STATUS = Object.freeze({
  approval: '승인',
  refusal: '반려',
  reqApproval: '승인요청',
  delete: '삭제',
});

const MODAL_NAME = 'approvalModal';

const Container = styled(Div)`
  ${flex({ direction: 'column', align: 'flex-start' })}
`;

const PageDesc = styled(Text)`
  color: ${({ theme }) => theme.colors.gray06};
  span {
    color: ${({ theme }) => theme.colors.red};
  }
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

const ExtendedImg = styled(Img)`
  width: 150px;
  height: 150px;
  border-radius: 8px;
`;

const AccountDetail = () => {
  const formInstance = useForm<AccountProps>();
  const { handleSubmit } = formInstance;

  const navigate = useNavigate();
  const { approvalAuthority } = useAuth();
  const { showModal, closeModal } = useModal();

  const { id: adminInfoId } = useParams();
  const { accountDetailData, handleAccountsApproval } = useAccount();

  const gotoList = useCallback(() => {
    navigate(`/${PATHS.ACCOUNT}`);
  }, [navigate]);

  const handleAccountStatusChangeClick = (status: StatusType) => {
    const onOkClick = () => {
      handleAccountsApproval(status);
      closeModal(MODAL_NAME);
      gotoList();
    };

    const currentStatus = ACCOUNT_STATUS[status];

    showModal(
      <FTAModal
        key={MODAL_NAME}
        handleClose={() => closeModal(MODAL_NAME)}
        children={<>{currentStatus} 하시겠습니까?</>}
        footerChildren={
          <ButtonSection>
            <ModalButton onClick={() => closeModal(MODAL_NAME)}>취소</ModalButton>
            <ModalPrimaryButton onClick={handleSubmit(onOkClick)}>확인</ModalPrimaryButton>
          </ButtonSection>
        }
      />
    );
  };

  const handleEditClick = useCallback(() => {
    navigate(`/${PATHS.ACCOUNT_EDIT}/${adminInfoId}`);
  }, [adminInfoId, navigate]);

  return (
    <Container>
      <FormProvider {...formInstance}>
        <FTAPageTitle title='관리자 계정' />
        <PageDesc>
          별표(<span>*</span>)가 표시된 항목은 필수입력 항목입니다.
        </PageDesc>
        <FTATitleWithDivider title='기본 정보' />
        <GridBox>
          <GridItem>
            <Title $isRequired>ID</Title>
            <ContentContainer>
              <ExtendedText>{accountDetailData?.adminId}</ExtendedText>
            </ContentContainer>
          </GridItem>
          <GridItem>
            <Title>이름</Title>
            <ContentContainer>
              <ExtendedText>{accountDetailData?.adminName}</ExtendedText>
            </ContentContainer>
          </GridItem>
          <GridItem>
            <Title>닉네임</Title>
            <ContentContainer>
              <ExtendedText>{accountDetailData?.adminNickname}</ExtendedText>
            </ContentContainer>
          </GridItem>
          <GridItem>
            <Title>프로필 이미지</Title>
            <ContentContainer>
              <ExtendedImg src={accountDetailData?.adminImageFile?.fileUrl || '/default-image.png'} />
            </ContentContainer>
          </GridItem>
          <GridItem>
            <Title>국적</Title>
            <ContentContainer>
              <ExtendedText>{accountDetailData?.adminCountry}</ExtendedText>
            </ContentContainer>
          </GridItem>
          <GridItem>
            <Title>관리자 등급</Title>
            <ContentContainer>
              <ExtendedText>{accountDetailData?.className}</ExtendedText>
            </ContentContainer>
          </GridItem>
        </GridBox>
        <ButtonSection>
          {approvalAuthority ? (
            <>
              <ApprovalButton handleConfirm={() => handleAccountStatusChangeClick('approval')} />
              <RefusalButton handleConfirm={() => handleAccountStatusChangeClick('refusal')} />
            </>
          ) : (
            <ReqApprovalButton handleConfirm={() => handleAccountStatusChangeClick('reqApproval')} />
          )}
          {accountDetailData?.approvalStatus !== 'AAS000' && <GoToEditButton onClick={handleEditClick} />}
          <DeleteButton handleConfirm={() => handleAccountStatusChangeClick('delete')} />
          <GoToListButton onClick={gotoList} />
        </ButtonSection>
      </FormProvider>
    </Container>
  );
};

export default AccountDetail;
