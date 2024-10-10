import { useEffect, useMemo, useRef, useState } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import styled from 'styled-components';

import { Div, FTADropdown, FTADropdownMult, RangeCalendar, TabMenu } from '@src/components';
import FilterChip from '@src/components/molecules/chip/FilterChip';
import { useQueryParams } from '@src/hooks';
import { TIME_OPTIONS } from '@src/libs/utils/dataProcessing';
import { flex } from '@src/styles/variables';
import { CodeValue } from '@src/zustand/enumStore';

import CPManagement from './modules/CPManagement';
import ContentManagement from './modules/ContentManagement';

export interface RequiredQueryParams {
  REGION_OPTIONS: CodeValue[];
  PLATFORM_OPTIONS: CodeValue[];
  AGE_GROUP_OPTIONS: CodeValue[];
  PRIMARY_MENU_OPTIONS: CodeValue[];
  secondaryMenuOptions: CodeValue[];
  DAY_OPTIONS: CodeValue[];
  TIME_OPTIONS: CodeValue[];
}

interface RHFArgs {
  PLATFORM_OPTIONS: CodeValue[];
  AGE_GROUP_OPTIONS: CodeValue[];
  PRIMARY_MENU_OPTIONS: CodeValue[];
  secondaryMenuOptions: CodeValue[];
  DAY_OPTIONS: CodeValue[];
  TIME_OPTIONS: CodeValue[];
}

const tabData = [
  { id: 'tab1', title: 'CP사 관리', content: <CPManagement /> },
  { id: 'tab2', title: '컨텐츠 관리', content: <ContentManagement /> },
];

const CP_OPTIONS = [
  { code: '서초 지점', value: '서초 지점' },
  { code: '학동 지점', value: '학동 지점' },
  { code: '교대 지점', value: '교대 지점' },
];

const REGION_OPTIONS = [
  { code: '대한민국', value: '대한민국' },
  { code: '무언가', value: '무언가' },
];

const PLATFORM_OPTIONS = [
  { code: 'WebOS 4.0', value: 'WebOS 4.0' },
  { code: 'WebOS 4.5', value: 'WebOS 4.5' },
  { code: 'WebOS 5.0', value: 'WebOS 5.0' },
  { code: 'WebOS 6.0', value: 'WebOS 6.0' },
  { code: 'WebOS 22', value: 'WebOS 22' },
  { code: 'WebOS 23', value: 'WebOS 23' },
];
const AGE_GROUP_OPTIONS = [
  { code: '20대 미만', value: '20대 미만' },
  { code: '20대', value: '20대' },
  { code: '30대', value: '30대' },
  { code: '40대', value: '40대' },
  { code: '50대', value: '50대' },
  { code: '60대', value: '60대' },
  { code: '70대', value: '70대' },
  { code: '80대 이상', value: '80대 이상' },
];

const PRIMARY_MENU_OPTIONS = [
  { code: '바디 체크업', value: '바디 체크업' },
  { code: '홈케어 프로그램', value: '홈케어 프로그램' },
  { code: '아웃도어 액티비티', value: '아웃도어 액티비티' },
];

const DAY_OPTIONS = [
  { code: '일', value: '일' },
  { code: '월', value: '월' },
  { code: '화', value: '화' },
  { code: '수', value: '수' },
  { code: '목', value: '목' },
  { code: '금', value: '금' },
  { code: '토', value: '토' },
];

const SECONDARY_MENU_OPTIONS = [
  [
    { code: '체형분석', value: '체형분석' },
    { code: '관절가동범위', value: '관절가동범위' },
    { code: '신체 균형', value: '신체 균형' },
    { code: '신체능력', value: '신체능력' },
  ],
  [
    { code: '프로그램', value: '프로그램' },
    { code: 'AI 추천 프로그램', value: 'AI 추천 프로그램' },
  ],
  [
    { code: '산책/조깅', value: '산책/조깅' },
    { code: '하이킹', value: '하이킹' },
    { code: '골프 코칭', value: '골프 코칭' },
    { code: '트레이닝', value: '트레이닝' },
  ],
];

const Container = styled(Div)`
  --height: 400px;
  --padding: 10px;
  --border-radius: 16px;
  --border: 1px solid ${({ theme }) => theme.colors.gray04};
  --line-padding: 0px 0px 0px 32px;
`;

const ChipDateContainer = styled(Div)`
  ${flex({ justify: 'space-between', gap: '10px' })}
  margin-bottom: 15px;
`;

const SelectBoxContainer = styled(Div)`
  ${flex({ justify: '', align: '', gap: '10px' })}
  margin-bottom: 40px;
`;

const StyledRHFDropDownMult = styled(FTADropdownMult)``;

const StyledRHFDropDown = styled(FTADropdown)``;

const ReportCP = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const hookformInstance = useForm<RHFArgs>();
  const [primaryMenuSelectedIndex, setPrimaryMenuSelectedIndex] = useState<number | null>(null);
  const [secondaryMenuOptions, setSecondaryMenuOptions] = useState<CodeValue[]>([]);
  const { setQueryParam } = useQueryParams<{ [key: string]: string }>();
  const preSecondaryMenuOptions = useRef(null);
  const timeOption = useMemo(() => TIME_OPTIONS(), []);

  useEffect(() => {
    if (primaryMenuSelectedIndex !== null) {
      setSecondaryMenuOptions(SECONDARY_MENU_OPTIONS[primaryMenuSelectedIndex]);
      if (
        preSecondaryMenuOptions.current !== null &&
        preSecondaryMenuOptions.current !== SECONDARY_MENU_OPTIONS[primaryMenuSelectedIndex]
      ) {
        setQueryParam('secondaryMenuOptions', '');
      }
    }
  }, [primaryMenuSelectedIndex]);

  return (
    <Container>
      <FormProvider {...hookformInstance}>
        <TabMenu tabData={tabData} currentTabIndex={currentTabIndex} setCurrentTabIndex={setCurrentTabIndex}>
          <ChipDateContainer>
            <FilterChip
              name='CP_OPTIONS'
              fieldArrayName='CP_OPTIONS_FIELD_ARRAY'
              placeholder={'CP선택'}
              content={CP_OPTIONS}
            />
            <RangeCalendar name='calendar' />
          </ChipDateContainer>
          <SelectBoxContainer>
            <StyledRHFDropDownMult name='REGION_OPTIONS' content={REGION_OPTIONS} placeholder='권역 선택' />
            <StyledRHFDropDownMult name='PLATFORM_OPTIONS' content={PLATFORM_OPTIONS} placeholder='플랫폼 선택' />
            <StyledRHFDropDownMult name='AGE_GROUP_OPTIONS' content={AGE_GROUP_OPTIONS} placeholder='연령대 선택' />
            <StyledRHFDropDown
              name='PRIMARY_MENU_OPTIONS'
              content={PRIMARY_MENU_OPTIONS}
              placeholder='1차 메뉴 선택'
              setCheckedIndex={setPrimaryMenuSelectedIndex}
            />
            <StyledRHFDropDownMult
              name='secondaryMenuOptions'
              content={secondaryMenuOptions}
              placeholder='2차 메뉴 선택'
              disabled={primaryMenuSelectedIndex === null}
            />
            <StyledRHFDropDownMult name='DAY_OPTIONS' content={DAY_OPTIONS} placeholder='요일 선택' />
            <StyledRHFDropDownMult name='TIME_OPTIONS' content={timeOption} placeholder='시간 선택' />
          </SelectBoxContainer>
        </TabMenu>
      </FormProvider>
    </Container>
  );
};

export default ReportCP;
