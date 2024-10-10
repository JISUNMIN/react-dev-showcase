import { ERRORS, VALIDATION_REGEXES } from '@FTA/data';
import AuthenticationButton from '@FTA/pages/authentication/modules/AuthenticationButton';
import { yupResolver } from '@hookform/resolvers/yup';
import { adminResetSendEmailAPI } from '@redux/action/adminAction';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';

import { Input } from '@components/index';

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

const HeaderSubText = styled.p`
  font-size: 18px;
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

const FormLabel = styled.p`
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

const FORM_KEYS = Object.freeze({
  ID: 'id',
});

const schema = yup.object().shape({
  [FORM_KEYS.ID]: yup
    .string()
    .matches(VALIDATION_REGEXES.EMAIL, ERRORS.INVALID_VALUE)
    .required(ERRORS.INVALID_CREDENTIALS),
});

const PasswordFind = () => {
  const dispatch = useDispatch();
  const methods = useForm({ resolver: yupResolver(schema) });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const handleNext = ({ [FORM_KEYS.ID]: id }) => {
    console.log('id: ', id);
    const existParams = {
      adminId: id,
    };
    adminResetSendEmailAPI(dispatch, existParams);
  };

  return (
    <>
      <HeaderTextContainer>
        <HeaderText>비밀번호 찾기</HeaderText>
        <HeaderSubText>가입한 이메일 계정을 통해 비밀번호를 재설정하세요.</HeaderSubText>
      </HeaderTextContainer>
      <FormProvider {...methods}>
        <FormContainer>
          <InputContainer>
            <FormLabel>ID</FormLabel>
            <ExtendedInput
              hasDeleteIcon
              type='text'
              placeholder='ID를 입력해주세요 (이메일 형식만 가능)'
              name={FORM_KEYS.ID}
              errorMessage={errors[FORM_KEYS.ID]?.message}
            />
          </InputContainer>
          <AuthenticationButton onClick={handleSubmit(handleNext)}>다음</AuthenticationButton>
        </FormContainer>
      </FormProvider>
    </>
  );
};

export default PasswordFind;
