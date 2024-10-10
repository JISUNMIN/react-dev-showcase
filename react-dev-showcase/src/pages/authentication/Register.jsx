import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import ImageUpload from '@FTA/components/ImageUpload';
import { ERRORS, VALIDATION_REGEXES } from '@FTA/data';
import { yupResolver } from '@hookform/resolvers/yup';
import Config from '@modules/FTA/data/config';
import { adminCPListAPI, adminIdExistsAPI, adminRegistAPI } from '@redux/action/adminAction';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as yup from 'yup';

import {
  Button,
  Div,
  Divider,
  FormProviderWithDevTools,
  Input,
  Modal,
  ModalContext,
  SelectBox,
  Text,
} from '@components/index';
import PATHS from '@router/paths';

import {
  BottomButtonStyles,
  ButtonCss,
  ExtendedDividerStyles,
  IdDuplicationCheckButtonStyles,
} from './modules/RegisterStyles';

const ButtonSection = styled(Div)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const Container = styled.div`
  width: 645px;
  display: flex;
  flex-direction: column;
`;

const HeaderTextContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 28px;
`;

const HeaderText = styled.p`
  font-size: 40px;
  font-weight: 700;
  line-height: 1.17;
  margin-bottom: 42px;
`;

const HeaderSubText = styled.p`
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: ${({ theme }) => theme.gray06};
  align-self: start;
  margin-bottom: 12px;
`;

const FormContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 120px 400px 1fr;
  align-items: start;
  gap: 24px 20px;
  margin-bottom: 40px;
`;

const FormLabel = styled(Text)`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.gray10};
`;

const ExtendedInput = styled(Input)`
  width: 100%;
`;

const TwoColumnContainer = styled.div`
  grid-column: 1 / 3;
  display: grid;
  grid-template-columns: 120px 400px;
  align-items: start;
  gap: 24px 20px;
`;

const PasswordInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
`;

const PasswordGuideText = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.gray07};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  column-gap: 16px;
`;

const FORM_KEYS = Object.freeze({
  ADMIN_ID: 'adminId',
  ADMIN_PW: 'adminPw',
  ADMIN_PW_CHECK: 'adminPwCheck',
  ADMIN_NAME: 'adminName',
  PROFILE_IMAGE: 'profileImage',
  ADMIN_NICKNAME: 'adminNickname',
  PHONE_NUMBER: 'phoneNumber',
  CP_MANAGEMENT_INFO_ID: 'cpManagementInfoId',
  ADMIN_COUNTRY: 'adminCountry',
});

const schema = yup.object().shape({
  [FORM_KEYS.ADMIN_ID]: yup
    .string()
    .matches(VALIDATION_REGEXES.EMAIL, ERRORS.INVALID_VALUE)
    .required(ERRORS.INVALID_CREDENTIALS),
  [FORM_KEYS.ADMIN_PW]: yup
    .string()
    .matches(VALIDATION_REGEXES.PASSWORD, ERRORS.INVALID_VALUE)
    .required(ERRORS.INVALID_CREDENTIALS),
  [FORM_KEYS.ADMIN_PW_CHECK]: yup
    .string()
    .oneOf([yup.ref(FORM_KEYS.ADMIN_PW), null], ERRORS.PASSWORD_NOT_MATCHED)
    .required(ERRORS.INVALID_CREDENTIALS),
  [FORM_KEYS.ADMIN_NAME]: yup.string().required(ERRORS.EMPTY_INPUT),
});

// FIXME[CS] PPT 272를 보면 권역/국가 리스트가 존재함
// 해당 리스트에 매우 많은 국가가 있으므로 아래 객체를 따로 빼는 것이 좋을 것으로 보임
// 추가로 selectBox에서 스크롤을 최소화하기 위해 검색 등의 기능이 추가되어야 할 것으로 보임
const COUNTRY_OPTIONS = {
  guide: '국가 선택',
  list: [
    { id: 'KR', title: '대한민국' },
    // NOTE: 국가 권역 리스트 API가 없고, 현재 다국어 진행이 되어있지 않으므로 일단 주석처리
    // { id: 'JP', title: '일본' },
    // { id: 'CN', title: '중국' },
    // { id: 'TW', title: '대만' },
  ],
};

const Register = () => {
  const dispatch = useDispatch();
  const selectableCPList = useSelector((state) => state.admin.cpList);

  const navigate = useNavigate();

  const methods = useForm({ resolver: yupResolver(schema), mode: 'onBlur' });

  const [isIdDuplicated, setIsIdDuplicated] = useState(true);

  const formData = useMemo(() => new FormData(), []);

  const {
    handleSubmit,
    formState: { isValid, errors },
    trigger,
    getValues,
    setError,
  } = methods;

  const { showModal, closeModal } = useContext(ModalContext);

  const convertedSelectableCPList = useMemo(() => {
    const list = selectableCPList.map(({ cpManageInfoId, cpName }) => ({
      id: cpManageInfoId.toString(),
      title: cpName,
    }));
    return { guide: 'CP 선택', list };
  }, [selectableCPList]);

  const handleIdDuplicationCheck = async () => {
    const adminIdValidation = await trigger(FORM_KEYS.ADMIN_ID, { shouldFocus: true });

    if (!adminIdValidation) return;

    const adminId = getValues(FORM_KEYS.ADMIN_ID);
    adminIdExistsAPI(dispatch, { adminId }, { setError, target: FORM_KEYS.ADMIN_ID, setState: setIsIdDuplicated });
  };

  const handleFileChange = useCallback((file) => {
    formData.append('file', file);
  }, []);

  const handleSignUpClick = ({
    adminCountry,
    adminId,
    adminName,
    adminNickname,
    adminPw,
    adminPwCheck,
    cpManagementInfoId,
    phoneNumber,
  }) => {
    const params = {
      adminCountry,
      adminId,
      adminName,
      adminNickname,
      adminPw,
      adminPwCheck,
      phoneNumber,
      cpManagementInfoId,
      adminType: Config.USER_ADMIN_TYPE,
    };

    formData.append('requestDTO', JSON.stringify(params));

    adminRegistAPI(dispatch, formData);
    navigate(PATHS.ROOT);
  };

  const handleCancel = () => {
    showModal(
      <Modal
        body='컨텐츠 파트너 계정 가입을 취소하시겠습니까?'
        btns={
          <ButtonSection>
            <Button
              onClick={() => {
                navigate(PATHS.ROOT);
                closeModal();
              }}
              $layout='square'
              $variantColor='primary'
              classes={{ Button: ButtonCss }}
            >
              확인
            </Button>
            <Button onClick={closeModal} $layout='square' $variantColor='line' classes={{ Button: ButtonCss }}>
              취소
            </Button>
          </ButtonSection>
        }
      />
    );
  };

  useEffect(() => {
    const browserLanguage = navigator.language.split('-')[1];
    adminCPListAPI(dispatch, { languageType: browserLanguage || 'KR' });
  }, []);

  return (
    <Container>
      <HeaderTextContainer>
        <HeaderText>계정 가입</HeaderText>
        <HeaderSubText>별표(*)가 표시된 항목은 필수입력 항목입니다.</HeaderSubText>
        <Divider classes={{ Divider: ExtendedDividerStyles }} />
      </HeaderTextContainer>
      <FormProviderWithDevTools {...methods}>
        <FormContainer>
          <FormLabel required>ID</FormLabel>
          <ExtendedInput
            hasDeleteIcon
            required
            type='text'
            placeholder='ID를 입력해주세요.'
            name={FORM_KEYS.ADMIN_ID}
            errorMessage={errors[FORM_KEYS.ADMIN_ID]?.message}
          />
          <Button
            $variantColor='line'
            classes={{ Button: IdDuplicationCheckButtonStyles }}
            onClick={handleIdDuplicationCheck}
          >
            중복확인
          </Button>
          <TwoColumnContainer>
            <FormLabel required>비밀번호</FormLabel>
            <PasswordInputContainer>
              <ExtendedInput
                required
                type='password'
                placeholder='비밀번호를 입력해주세요.'
                name={FORM_KEYS.ADMIN_PW}
                errorMessage={errors[FORM_KEYS.ADMIN_PW]?.message}
              />
              <ExtendedInput
                required
                type='password'
                placeholder='비밀번호를 재입력해주세요.'
                name={FORM_KEYS.ADMIN_PW_CHECK}
                errorMessage={errors[FORM_KEYS.ADMIN_PW_CHECK]?.message}
              />
              <PasswordGuideText>8~16자의 영문 대/소문자, 숫자, 특수문자를 조합하여 사용해주세요.</PasswordGuideText>
            </PasswordInputContainer>
            <FormLabel required>이름</FormLabel>
            <ExtendedInput
              required
              type='text'
              placeholder='이름을 입력해주세요.'
              name={FORM_KEYS.ADMIN_NAME}
              errorMessage={errors[FORM_KEYS.ADMIN_NAME]?.message}
            />
            <FormLabel required>프로필 이미지</FormLabel>
            <ImageUpload
              name={FORM_KEYS.PROFILE_IMAGE}
              onFileChange={handleFileChange}
              shouldGetCloudFrontUrl={false}
            />
            <FormLabel>닉네임</FormLabel>
            <ExtendedInput type='text' placeholder='닉네임을 입력해주세요.' name={FORM_KEYS.ADMIN_NICKNAME} />
            <FormLabel required>핸드폰 번호</FormLabel>
            <ExtendedInput
              type='text'
              placeholder='핸드폰 번호를 입력해주세요.'
              name={FORM_KEYS.PHONE_NUMBER}
              RegisterOptions={{ setValueAs: (mobile) => mobile.replace(/-/g, '') }}
            />
            <FormLabel required>CP명</FormLabel>
            <SelectBox name={FORM_KEYS.CP_MANAGEMENT_INFO_ID} options={convertedSelectableCPList} />
            <FormLabel>국적</FormLabel>
            <SelectBox name={FORM_KEYS.ADMIN_COUNTRY} options={COUNTRY_OPTIONS} />
          </TwoColumnContainer>
        </FormContainer>
        <ButtonContainer>
          <Button
            $variantColor='primary'
            classes={{ Button: BottomButtonStyles }}
            disabled={!isValid || isIdDuplicated}
            onClick={handleSubmit(handleSignUpClick)}
          >
            가입
          </Button>
          <Button $variantColor='line' classes={{ Button: BottomButtonStyles }} onClick={handleCancel}>
            취소
          </Button>
        </ButtonContainer>
      </FormProviderWithDevTools>
    </Container>
  );
};

export default Register;
