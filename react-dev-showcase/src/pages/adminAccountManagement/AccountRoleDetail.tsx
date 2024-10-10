/** 관리자 계정 관리 > 관리자 등급설정 > 등급 선택 */
import { useCallback } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Div, Text } from '@components/index';
import FTATitleWithDivider from '@components/service/molecules/FTATitleWithDivider';
import { FTAModal } from '@components/service/molecules/index';
import { useModal } from '@hooks/index';
import PATHS from '@router/path';
import { FTALineButton, FTAPrimaryButton } from '@src/components/service/atoms';
import FTAPageTitle from '@src/components/service/organisms/FTAPageTitle';
import useAccountSetting from '@src/hooks/rest/accounts/useAccountSetting';
import DeleteButton from '@src/pages/modules/detailButtons/DeleteButton';
import GoToEditButton from '@src/pages/modules/detailButtons/GoToEditButton';
import GoToListButton from '@src/pages/modules/detailButtons/GoToListButton';
import { flex, font, grid } from '@styles/variables';

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

const GridItem = styled(Div)<{ $hasBottomBorderLine?: boolean }>`
  ${grid({ columns: '140px 15fr', gap: '20px' })};
  padding: 24px 0;

  ${({ $hasBottomBorderLine }) => $hasBottomBorderLine && 'border-bottom: 1px solid #f2f2f2;'}
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

const AccessibleMenuListContainer = styled(Div)`
  display: grid;
  grid-template-columns: repeat(4, minmax(auto, 150px));
  gap: 14px 6px;
`;

const AccessibleMenu = styled(Div)`
  ${flex({})}
  ${font({ size: '16px', weight: '600' })}
  padding: 8px 18px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.gray03};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.gray08};
`;

const MODAL_NAME = 'accountRoleModal';
const MODAL_NAME_2 = 'accountRoleDeleteModal';

const AccountRoleDetail = () => {
  const navigate = useNavigate();

  const { showModal, closeModal } = useModal();

  const { id: adminClassInfoId } = useParams();
  const { roleDetailData } = useAccountSetting();

  const gotoList = useCallback(() => {
    showModal(
      <FTAModal
        key={MODAL_NAME}
        handleClose={() => closeModal(MODAL_NAME)}
        children='목록으로 이동하시겠습니까?'
        footerChildren={
          <ButtonSection>
            <ModalButton onClick={() => closeModal(MODAL_NAME)}>취소</ModalButton>
            <ModalPrimaryButton
              onClick={() => {
                navigate(`/${PATHS.ACCOUNT_ROLE}`);
                closeModal(MODAL_NAME);
              }}
            >
              확인
            </ModalPrimaryButton>
          </ButtonSection>
        }
      />
    );
  }, [closeModal, navigate, showModal]);

  const onClickEdit = useCallback(() => {
    navigate(`/${PATHS.ACCOUNT_ROLE_EDIT}/${adminClassInfoId}`);
  }, [adminClassInfoId, navigate]);

  const onClickDelete = useCallback(() => {
    showModal(
      <FTAModal
        key={MODAL_NAME_2}
        handleClose={() => closeModal(MODAL_NAME_2)}
        children='등록된 정보를 삭제하시겠습니까?'
        footerChildren={
          <ButtonSection>
            <ModalButton onClick={() => closeModal(MODAL_NAME_2)}>취소</ModalButton>
            <ModalPrimaryButton
              onClick={() => {
                // handleSubmitDeleteAccountSetting();
                // navigate(`/${PATHS.ACCOUNT_ROLE}`);
                alert('삭제 안하는 걸로 수정?');
                closeModal(MODAL_NAME_2);
              }}
            >
              확인
            </ModalPrimaryButton>
          </ButtonSection>
        }
      />
    );
  }, [closeModal, showModal]);

  return (
    <Container>
      <FTAPageTitle title='관리자 등급설정' />
      <FTATitleWithDivider title='기본 정보' />
      <GridBox>
        <GridItem $hasBottomBorderLine>
          <Title>관리자 등급</Title>
          <ContentContainer>
            <ExtendedText>{roleDetailData?.className}</ExtendedText>
          </ContentContainer>
        </GridItem>
        <GridItem $hasBottomBorderLine>
          <Title>접근 가능 메뉴</Title>
          <ContentContainer>
            <AccessibleMenuListContainer>
              {roleDetailData?.accessibleMenuList?.map(({ value }) => (
                <AccessibleMenu key={value}>{value}</AccessibleMenu>
              ))}
            </AccessibleMenuListContainer>
          </ContentContainer>
        </GridItem>
        <GridItem>
          <Title>승인 권한</Title>
          <ContentContainer>
            <ExtendedText>{roleDetailData?.approvalAuthority ? '가능' : '불가능'}</ExtendedText>
          </ContentContainer>
        </GridItem>
      </GridBox>
      <ButtonSection>
        {roleDetailData?.className === 'SUPER' && (
          <>
            <GoToEditButton onClick={onClickEdit} />
            <DeleteButton handleConfirm={onClickDelete} />
          </>
        )}
        <GoToListButton onClick={gotoList} />
      </ButtonSection>
    </Container>
  );
};

export default AccountRoleDetail;
