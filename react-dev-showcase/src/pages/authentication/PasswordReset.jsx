import { ERRORS, VALIDATION_REGEXES } from '@FTA/data';
import AuthenticationButton from '@FTA/pages/authentication/modules/AuthenticationButton';
import { yupResolver } from '@hookform/resolvers/yup';
import { adminResetPasswordAPI } from '@redux/action/adminAction';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';

import { Input, Text } from '@components/index';

const HeaderTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 14px;
`;

const HeaderText = styled.p`
  font-size: 40px;
  font-weight: 700;
  line-height: 1.17;
`;

const FormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 24px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
`;

const FormLabel = styled(Text)`
  font-size: 16px;
  line-height: 1.17;
  font-weight: 600;
  color: ${({ theme }) => theme.gray07};
  text-decoration: ${({ underline }) => (underline ? 'underline' : 'none')};
  cursor: ${({ pointer }) => (pointer ? 'pointer' : 'default')};
`;

const ExtendedInput = styled(Input)`
  width: 100%;
`;

const PasswordGuideText = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.gray07};
`;

const FORM_KEYS = Object.freeze({
  ADMIN_ID: 'adminId',
  PASSWORD: 'pasword',
  CONFIRM_PASSWORD: 'confirmPassword',
});

const schema = yup.object().shape({
  [FORM_KEYS.ADMIN_ID]: yup
    .string()
    .matches(VALIDATION_REGEXES.EMAIL, ERRORS.INVALID_VALUE)
    .required(ERRORS.INVALID_CREDENTIALS),
  [FORM_KEYS.PASSWORD]: yup
    .string()
    .matches(VALIDATION_REGEXES.PASSWORD, ERRORS.INVALID_VALUE)
    .required(ERRORS.INVALID_CREDENTIALS),
  [FORM_KEYS.CONFIRM_PASSWORD]: yup
    .string()
    .oneOf([yup.ref(FORM_KEYS.PASSWORD), null], ERRORS.PASSWORD_NOT_MATCHED)
    .required(ERRORS.INVALID_CREDENTIALS),
});

const PasswordReset = () => {
  const dispatch = useDispatch();
  const methods = useForm({ resolver: yupResolver(schema) });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const handlePasswordChange = ({
    [FORM_KEYS.ADMIN_ID]: adminId,
    [FORM_KEYS.PASSWORD]: password,
    [FORM_KEYS.CONFIRM_PASSWORD]: confirmPassword,
  }) => {
    // FIXME[CS] 비밀번호 변경
    console.log('password: ', password, 'confirmPassword: ', confirmPassword);
    const resetPasswordParams = {
      adminId,
      verificationCode: confirmPassword,
      newAdminPassword: password,
    };
    adminResetPasswordAPI(dispatch, resetPasswordParams);
  };

  return (
    <>
      <HeaderTextContainer>
        <HeaderText>비밀번호 재설정</HeaderText>
      </HeaderTextContainer>
      <FormProvider {...methods}>
        <FormContainer>
          <InputContainer>
            <FormLabel required>아이디</FormLabel>
            <ExtendedInput
              hasDeleteIcon
              type='text'
              placeholder='아이디를 입력해주세요.'
              name={FORM_KEYS.ADMIN_ID}
              errorMessage={errors[FORM_KEYS.ADMIN_ID]?.message}
            />
            <FormLabel required>비밀번호</FormLabel>
            <ExtendedInput
              hasDeleteIcon
              type='password'
              placeholder='비밀번호를 입력해주세요.'
              name={FORM_KEYS.PASSWORD}
              errorMessage={errors[FORM_KEYS.PASSWORD]?.message}
            />
            <ExtendedInput
              hasDeleteIcon
              type='password'
              placeholder='비밀번호를 재입력해주세요.'
              name={FORM_KEYS.CONFIRM_PASSWORD}
              errorMessage={errors[FORM_KEYS.CONFIRM_PASSWORD]?.message}
            />
            <PasswordGuideText>
              비밀번호 : 8~16자의 영문 대/소문자, 숫자, 특수문자를 조합하여 사용해주세요.
            </PasswordGuideText>
          </InputContainer>
          <AuthenticationButton onClick={handleSubmit(handlePasswordChange)}>비밀번호 변경</AuthenticationButton>
        </FormContainer>
      </FormProvider>
    </>
  );
};

export default PasswordReset;
