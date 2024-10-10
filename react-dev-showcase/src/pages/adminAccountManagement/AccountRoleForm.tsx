/** 관리자 계정 관리 > 관리자 등급설정 > 등급 선택 > 수정 */
import { useCallback, useEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import * as yup from 'yup';

import { Div, Text } from '@components/index';
import { FTACheckbox, FTARadio } from '@components/service/atoms/index';
import FTATitleWithDivider from '@components/service/molecules/FTATitleWithDivider';
import { FTAModal, FtHfDropdown } from '@components/service/molecules/index';
import { useModal } from '@hooks/index';
import PATHS from '@router/path';
import { FTALineButton, FTAPrimaryButton } from '@src/components/service/atoms';
import FTAPageTitle from '@src/components/service/organisms/FTAPageTitle';
import useAccountSetting, { RegistParams } from '@src/hooks/rest/accounts/useAccountSetting';
import { flex, font, grid } from '@styles/variables';

const Container = styled(Div)`
  ${flex({ direction: 'column', align: 'flex-start' })}
`;

const ButtonSection = styled(Div)`
  width: 100%;
  ${flex({ justify: 'center', gap: '10px' })}
`;

const PageDesc = styled(Text)`
  color: ${({ theme }) => theme.colors.gray06};
  span {
    color: ${({ theme }) => theme.colors.red};
  }
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

const ColumnBox = styled(Div)`
  ${flex({ direction: 'column', gap: '5px' })}
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

const AccessibleMenuListContainer = styled(Div)`
  display: grid;
  grid-template-columns: repeat(4, minmax(auto, 150px));
  gap: 14px 6px;
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

const ErrorText = styled(Text)`
  ${font({ size: '14px', weight: '400' })}
  color: ${({ theme }) => theme.colors.red};
`;

const ExtendedFTACheckbox = styled(FTACheckbox)``;
const ExtendedFTARadio = styled(FTARadio)``;

export interface AccountRoleProps {
  adminClassInfoId?: string | number | undefined;
  accessibleMenu?: Record<string, string> | string[];
  approvalAuthority: string;
}

const FORM_NAMES = Object.freeze({
  ADMIN_CLASS_INFO_ID: 'adminClassInfoId',
  ACCESSIBLE_MENU: 'accessibleMenu',
  APPROVAL_AUTHORITY: 'approvalAuthority',
});

const schema = yup.object().shape({
  [FORM_NAMES.ADMIN_CLASS_INFO_ID]: yup.number().required('관리자 등급을 선택해주세요.'),
  // NOTE: 현재 기본값 설정 되어 있어서 무조건 값이 들어감.(후에 필요하면 validation 추가)
  // [FORM_NAMES.ACCESSIBLE_MENU]: yup.array().of(yup.string()),
  // [FORM_NAMES.APPROVAL_AUTHORITY]: yup.string(),
});

const MODAL_NAME = 'approvalModal';
const MODAL_NAME_2 = 'approvalModal_2';
const MODAL_NAME_ERROR = 'approvalModal_error';

const AccountRoleEdit = () => {
  const approvalAuthorityEnumList = [
    { code: '1', value: '가능' },
    { code: '0', value: '불가' },
  ];

  const navigate = useNavigate();

  const { showModal, closeModal, clearModal } = useModal();

  const { id: adminClassInfoId } = useParams();
  const { roleDetailData, handleSubmitRegisterAccountSetting } = useAccountSetting();

  const formInstance = useForm<RegistParams>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = formInstance;

  const handleSaveClick: SubmitHandler<RegistParams> = useCallback(
    (data) => {
      const { accessibleMenu, approvalAuthority, adminClassInfoId } = data;

      const filteredAccessibleMenu = Object.values(accessibleMenu ?? []).filter((item) => item);

      const params = {
        adminClassInfoId: adminClassInfoId,
        accessibleMenu: filteredAccessibleMenu,
        approvalAuthority,
      };

      handleSubmitRegisterAccountSetting(params);
      navigate(`/${PATHS.ACCOUNT_ROLE}`);
      closeModal(MODAL_NAME);
    },
    [navigate, handleSubmitRegisterAccountSetting, closeModal]
  );

  const handleErrorModal = useCallback(() => {
    return showModal(
      <FTAModal
        key={MODAL_NAME_ERROR}
        children='관리자 등급을 선택해주세요.'
        footerChildren={
          <ButtonSection>
            <ModalPrimaryButton onClick={clearModal}>확인</ModalPrimaryButton>
          </ButtonSection>
        }
      />
    );
  }, [clearModal, showModal]);

  const handleSave = useCallback(() => {
    return showModal(
      <FTAModal
        key={MODAL_NAME}
        handleClose={() => closeModal(MODAL_NAME)}
        children='입력한 정보를 저장하시겠습니까?'
        footerChildren={
          <ButtonSection>
            <ModalButton onClick={() => closeModal(MODAL_NAME)}>취소</ModalButton>
            <ModalPrimaryButton onClick={handleSubmit(handleSaveClick, handleErrorModal)}>저장</ModalPrimaryButton>
          </ButtonSection>
        }
      />
    );
  }, [showModal, handleSubmit, handleSaveClick, handleErrorModal, closeModal]);

  const handleCancel = useCallback(() => {
    showModal(
      <FTAModal
        key={MODAL_NAME_2}
        children='정보 저장을 취소하시겠습니까?'
        footerChildren={
          <ButtonSection>
            <ModalButton onClick={() => closeModal(MODAL_NAME_2)}>취소</ModalButton>
            <ModalPrimaryButton
              onClick={() => {
                closeModal(MODAL_NAME_2);
                navigate(`/${PATHS.ACCOUNT_ROLE}`);
              }}
            >
              확인
            </ModalPrimaryButton>
          </ButtonSection>
        }
      />
    );
  }, [closeModal, navigate, showModal]);

  useEffect(() => {
    const accessibleMenu = roleDetailData?.accessibleMenuList?.reduce(
      (acc: Record<string, string>, { code }) => {
        acc[code] = code;
        return acc;
      },
      {} as Record<string, string>
    );

    reset({
      [FORM_NAMES.ACCESSIBLE_MENU]: accessibleMenu,
      [FORM_NAMES.APPROVAL_AUTHORITY]: roleDetailData?.approvalAuthority ? '1' : '0',
    });
  }, [reset, roleDetailData?.accessibleMenuList, roleDetailData?.approvalAuthority, adminClassInfoId]);

  return (
    <Container>
      <FormProvider {...formInstance}>
        <FTAPageTitle title='관리자 등급설정' />
        <PageDesc>
          별표(<span>*</span>)가 표시된 항목은 필수입력 항목입니다.
        </PageDesc>
        <FTATitleWithDivider title='기본 정보' />
        <GridBox>
          <GridItem>
            <Title>관리자 등급</Title>
            <ContentContainer>
              {/* FIXME: Dropdown Component 데이터 객체 배열 형태로 받는 걸로 수정되면 반영 필요 */}
              {roleDetailData?.className === 'SUPER' ? (
                <ColumnBox>
                  <FtHfDropdown name={FORM_NAMES.ADMIN_CLASS_INFO_ID} content={[2, 3, 4]} height={'50px'} />
                  <ErrorText>{errors?.[FORM_NAMES?.ADMIN_CLASS_INFO_ID]?.message}</ErrorText>
                </ColumnBox>
              ) : (
                <ExtendedText>{roleDetailData?.className}</ExtendedText>
              )}
            </ContentContainer>
          </GridItem>
          <GridItem>
            <Title>접근 가능 메뉴</Title>
            <ContentContainer>
              <AccessibleMenuListContainer>
                {roleDetailData?.accessibleMenuList?.map(({ code, value }) => (
                  <ExtendedFTACheckbox
                    key={code}
                    name={`${FORM_NAMES.ACCESSIBLE_MENU}.${code}`}
                    disabled={code === 'AC000'}
                  >
                    {value}
                  </ExtendedFTACheckbox>
                ))}
              </AccessibleMenuListContainer>
            </ContentContainer>
          </GridItem>
          <GridItem>
            <Title>승인 권한</Title>
            <ContentContainer>
              <AccessibleMenuListContainer>
                {approvalAuthorityEnumList?.map(({ code, value }) => (
                  <ExtendedFTARadio key={code} name={FORM_NAMES.APPROVAL_AUTHORITY} value={code}>
                    {value}
                  </ExtendedFTARadio>
                ))}
              </AccessibleMenuListContainer>
            </ContentContainer>
          </GridItem>
        </GridBox>
        <ButtonSection>
          <ExtendedPrimaryButton onClick={handleSave}>저장</ExtendedPrimaryButton>
          <ExtendedButton onClick={handleCancel}>취소</ExtendedButton>
        </ButtonSection>
      </FormProvider>
    </Container>
  );
};

export default AccountRoleEdit;
