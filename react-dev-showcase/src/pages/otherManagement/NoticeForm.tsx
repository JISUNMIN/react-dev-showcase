/** 기타 관리 > 공지사항 상세 화면 */
import { useCallback, useEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import * as yup from 'yup';

import { Div, FTAEditor, Text } from '@components/index';
import { FTAInput } from '@components/service/atoms/index';
import FTATitleWithDivider from '@components/service/molecules/FTATitleWithDivider';
import { FTAModal, FtHfDropdown } from '@components/service/molecules/index';
import { useModal } from '@hooks/index';
import PATHS from '@router/path';
import { FTALineButton, FTAPrimaryButton } from '@src/components/service/atoms';
import FTAPageTitle from '@src/components/service/organisms/FTAPageTitle';
import useNotice, { RegistParams } from '@src/hooks/rest/etc/useNotice';
import GridField from '@src/layout/grid/GridField';
import { enumStore } from '@src/zustand';
import { EnumObject } from '@src/zustand/enumStore';
import { flex, font, grid } from '@styles/variables';

const TARGET_ENUM_KEYS: Array<keyof EnumObject> = ['CountryType'];

const FORM_NAMES = Object.freeze({
  NOTICE_INFO_ID: 'noticeInfoId',
  TITLE: 'title',
  COUNTRY: 'country',
  CATEGORY: 'category',
  CONTENT: 'content',
});

const MODAL_NAME = 'noticeModal';
const MODAL_NAME_2 = 'noticeCancelModal';

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

const ErrorText = styled(Text)`
  ${font({ size: '14px', weight: '400' })}
  color: ${({ theme }) => theme.colors.red};
  margin-top: 5px;
`;

const schema = yup.object().shape({
  title: yup.string().required('제목은 필수 입력입니다.'),
  country: yup.string().required('국가는 필수 선택입니다.'),
  category: yup.string().required('카테고리는 필수 선택입니다.'),
  content: yup.string().required('내용은 필수 입력입니다.'),
});

const NoticeForm = () => {
  const formInstance = useForm<RegistParams>({
    resolver: yupResolver(schema),
  });
  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = formInstance;

  const navigate = useNavigate();
  const { showModal, closeModal } = useModal();

  const { id: noticeInfoId } = useParams();

  const { noticeDetailData, handleSubmitRegistNotice } = useNotice();
  const { getEnumListByKeyList } = enumStore();
  const [countryEnumList] = getEnumListByKeyList(TARGET_ENUM_KEYS);

  const onClickSave: SubmitHandler<RegistParams> = useCallback(
    (data) => {
      const { category, content, country, title, noticeInfoId } = data;

      const params = {
        category,
        content,
        country,
        title,
        noticeInfoId: Number(noticeInfoId),
      };

      showModal(
        <FTAModal
          key={MODAL_NAME}
          handleClose={() => closeModal(MODAL_NAME)}
          children='입력한 정보를 저장하시겠습니까?'
          footerChildren={
            <ButtonSection>
              <ModalPrimaryButton
                onClick={() => {
                  handleSubmitRegistNotice(params);
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
    },
    [showModal, closeModal, handleSubmitRegistNotice, navigate]
  );

  const onClickCancel = useCallback(() => {
    showModal(
      <FTAModal
        key={MODAL_NAME_2}
        children='정보 저장을 취소하시겠습니까?'
        footerChildren={
          <ButtonSection>
            <ModalPrimaryButton
              onClick={() => {
                navigate(`/${PATHS.NOTICE}`);
                closeModal(MODAL_NAME_2);
              }}
            >
              확인
            </ModalPrimaryButton>
            <ModalButton onClick={() => closeModal(MODAL_NAME_2)}>취소</ModalButton>
          </ButtonSection>
        }
      />
    );
  }, [closeModal, navigate, showModal]);

  useEffect(() => {
    reset({
      [FORM_NAMES.NOTICE_INFO_ID]: noticeDetailData?.noticeInfoId,
      [FORM_NAMES.TITLE]: noticeDetailData?.title,
      [FORM_NAMES.COUNTRY]: noticeDetailData?.country,
      [FORM_NAMES.CATEGORY]: noticeDetailData?.category,
      [FORM_NAMES.CONTENT]: noticeDetailData?.content,
    });
  }, [noticeDetailData, reset]);

  return (
    <Container>
      <FormProvider {...formInstance}>
        <FTAPageTitle title='공지사항' />
        <FTATitleWithDivider />
        <GridBox>
          <GridField label='번호'>
            {noticeInfoId ? (
              <ExtendedText>{noticeDetailData?.noticeInfoId}</ExtendedText>
            ) : (
              // FIXME: 등록 시 noticeInfoId 필요 한지? 어떻게 param으로 전달할지 정의 없음
              <FTAInput
                name={FORM_NAMES.NOTICE_INFO_ID}
                placeholder='번호를 입력해주세요.'
                maxLength={100}
                debounce={{ enabled: true, delay: 500 }}
              />
            )}
          </GridField>
          <GridField label='제목' isRequired>
            <FTAInput
              name={FORM_NAMES.TITLE}
              placeholder='제목을 입력해주세요.'
              maxLength={100}
              debounce={{ enabled: true, delay: 500 }}
            />
          </GridField>
          <GridField label='국가' isRequired>
            <Div>
              <FtHfDropdown
                name={FORM_NAMES.COUNTRY}
                size='large'
                content={countryEnumList.map((item) => item.code)}
                placeholder={noticeDetailData?.country ? noticeDetailData?.country : '국가 선택'}
                height={'50px'}
              />
              {errors?.[FORM_NAMES.COUNTRY] && <ErrorText>{errors?.[FORM_NAMES.COUNTRY]?.message}</ErrorText>}
            </Div>
          </GridField>
          <GridField label='카테고리' isRequired>
            {/* FIXME: dropdown 데이터 변경 예정 / ENUM 값에서 없는듯함 */}
            <Div>
              <FtHfDropdown
                name={FORM_NAMES.CATEGORY}
                size='large'
                content={['TBD1', 'TBD2']}
                placeholder={noticeDetailData?.category ? noticeDetailData?.category : '카테고리 선택'}
                height={'50px'}
              />
              <ErrorText>{errors?.[FORM_NAMES.CATEGORY]?.message}</ErrorText>
            </Div>
          </GridField>
          <GridField label='내용' isRequired>
            <Div>
              <FTAEditor isEditMode name={FORM_NAMES.CONTENT} />
              <ErrorText>{errors?.[FORM_NAMES.CONTENT]?.message}</ErrorText>
            </Div>
          </GridField>
        </GridBox>
        <ButtonSection>
          <ExtendedPrimaryButton onClick={handleSubmit(onClickSave)}>저장</ExtendedPrimaryButton>
          <ExtendedButton onClick={onClickCancel}>취소</ExtendedButton>
        </ButtonSection>
      </FormProvider>
    </Container>
  );
};

export default NoticeForm;
