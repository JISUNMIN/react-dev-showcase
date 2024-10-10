import { useEffect } from 'react';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import {
  Div,
  FTAImageUpload,
  FTAInput,
  FTALineButton,
  FTAPageTitle,
  FTAPrimaryButton,
  FTARadio,
  FTATitleWithDivider,
  FtHfDropdown,
  InputChip,
  Text,
} from '@src/components';
import useCPs, { CPRequestParams } from '@src/hooks/rest/CPs/useCPs';
import languages from '@src/mocks/data/languages';
import nationals from '@src/mocks/data/nationals';
import PATHS from '@src/router/path';
import { flex, font } from '@src/styles/variables';
import { enumStore } from '@src/zustand';
import type { EnumObject } from '@zustand/enumStore';

interface GridCellStyleProps {
  $last?: boolean;
}

const GridCellStyle = css<GridCellStyleProps>`
  ${font({ size: '16px', weight: '700' })}
  line-height: var(--row-height);
  color: ${({ theme }) => theme.colors.gray10};
  padding-bottom: 24px;
  border-bottom: ${({ theme, $last }) => !$last && `1px solid ${theme.colors.gray03}`};
`;

const DetailButtonStyle = css`
  ${font({ size: '16px', weight: '700' })}
  padding: 15px 18px;
`;

const GridInputChipStyle = css`
  border-color: ${({ theme }) => theme.colors.gray04};
`;

const GridTitle = styled(FTATitleWithDivider)<{ $multi?: boolean }>`
  margin-top: ${({ $multi }) => ($multi ? '60px' : '0')};
`;

const GridBox = styled(Div)`
  --row-height: 50px;

  display: grid;
  grid-template-columns: 140px 1fr;
  row-gap: 32px;
`;

const GridHeader = styled(Text)<GridCellStyleProps>`
  ${GridCellStyle}
`;

const GridContent = styled(Div)<GridCellStyleProps>`
  ${GridCellStyle}
  color: ${({ theme }) => theme.colors.gray08};
  font-weight: 600;
`;

const GridInput = styled(FTAInput<CPRequestParams>)`
  border-color: ${({ theme }) => theme.colors.gray04};
`;

const GridRadioBox = styled(Div)`
  ${flex({ justify: 'start', gap: '18px' })}
`;

const GridRadio = styled(FTARadio<CPRequestParams>)``;

const GridDropdownBox = styled(Div)`
  ${flex({ justify: 'start', gap: '8px' })}
`;

const GridDropdown = styled(FtHfDropdown<CPRequestParams>)``;

const GridImageInput = styled(FTAImageUpload<CPRequestParams>)``;

const GridInputChip = styled(InputChip)`
  width: 400px;
`;

const ButtonBox = styled(Div)`
  ${flex({})}
  margin-top: 60px;
`;

const DetailPrimaryButton = styled(FTAPrimaryButton)`
  ${DetailButtonStyle}
`;

const DetailLineButton = styled(FTALineButton)`
  ${DetailButtonStyle}
`;

const TARGET_ENUM_KEYS: Array<keyof EnumObject> = ['MainCategoryType', 'SubCategoryType'];

const CPInfoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const useFormInstance = useForm<CPRequestParams>();
  const { handleSubmit, reset } = useFormInstance;
  const { getEnumListByKeyList } = enumStore();
  const [mainCategoryList, subCategoryList] = getEnumListByKeyList(TARGET_ENUM_KEYS);
  const { processedUpdateData, isDetailPending, registerMutate } = useCPs(id);

  const handleSaveButtonClick: SubmitHandler<CPRequestParams> = (data) => {
    registerMutate(data);
  };

  const handleGoToListButtonClick = () => {
    navigate(`/${PATHS.CP_INFO}`);
  };

  useEffect(() => {
    if (!isDetailPending && id) {
      console.log(processedUpdateData);
      reset({
        cpManagementInfoId: Number(id),
        cpName: processedUpdateData.cpName,
        mainCategory: processedUpdateData.mainCategory,
        subCategory: processedUpdateData.subCategory,
        // FIXME dropdown 수정되면 반영 필요
        national: processedUpdateData.national,
        language: processedUpdateData.language,
        logoImage: processedUpdateData.logoImage,
        introductionImage: processedUpdateData.introductionImage,
        centerIntroductionImage: processedUpdateData.centerIntroductionImage,
        introduction: processedUpdateData.introduction,
        features: processedUpdateData.features.map((value) => ({ value })),
        exposeYn: processedUpdateData.exposeYn ? '1' : '0',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDetailPending, id]);

  return (
    <>
      <FTAPageTitle title='CP 정보' />
      <FormProvider {...useFormInstance}>
        <GridTitle title='기본 정보' />
        <GridBox>
          <GridHeader>CP명</GridHeader>
          <GridContent>
            <GridInput name='cpName' maxLength={100} placeholder='CP명을 입력해주세요.' />
          </GridContent>
          <GridHeader>컨텐츠 분류 1</GridHeader>
          <GridContent>
            <GridRadioBox>
              {mainCategoryList.map(({ code, value }) => (
                <GridRadio name='mainCategory' key={code} value={code}>
                  {value}
                </GridRadio>
              ))}
            </GridRadioBox>
          </GridContent>
          <GridHeader>컨텐츠 분류 2</GridHeader>
          <GridContent>
            <GridRadioBox>
              {subCategoryList.map(({ code, value }) => (
                <GridRadio name='subCategory.0' key={code} value={code}>
                  {value}
                </GridRadio>
              ))}
            </GridRadioBox>
          </GridContent>
          <GridHeader $last>국가 / 언어</GridHeader>
          <GridContent $last>
            <GridDropdownBox>
              {/* FIXME 국가 / 언어 목록을 불러오는 API 존재하지 않아 mock data 사용 */}
              <GridDropdown name='national' placeholder='국가 선택' content={nationals} />
              <GridDropdown name='language' placeholder='언어 선택' content={languages} />
            </GridDropdownBox>
          </GridContent>
        </GridBox>
        <GridTitle $multi title='외부 센터 프로그램 CP 정보' />
        <GridBox>
          <GridHeader>로고</GridHeader>
          <GridContent>
            <GridImageInput name='logoImage' imageUrl={processedUpdateData.logoImage?.fileUrl} />
          </GridContent>
          <GridHeader>소개 이미지</GridHeader>
          <GridContent>
            <GridImageInput name='introductionImage' imageUrl={processedUpdateData.introductionImage?.fileUrl} />
          </GridContent>
          <GridHeader>센터 소개 이미지</GridHeader>
          <GridContent>
            <GridImageInput
              name='centerIntroductionImage'
              imageUrl={processedUpdateData.centerIntroductionImage?.fileUrl}
            />
          </GridContent>
          <GridHeader>소개글</GridHeader>
          <GridContent>
            <GridInput name='introduction' maxLength={1000} placeholder='소개글을 입력해주세요.' />
          </GridContent>
          <GridHeader>특징</GridHeader>
          <GridContent>
            <GridInputChip
              classes={{ FeatureInput: GridInputChipStyle }}
              inputName='feature'
              name='features'
              placeholder='특징을 추가해주세요. (최대 20개)'
            />
          </GridContent>
          <GridHeader $last>노출 여부</GridHeader>
          <GridContent $last>
            <GridRadioBox>
              {[
                { code: '1', value: '노출' },
                { code: '0', value: '미노출' },
              ].map(({ code, value }) => (
                <GridRadio name='exposeYn' key={code} value={code}>
                  {value}
                </GridRadio>
              ))}
            </GridRadioBox>
          </GridContent>
        </GridBox>
      </FormProvider>
      <ButtonBox>
        <DetailPrimaryButton onClick={handleSubmit(handleSaveButtonClick)}>저장</DetailPrimaryButton>
        <DetailLineButton onClick={handleGoToListButtonClick}>취소</DetailLineButton>
      </ButtonBox>
    </>
  );
};

export default CPInfoForm;
