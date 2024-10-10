/** 기타 관리 > cs 대응 (테이블) / cs 대응 등록 */
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as yup from 'yup';

import { Div, FTAEditor, FTAPageTitle, Text } from '@src/components';
import { FTAInput, FTALineButton } from '@src/components/service/atoms';
import useCS from '@src/hooks/rest/etc/useCS';
import GridField from '@src/layout/grid/GridField';
import PATHS from '@src/router/path';
import { flex, font } from '@src/styles/variables';

interface FormValues {
  csRequestInfoId?: number;
  title: string;
  content: string;
}

const FormWrapper = styled(Div)`
  padding: 20px;
`;

const ExtendsFtaInput = styled(FTAInput)`
  border: 1px solid ${({ theme }) => theme.colors.gray11};
  width: 620px;
`;

const ButtonContainer = styled(Div)`
  ${flex({})}
`;

const PageDesc = styled(Text)`
  color: ${({ theme }) => theme.colors.gray06};
  span {
    color: ${({ theme }) => theme.colors.red};
  }
`;

const ErrorText = styled(Text)`
  margin: 5px 0;
  padding: 8px 0;
  color: ${({ theme }) => theme.colors.red};
  ${font({ size: '14px', weight: '400' })}
`;

const schema = yup.object().shape({
  title: yup.string().required('제목은 필수 입력입니다.'),
  content: yup.string().required('내용은 필수 입력입니다.'),
});

const CsResponseForm = () => {
  const navigate = useNavigate();
  const { processedDetailData, registMutation } = useCS();

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      csRequestInfoId: processedDetailData?.csRequestInfoId || 0,
      title: '',
      content: '',
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const handleCancel = () => {
    navigate(`${PATHS.ROOT}${PATHS.CS_RESPONSE}`);
  };

  const onSubmit = (data: FormValues) => {
    const params = {
      csRequestInfoId: data.csRequestInfoId,
      csInfoReplyDTO: {
        title: data.title,
        content: data.content,
      },
    };

    registMutation.mutate(params, {
      onSuccess: () => {
        navigate(`${PATHS.ROOT}${PATHS.CS_RESPONSE}`);
      },
      onError: () => {
        console.error('error regist answer');
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <FormWrapper>
        <FTAPageTitle title='CS 대응' />
        <PageDesc>
          별표(<span>*</span>)가 표시된 항목은 필수입력 항목입니다.
        </PageDesc>
        <GridField label='제목' isRequired>
          <ExtendsFtaInput
            type='text'
            name='title'
            placeholder='제목을 입력해주세요'
            maxLength={100}
            debounce={{ enabled: true, delay: 500 }}
          />
        </GridField>
        <GridField isRequired label='내용' alignStart>
          <Div>
            <FTAEditor isEditMode name='content' html={processedDetailData.content} />
            {errors.content && <ErrorText>{errors.content.message}</ErrorText>}
          </Div>
        </GridField>
        <ButtonContainer>
          <FTALineButton onClick={handleCancel}>취소</FTALineButton>
          <FTALineButton onClick={handleSubmit(onSubmit)}>저장</FTALineButton>
        </ButtonContainer>
      </FormWrapper>
    </FormProvider>
  );
};

export default CsResponseForm;
