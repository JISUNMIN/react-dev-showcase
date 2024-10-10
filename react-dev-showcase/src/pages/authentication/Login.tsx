import { useCallback } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as yup from 'yup';

import PATHS from '@router/path';
import { invertedLogo } from '@src/assets/images';
import { Div, FTAInput, FTAPrimaryButton, Icon, Text } from '@src/components';
import useLogin, { LoginParams } from '@src/hooks/rest/useLogin';
import { flex, font, size } from '@src/styles/variables';

interface LoginProps {
  adminId: string;
  adminPw: string;
}

const Logo = styled(Icon)`
  ${size({ w: '230px', h: '60px' })}
`;

const Container = styled(Div)`
  margin-top: 68px;
  ${flex({ direction: 'column', gap: '50px' })}
`;

const GreetingTextBox = styled(Div)``;

const GreetingText = styled(Text)`
  ${font({ size: '39px', weight: '700' })} // NOTE 디자인대로 font-size: 40px 시 overflow 발생
  line-height: 1.17;
  text-align: center;
  word-break: break-all;
`;

const LoginFormBox = styled(Div)`
  ${flex({ direction: 'column', gap: '24px' })}
  ${size({ w: '100%' })}
`;

const LoginInputLabel = styled.label`
  ${size({ w: '100%' })}
`;

const LoginInputText = styled(Text)<{ $underline?: boolean }>`
  color: ${({ theme }) => theme.colors.gray07};
  text-decoration: ${({ $underline }) => ($underline ? 'underline' : 'none')};
  cursor: ${({ $underline }) => ($underline ? 'pointer' : 'none')};
`;

const PasswordInputTextBox = styled(Div)`
  ${flex({ gap: 'none', justify: 'space-between' })}
`;

const LoginInput = styled(FTAInput<LoginProps>)`
  ${size({ w: '100%' })}
  border-color: ${({ theme }) => theme.colors.gray04};
  margin-top: 12px;
`;

const AuthenticationButton = styled(FTAPrimaryButton)`
  ${size({ w: '100%' })}
`;

const AuthenticationBox = styled(Div)``;

const AuthenticationText = styled(Text).attrs({ as: 'span' })`
  color: ${({ theme }) => theme.colors.gray09};
`;

const GoToRegisterText = styled(Text).attrs({ as: 'span' })`
  color: ${({ theme }) => theme.colors.gray07};
  text-decoration: underline;
  margin-left: 4px;
  cursor: pointer;
`;

const schema = yup.object().shape({
  adminId: yup.string().required('ID를 입력해주세요'),
  adminPw: yup.string().required('비밀번호를 입력해주세요'),
});

const Login = () => {
  const { login } = useLogin();
  const navigate = useNavigate();
  const formInstance = useForm<LoginProps>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });
  const {
    handleSubmit,
    formState: { isValid },
  } = formInstance;

  const handleLogin = useCallback<SubmitHandler<LoginProps>>(
    ({ adminId, adminPw }) => {
      const params: LoginParams = {
        adminId,
        adminPw,
        adminType: 'CP', // NOTE 추후에 내부망 / 외부망이냐에 따라 adminType 변경
      };

      login(params);
    },
    [login]
  );

  const handleGoToFindPassword = useCallback(() => {
    navigate(`/${PATHS.PASSWORD}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoToRegister = useCallback(() => {
    navigate(`/${PATHS.REGISTER}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Logo icon={invertedLogo} />
      <Container>
        <GreetingTextBox>
          <GreetingText>LG Intelli FiT</GreetingText>
          <GreetingText>Admin 포털에 오신 것을 환영합니다.</GreetingText>
        </GreetingTextBox>
        <LoginFormBox>
          <FormProvider {...formInstance}>
            <LoginInputLabel>
              <LoginInputText>ID</LoginInputText>
              <LoginInput name='adminId' placeholder='ID를 입력해주세요' hasDeleteIcon />
            </LoginInputLabel>
            <LoginInputLabel>
              <PasswordInputTextBox>
                <LoginInputText>비밀번호</LoginInputText>
                <LoginInputText $underline onClick={handleGoToFindPassword}>
                  비밀번호 찾기
                </LoginInputText>
              </PasswordInputTextBox>
              <LoginInput name='adminPw' placeholder='비밀번호를 입력해주세요' hasDeleteIcon />
            </LoginInputLabel>
            <AuthenticationButton onClick={handleSubmit(handleLogin)} disabled={!isValid}>
              로그인
            </AuthenticationButton>
          </FormProvider>
        </LoginFormBox>
        <AuthenticationBox>
          <AuthenticationText>아직 회원이 아니신가요?</AuthenticationText>
          <GoToRegisterText onClick={handleGoToRegister}>회원가입</GoToRegisterText>
        </AuthenticationBox>
      </Container>
    </>
  );
};

export default Login;
