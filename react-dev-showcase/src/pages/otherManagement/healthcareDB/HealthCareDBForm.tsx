/** 기타 관리 > 헬스케어 DB (테이블) / 헬스케어 DB 등록 및 수정*/
import { useCallback, useMemo } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as yup from 'yup';

import { Div, FTAFileInput, FTAPageTitle, FtHfDropdown, Text } from '@src/components';
import { FTAInput, FTALineButton } from '@src/components/service/atoms';
import useHealthcareDB from '@src/hooks/rest/useHealthcareDB';
import GridField from '@src/layout/grid/GridField';
import PATHS from '@src/router/path';
import { flex, font } from '@src/styles/variables';
import { enumStore, userInfoStore } from '@src/zustand';
import { EnumObject } from '@src/zustand/enumStore';

interface HealthCareFile {
  fileId?: number;
  fileType?: string;
  fileLocation?: string;
  fileUrl?: string;
  originalFileName?: string;
  realFileName?: string;
  playTime?: number;
  fileSize?: number;
  useYn?: boolean;
  registDate?: string;
  registUser?: string;
  registUtc?: string;
}

interface FormValues {
  healthCareInfoId?: number;
  mainCategoryType: string;
  subCategoryType: string;
  content: string;
  country: string;
  languageType: string;
  healthCareFile: {
    fileId?: number;
    fileType?: string;
    fileLocation?: string;
    fileUrl?: string;
    originalFileName?: string;
    realFileName?: string;
    playTime?: number;
    fileSize?: number;
    useYn?: boolean;
    registDate?: string;
    registUser?: string;
    registUtc?: string;
  };
}

const TARGET_ENUM_KEYS: Array<keyof EnumObject> = [
  'HealthCareMainType',
  'HealthCareSubType',
  'CountryType',
  'LanguageType',
];

const FormWrapper = styled(Div)`
  padding: 20px;
`;

const GridBox = styled(Div)`
  ${flex({ justify: 'start' })}
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
  mainCategoryType: yup.string().required('DB 종류 선택은 필수 입력입니다.'),
  subCategoryType: yup.string().required('DB 종류 2차 선택은 필수 입력입니다.'),
  country: yup.string().required('국가는 필수 선택입니다.'),
  languageType: yup.string().required('언어는 필수 선택입니다.'),
  content: yup.string().required('내용은 필수 입력입니다.'),
  healthCareFile: yup.object().required('파일등록은 필수입니다.'),
});

const HealthCareDBForm = () => {
  const navigate = useNavigate();
  const { userInfo } = userInfoStore((state) => state);
  const { getEnumListByKeyList } = enumStore();
  const [mainEnumList, subEnumList, countryEnumList, languageEnumList] = getEnumListByKeyList(TARGET_ENUM_KEYS);
  const { processedDetailData, registMutation } = useHealthcareDB();

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      healthCareInfoId: processedDetailData?.healthCareInfoId || 0,
      mainCategoryType: processedDetailData.mainCategoryType,
      subCategoryType: processedDetailData.subCategoryType,
      content: processedDetailData.content,
      country: processedDetailData.country,
      languageType: processedDetailData.languageType,
      healthCareFile: processedDetailData.healthCareFile || {},
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const formData = useMemo(() => new FormData(), []);

  const fileOnChange = useCallback(
    (file: File, fileId: number) => {
      formData.append('file', file);
      const healthCareFiles: HealthCareFile = {
        fileId: fileId,
        fileType: file.type,
        originalFileName: file.name,
        realFileName: file.name,
        fileSize: file.size,
        useYn: true,
        registUser: '',
      };
      methods.setValue('healthCareFile', healthCareFiles);
    },
    [formData, methods]
  );

  const handleCancel = () => {
    navigate(`${PATHS.ROOT}${PATHS.HEALTHCAREDB}`);
  };

  const onSubmit = (data: FormValues) => {
    const params = {
      ...(data.healthCareInfoId !== 0 && { healthCareInfoId: data.healthCareInfoId }),
      mainCategoryType: data.mainCategoryType,
      subCategoryType: data.subCategoryType,
      content: data.content,
      country: data.country,
      languageType: data.languageType,
    };

    const jsonString = JSON.stringify(params);

    formData.append('healthCareInfoDTO', jsonString);

    registMutation.mutate(formData, {
      onSuccess: () => {
        navigate(`${PATHS.ROOT}${PATHS.HEALTHCAREDB}`);
      },
      onError: () => {
        console.error('error regist/edit');
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <FormWrapper>
        <FTAPageTitle title='헬스케어 DB' />
        <PageDesc>
          별표(<span>*</span>)가 표시된 항목은 필수입력 항목입니다.
        </PageDesc>
        <GridField label='DB 종류 선택' isRequired>
          {/** FIXME ENUM 값 수정 */}
          <Div>
            <GridBox>
              <FtHfDropdown
                line='true'
                size='large'
                name='mainCategoryType'
                placeholder={
                  processedDetailData?.mainCategoryType ? processedDetailData?.mainCategoryType : 'DB 종류 선택'
                }
                content={mainEnumList.map((item) => item.code)}
                height='50px'
              />
              <FtHfDropdown
                line='true'
                size='large'
                name='subCategoryType'
                placeholder={processedDetailData?.subCategoryType ? processedDetailData?.subCategoryType : '2차 선택'}
                content={subEnumList.map((item) => item.code)}
                height='50px'
              />
            </GridBox>
            {errors.mainCategoryType && <ErrorText>{errors.mainCategoryType.message}</ErrorText>}
            {errors.subCategoryType && <ErrorText>{errors.subCategoryType.message}</ErrorText>}
          </Div>
        </GridField>
        <GridField label='국가' isRequired>
          <Div>
            <FtHfDropdown
              line='true'
              size='large'
              name='country'
              placeholder={processedDetailData?.country ? processedDetailData?.country : '국가 선택'}
              content={countryEnumList.map((item) => item.code)}
              height='50px'
            />
            {errors.country && <ErrorText>{errors.country.message}</ErrorText>}
          </Div>
        </GridField>
        <GridField label='언어' isRequired>
          <Div>
            <FtHfDropdown
              line='true'
              size='large'
              name='languageType'
              placeholder={processedDetailData?.languageType ? processedDetailData?.languageType : '언어 선택'}
              content={languageEnumList.map((item) => item.code)}
              height='50px'
            />
            {errors.languageType && <ErrorText>{errors.languageType.message}</ErrorText>}
          </Div>
        </GridField>
        <GridField label='업데이트 사항' isRequired>
          <ExtendsFtaInput
            type='text'
            name='content'
            placeholder='업데이트 사항을 입력해주세요'
            debounce={{ enabled: true, delay: 500 }}
          />
        </GridField>
        <GridField label='DB 파일 업로드'>
          <Div>
            {/** FIXME  FTAFileInput 파일 업로드 수정 */}
            <FTAFileInput name='healthCareFile' adminId={userInfo?.adminInfoId || ''} fileOnChange={fileOnChange} />
            {errors.healthCareFile && <ErrorText>{errors.healthCareFile.message}</ErrorText>}
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

export default HealthCareDBForm;
