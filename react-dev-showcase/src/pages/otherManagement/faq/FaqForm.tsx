/** 기타 관리 > FAQ > 등록 및 수정 */
import { useCallback } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as yup from 'yup';

import { Div, FTAEditor, FTAPageTitle, FtHfDropdown, Text } from '@src/components';
import { FTAInput, FTALineButton } from '@src/components/service/atoms';
import useFaq from '@src/hooks/rest/etc/useFaq';
import GridField from '@src/layout/grid/GridField';
import PATHS from '@src/router/path';
import { flex, font } from '@src/styles/variables';
import { enumStore } from '@src/zustand';
import { EnumObject } from '@src/zustand/enumStore';

interface FormValues {
  faqInfoId?: number;
  title: string;
  country: string;
  category: string;
  content: string;
}

const TARGET_ENUM_KEYS: Array<keyof EnumObject> = ['CountryType'];

const FormWrapper = styled.div`
  padding: 20px;
`;

const ExtendsFtaInput = styled(FTAInput)`
  border: 1px solid ${({ theme }) => theme.colors.gray11};
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
  country: yup.string().required('국가는 필수 선택입니다.'),
  category: yup.string().required('카테고리는 필수 선택입니다.'),
  content: yup.string().required('내용은 필수 입력입니다.'),
});

const FaqForm = () => {
  const navigate = useNavigate();

  const { getEnumListByKeyList } = enumStore();
  const [countryEnumList] = getEnumListByKeyList(TARGET_ENUM_KEYS);

  const { processedDetailData, registMutation } = useFaq();

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      faqInfoId: processedDetailData?.faqInfoId,
      title: processedDetailData.title,
      category: processedDetailData.category,
      content: processedDetailData.content,
      country: processedDetailData.country,
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const handleCancel = useCallback(() => {
    navigate(`${PATHS.ROOT}${PATHS.FAQ}`);
  }, [navigate]);

  const onSubmit = useCallback(
    (data: FormValues) => {
      const formData = {
        faqInfoId: processedDetailData.faqInfoId || 0,
        category: data.category || '',
        content: data.content,
        country: processedDetailData.country || '',
        title: data.title,
      };

      registMutation.mutate(formData, {
        onSuccess: () => {
          navigate(`${PATHS.ROOT}${PATHS.FAQ}`);
        },
        onError: () => {
          console.error('Failed to register/update FAQ');
        },
      });
    },
    [processedDetailData, registMutation, navigate]
  );

  return (
    <FormProvider {...methods}>
      <FormWrapper>
        <FTAPageTitle title='FAQ' />
        <PageDesc>
          별표(<span>*</span>)가 표시된 항목은 필수입력 항목입니다.
        </PageDesc>
        {/* FIXME 등록 시에도 번호가 필요한가요? */}
        {/* <GridBox>
          <ItemTitle $isRequired={true}>번호</ItemTitle>
          <Text>{}</Text>
        </GridBox> */}
        <GridField label='제목' isRequired>
          <ExtendsFtaInput
            type='text'
            name='title'
            placeholder='제목을 입력해주세요'
            debounce={{ enabled: true, delay: 500 }}
          />
        </GridField>
        <GridField label='국가' isRequired>
          {/* FIXME dropdown 변경 후 수정 */}
          <Div>
            <FtHfDropdown
              line='true'
              size='large'
              name='country'
              placeholder='국가 선택 '
              content={countryEnumList.map((item) => item.code)}
              height={'50px'}
            />
            {errors.country && <ErrorText>{errors.country.message}</ErrorText>}
          </Div>
        </GridField>
        <GridField isRequired label='카테고리'>
          <Div>
            {/* FIXME dropdown 변경 후 수정  */}
            <FtHfDropdown
              line='true'
              size='large'
              name='category'
              placeholder='카테고리 선택 '
              // content={noteCategoryEnumList.map((item) => item.value)} // FIXME ENUM 값에서 없는듯함
              content={[processedDetailData.category]}
              height={'50px'}
            />
            {errors.category && <ErrorText>{errors.category.message}</ErrorText>}
          </Div>
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

export default FaqForm;
