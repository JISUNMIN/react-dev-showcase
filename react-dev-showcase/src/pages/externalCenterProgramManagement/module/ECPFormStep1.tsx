/** 외부 센터프로그램 관리 > 프로그램 구성 > 등록 (기본 정보)*/
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { Div, FTAImageUpload, FtHfDropdown, Text } from '@src/components';
import { FTAInput, FTALineButton } from '@src/components/service/atoms';
import FTARadio from '@src/components/service/atoms/FTARadio';
import { PseudoElement, flex, font, grid, size } from '@src/styles/variables';
import { enumStore } from '@src/zustand';
import { EnumObject } from '@src/zustand/enumStore';

interface StepProps {
  step: number;
  onNext: () => void;
  handleCancel: () => void;
}

interface FormValues {}

const TARGET_ENUM_KEYS: Array<keyof EnumObject> = [
  'CategoryType',
  'AgeGroupType',
  'ExerciseIntensityType',
  'LevelType',
  'RecommendAgeType',
  'LanguageType',
  'CountryType',
];

const FormWrapper = styled.div`
  padding: 20px;
`;

const SectionTitleWraper = styled(Div)`
  ${flex({ align: 'start', direction: 'column' })}
  margin-bottom: 40px;

  &:after {
    content: '';
    ${size({ w: '100%', h: '2px' })}
    background-color: ${({ theme }) => theme.colors.gray07};
  }
`;

const SectionTitle = styled(Text)`
  ${font({ size: '22px', weight: '700' })}
  color: ${({ theme }) => theme.colors.gray10};
  padding-top: 20px;
  padding-bottom: 20px;
`;

const GridBox = styled(Div)`
  ${grid({ columns: 'minmax(140px, 1fr) 15fr', gap: '20px', align: 'center' })}
  padding-top: 24px;
  padding-bottom: 24px;
`;

const ExtendsFtaInput = styled(FTAInput)`
  border: 1px solid ${({ theme }) => theme.colors.gray11};
`;

const ItemTitle = styled(Text)<{ $isRequired: boolean }>`
  display: inline;
  position: relative;
  font-weight: bold;
  word-break: keep-all;
  ${({ $isRequired, theme }) =>
    $isRequired &&
    `
      &:after {
        ${PseudoElement({ width: '100%', height: '100%', top: '0', left: '100%' })}
        content: '*';
        font-size: 13px;
        color: ${theme.colors.red};
      }
    `}
`;

const FlexContainer = styled(Div)`
  ${flex({ justify: 'left', align: 'baseline' })}
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

const ECPFormStep1 = ({ onNext, handleCancel }: StepProps) => {
  const { handleSubmit } = useFormContext();
  const { getEnumListByKeyList } = enumStore();

  const [
    categoryTypeEnumList,
    ageGroupTypeEnumList,
    exerciseIntensityTypeEnumList,
    levelTypeEnumList,
    recommendAgeTypeEnumList,
    languageTypeEnumList,
    countryTypeEnumList,
  ] = getEnumListByKeyList(TARGET_ENUM_KEYS);

  const onSubmit = (data: FormValues) => {
    console.log('data :: ', data);
    // FIXME 저장
    onNext();
  };

  return (
    <FormWrapper>
      <div>기본 정보</div> {/* FIXME pagetitle 로 수정 */}
      <PageDesc>
        별표(<span>*</span>)가 표시된 항목은 필수입력 항목입니다.
      </PageDesc>
      <SectionTitleWraper>
        <SectionTitle>기본정보</SectionTitle>
      </SectionTitleWraper>
      <GridBox>
        <ItemTitle $isRequired={true}>cp명</ItemTitle>
        <ExtendsFtaInput
          type='text'
          name='cpName'
          placeholder='CP를 선택해주세요'
          maxLength={10}
          debounce={{ enabled: true, delay: 500 }}
        />
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true}>프로그램명</ItemTitle>
        <FlexContainer>
          {/* FIXME ENUM 값으로 수정 */}
          <FtHfDropdown
            line='true'
            size='large'
            name='languageType'
            placeholder='언어 선택'
            content={languageTypeEnumList.map((item) => item.value)}
            height={'50px'}
          />
          <ExtendsFtaInput
            type='text'
            name='programName'
            placeholder='프로그램명을 입력해주세요'
            debounce={{ enabled: true, delay: 500 }}
          />
        </FlexContainer>
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true}>프로그램 이미지</ItemTitle>
        <FTAImageUpload name='file' required={true} />
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true}>소개글</ItemTitle>
        <ExtendsFtaInput
          type='text'
          name='programDescription'
          placeholder='소개를 입력해주세요'
          debounce={{ enabled: true, delay: 500 }}
        />
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true}>유/무료</ItemTitle>
        <FlexContainer>
          <FTARadio id='priceYn' name='priceYn'>
            유료
          </FTARadio>
          <FTARadio id='priceYn' name='priceYn'>
            무료
          </FTARadio>
        </FlexContainer>
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true}>프로그램 정보</ItemTitle>
        <FlexContainer>
          {/* FIXME ENUM  code value mapping 수정 */}
          <FtHfDropdown
            name='category'
            content={categoryTypeEnumList.map((item) => item.value)}
            height={'50px'}
            placeholder='운동 종류'
          />
          <FtHfDropdown
            name='ageGroup'
            placeholder='연령대'
            content={ageGroupTypeEnumList.map((item) => item.value)}
            height={'50px'}
          />
          <FtHfDropdown
            name='exerciseTime'
            content={exerciseIntensityTypeEnumList.map((item) => item.value)}
            height={'50px'}
            placeholder='운동 시간'
          />
          <FtHfDropdown
            name='exerciseLevel'
            placeholder='운동 수준'
            content={levelTypeEnumList.map((item) => item.value)}
            height={'50px'}
          />
          <FtHfDropdown
            name='exerciseIntensity'
            placeholder='운동 강도'
            content={recommendAgeTypeEnumList.map((item) => item.value)}
            height={'50px'}
          />
        </FlexContainer>
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true}>노출 여부</ItemTitle>
        <FlexContainer>
          <FTARadio id='free' name='free'>
            노출
          </FTARadio>
          <FTARadio id='free' name='free'>
            미노출
          </FTARadio>
        </FlexContainer>
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true}>국가 / 언어</ItemTitle>
        <FlexContainer>
          {/* FIXME ENUM 값으로 수정 */}
          <FtHfDropdown
            name='countryType'
            placeholder='국가 선택'
            content={countryTypeEnumList.map((item) => item.value)}
            height={'50px'}
          ></FtHfDropdown>
          <FtHfDropdown
            name='languageType'
            placeholder='언어 선택'
            content={languageTypeEnumList.map((item) => item.value)}
            height={'50px'}
          />
        </FlexContainer>
      </GridBox>
      <ButtonContainer>
        <FTALineButton onClick={handleCancel}>작성 취소</FTALineButton>
        <FTALineButton onClick={handleSubmit(onSubmit)}>다음</FTALineButton>
      </ButtonContainer>
    </FormWrapper>
  );
};

export default ECPFormStep1;
