import { useCallback, useEffect } from 'react';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Div, Img, Text } from '@components/index';
import { FTARadio } from '@components/service/atoms/index';
import FTATitleWithDivider from '@components/service/molecules/FTATitleWithDivider';
import { FTAModal } from '@components/service/molecules/index';
import { useModal } from '@hooks/index';
import PATHS from '@router/path';
import { FTALineButton, FTAPrimaryButton } from '@src/components/service/atoms';
import FTAPageTitle from '@src/components/service/organisms/FTAPageTitle';
import useAccount from '@src/hooks/rest/accounts/useAccount';
import useAccountSetting from '@src/hooks/rest/accounts/useAccountSetting';
import { flex, font, grid } from '@styles/variables';

const FORM_NAMES = Object.freeze({
  ADMIN_CLASSINFO_ID: 'adminClassInfoId',
});

export interface AccountProps {
  adminClassInfoId: string | undefined;
}

const ExtendedFTARadio = styled(FTARadio<AccountProps>)``;

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
  width: 100%;

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

const Title = styled(Text)<{ $isRequired?: boolean }>`
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

const ClassNameBox = styled(ContentContainer)`
  gap: 10px;
`;

const ExtendedButton = styled(FTALineButton)`
  width: 75px;
  height: 48px;
  padding: 15px 18px;
  ${font({ size: '16px', weight: '700', family: 'LG-smart-UI' })}
`;

const ExtendedPrimaryButton = styled(FTAPrimaryButton)`
  width: 75px;
  height: 48px;
  padding: 15px 18px;
  ${font({ size: '16px', weight: '700', family: 'LG-smart-UI' })}
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

const MODAL_NAME = 'approvalModal';

const AccountForm = () => {
  const formInstance = useForm<AccountProps>();
  const { handleSubmit, resetField } = formInstance;

  const navigate = useNavigate();

  const { showModal, closeModal } = useModal();
  const { id: adminInfoId } = useParams();

  const { accountDetailData } = useAccount();
  const { roleClassListData, handleSubmitUpdateAccountSetting } = useAccountSetting();

  const gotoList = useCallback(() => {
    navigate(`/${PATHS.ACCOUNT}`);
  }, [navigate]);

  const handleAccountStatusChangeClick = () => {
    const onOkClick: SubmitHandler<AccountProps> = ({ adminClassInfoId }) => {
      const params = {
        adminInfoId,
        adminClassInfoId,
      };
      handleSubmitUpdateAccountSetting(params);
      closeModal(MODAL_NAME);
      gotoList();
    };

    showModal(
      <FTAModal
        key={MODAL_NAME}
        handleClose={() => closeModal(MODAL_NAME)}
        children={<>입력한 정보를 저장하시겠습니까?</>}
        footerChildren={
          <ButtonSection>
            <ModalButton onClick={() => closeModal(MODAL_NAME)}>취소</ModalButton>
            <ModalPrimaryButton onClick={handleSubmit(onOkClick)}>확인</ModalPrimaryButton>
          </ButtonSection>
        }
      />
    );
  };

  useEffect(() => {
    if (accountDetailData?.className && roleClassListData?.result?.length !== 0) {
      const defaultValue = roleClassListData?.result
        ?.find((elem: { className: string }) => elem.className === accountDetailData.className)
        ?.adminClassInfoId.toString();

      resetField(FORM_NAMES.ADMIN_CLASSINFO_ID, { defaultValue: defaultValue });
    }
  }, [accountDetailData?.className, resetField, roleClassListData?.result, roleClassListData?.result?.length]);

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
            <ClassNameBox>
              {roleClassListData?.result?.map((roleList: { adminClassInfoId: number; className: string }) => (
                <ExtendedFTARadio
                  key={roleList?.adminClassInfoId}
                  name={FORM_NAMES.ADMIN_CLASSINFO_ID}
                  value={roleList?.adminClassInfoId}
                >
                  {roleList?.className}
                </ExtendedFTARadio>
              ))}
            </ClassNameBox>
          </GridItem>
        </GridBox>
        <ButtonSection>
          <ExtendedPrimaryButton onClick={() => handleAccountStatusChangeClick()}>저장</ExtendedPrimaryButton>
          <ExtendedButton onClick={gotoList}>취소</ExtendedButton>
        </ButtonSection>
      </FormProvider>
    </Container>
  );
};

export default AccountForm;
