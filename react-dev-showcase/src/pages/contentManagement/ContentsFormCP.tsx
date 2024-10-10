/** 컨텐츠 관리 > CP 컨텐츠 관리 등록*/
import { ChangeEvent, MutableRefObject, useCallback, useEffect, useMemo, useRef } from 'react';

import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Div, FTAImageUpload, FTAInput, FTAPageTitle, FTAVideoUpload, Modal, Span, Text } from '@src/components';
import { FTACheckbox, FTALineButton, FTAPrimaryButton } from '@src/components/service/atoms';
import FTARadio from '@src/components/service/atoms/FTARadio';
import { useModal } from '@src/hooks';
import useContentsRoutine from '@src/hooks/rest/contents/useContentsCP';
import { flex, font, grid } from '@src/styles/variables';

const DefaultSectionTitleWraper = styled(Div)`
  ${flex({ align: 'start', direction: 'column' })}
  margin-top: 40px;

  &:after {
    content: '';
    height: 2px;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.gray07};
  }
`;
const SectionTitle = styled(Text)`
  ${font({ size: '22px', weight: '700' })}
  color: ${({ theme }) => theme.colors.gray10};
  padding-top: 20px;
  padding-bottom: 20px;
`;
const ItemTitle = styled(Span)<{ $isRequired: boolean; $colSpan?: number; $rowSpan?: number }>`
  ${font({ weight: '700' })};
  word-wrap: break-word;
  ${({ $colSpan }) => {
    if ($colSpan && $colSpan > 0) {
      return `grid-column: 1 / span ${$colSpan};`;
    }
    $colSpan;
  }}
  ${({ $rowSpan }) => {
    if ($rowSpan && $rowSpan > 0) {
      return `grid-row: 1 / span ${$rowSpan};`;
    }
    $rowSpan;
  }}
  ${({ $isRequired }) =>
    $isRequired &&
    `
      &:after {
        content: '*';
        color: #f44b4a;
        ${font({ size: '13px' })};
      }
    `}
`;
const InfoText = styled(Text)`
  ${font({ size: '14', weight: '400' })};
  color: ${({ theme }) => theme.colors.gray07};
`;

const GridBox = styled(Div)`
  ${grid({ columns: 'minmax(160px, 1fr) 15fr', rows: 'auto', align: 'center' })}
  column-gap: 20px;
  row-gap: 16px;
  padding: 24px 0;
  min-height: 100px;
`;
const RadioBox = styled(Div)`
  ${grid({ columns: 'repeat(auto-fill, minmax(140px, auto))', rows: 'auto', align: 'center', gap: '18px' })}
  grid-auto-flow: dense;
  max-width: 700px;
`;
const RadioBoxHorizen = styled(Div)`
  ${flex({ justify: 'start' })}
`;
const CheckboxWraper = styled(Div)`
  ${grid({ columns: 'repeat(auto-fill, minmax(140px, auto))', rows: 'auto', align: 'center', gap: '18px' })}
  grid-auto-flow: dense;
  max-width: 700px;
`;

const RomTypeContainer = styled(Div)`
  ${grid({ columns: '70px repeat(5, auto)', rows: 'auto', align: 'center', gap: '16px 24px' })}
  max-width: 800px;
`;
const ROM_TYPE_ALL_INDEXES = [0, 6, 10, 14, 16];
const RomTypeChecboxContainer = styled(Div)<{ $romTypeIndex: number }>`
  ${({ theme, $romTypeIndex }) => {
    if (ROM_TYPE_ALL_INDEXES.includes($romTypeIndex)) return `border-right: 1px solid ${theme.colors.gray05}`;
    return '';
  }};
  grid-column: ${({ $romTypeIndex }) => {
    if ($romTypeIndex === 9) return 'span 3';
    if ($romTypeIndex === 13) return 'span 3';
    if ($romTypeIndex === 15) return 'span 5';

    return 'auto';
  }};
`;

const ButtonSection = styled(Div)`
  width: 100%;
  ${flex({ justify: 'center', gap: '10px' })}
`;

const ExtendedButton = styled(FTALineButton)`
  width: 75px;
  height: 55px;
  padding: 15px 18px;
  ${font({ size: '16px', weight: '700' })}
`;

const ExtendedPrimaryButton = styled(FTAPrimaryButton)`
  width: 75px;
  height: 55px;
  padding: 15px 18px;
  ${font({ size: '16px', weight: '700' })}
`;

const FORM_NAMES = Object.freeze({
  // NOTE[CS] 기본 정보
  CONTENTS_NAME: 'contentsInfo.contentsDetailList[0].contentsName',
  CP_NAME: 'cpName',
  MAIN_CATEGORY: 'contentsInfo.mainCategoryType',
  SUB_CATEGORY: 'contentsInfo.subCategoryType',
  CONTENTS_STORAGE_LOCATION: 'contentsInfo.contentsStorageLocation',
  CONTENTS_STORAGE_LOCATION_IP: 'contentsStorageLocationIp', // NOTE: 임시 명칭으로 API 명세서 상 IP를 받는 부분은 없음

  // NOTE[CS] 루틴/추천 운동 정보
  MUSCLE: 'routineDetailList[0].muscle',
  EXERCISE_EFFECT: 'routineDetailList[0].exerciseEffect',
  ACTION_DESCRIPTION: 'routineDetailList[0].actionDescription',

  CATEGORY_TYPE: 'routineInfo.categoryType',
  CATEGORY_TYPE_ETC: 'routineInfo.categoryTypeEtc', // NOTE: 임시 명칭으로 API 명세서 상 IP를 받는 부분은 없음
  STF_TYPE: 'routineInfo.sftType',
  ALIGNMENT_TYPE: 'routineInfo.alignmentType',
  ROM_TYPE: 'routineInfo.romType',
  RECOMMEND_AGE_TYPE: 'routineInfo.recommendAgeType',
  LEVEL_TYPE: 'routineInfo.levelType',
  EXERCISE_INTENSITY_TYPE: 'routineInfo.exerciseIntensityType',
  EQUIPMENT_TYPE: 'routineInfo.equipmentType',
  EQUIPMENT_TYPE_ETC: 'routineInfo.equipmentTypeEtc', // NOTE: 임시 명칭으로 API 명세서 상 IP를 받는 부분은 없음
  POSITION_TYPE: 'routineInfo.positionType',
  POSITION_TYPE_ETC: 'routineInfo.positionTypeEtc', // NOTE: 임시 명칭으로 API 명세서 상 IP를 받는 부분은 없음
  BODY_PART_TYPE: 'routineInfo.bodyPartType',
  BODY_PART_TYPE_ETC: 'routineInfo.bodyPartTypeEtc', // NOTE: 임시 명칭으로 API 명세서 상 IP를 받는 부분은 없음
  EXCEPTION_BODYPART_TYPE: 'routineInfo.exceptionBodyPartType',
  EXCEPTION_BODYPART_TYPE_ETC: 'routineInfo.exceptionBodyPartTypeEtc', // NOTE: 임시 명칭으로 API 명세서 상 IP를 받는 부분은 없음
  EXCEPTION_DISEASE_TYPE: 'routineInfo.exceptionDiseaseType',
  EXCEPTION_DISEASE_TYPE_ETC: 'routineInfo.exceptionDiseaseTypeEtc', // NOTE: 임시 명칭으로 API 명세서 상 IP를 받는 부분은 없음
  EXERCISE_PURPOSE_TYPE: 'routineInfo.exercisePurposeType',
  EXERCISE_PURPOSE_TYPE_ETC: 'routineInfo.exercisePurposeTypeEtc', // NOTE: 임시 명칭으로 API 명세서 상 IP를 받는 부분은 없음
  CONTENTS_IMAGE_FILE: 'routineInfo.contentsImageFile',
  CONTENTS_ROUTINE_FILE: 'routineInfo.contentsRoutineFile',

  // NOTE[CS] 아웃도어 정보
  TRACK_TYPE: 'walkingJoggingInfo.trackType',
  HEIGHT: 'walkingJoggingInfo.height',
  TRACK_CAL: 'walkingJoggingInfo.trackCal',
  TRACK_DISTANCE: 'walkingJoggingInfo.trackDistance',
  STEPS: 'walkingJoggingInfo.steps',
  RECOMMEND_SPEED: 'walkingJoggingInfo.recommendSpeed',
  CONTENTS_PLAY_SPEED: 'walkingJoggingInfo.contentsPlaySpeed',
  THEME_ADMIN_TYPE: 'walkingJoggingInfo.themeType',
  ASSOCIATED_COUNTRY: 'walkingJoggingInfo.associatedCountry',
  WALKING_JOGGING_FILE: 'walkingJoggingInfo.walkingJoggingFile',
  WALKING_JOGGING_THUMBNAIL: 'walkingJoggingInfo.walkingJoggingThumbnail',
  BGM_FILE: 'walkingJoggingInfo.bgmFile',
  WALKING_JOGGING_DESCRIPTION: 'walkingJoggingDetailList.walkingJoggingDescription',
  WALKING_JOGGING_COURSE_INFO_LIST: 'walkingJoggingCourseInfoList',
  COURSE_MEDIAFILE: 'walkingJoggingCourseInfoList.INDEX.courseMediaFile',
});

const MODAL_KEY_SUBMIT = 'modal-contents-form-submit';
const MODAL_KEY_CANCLE = 'modal-contents-form-cancle';

const ContentsFormCP = () => {
  const useFormInstance = useForm();
  const navigate = useNavigate();
  const { showModal, closeModal } = useModal();
  const { handleSubmit, control, setValue, unregister, reset } = useFormInstance;
  const previousVisibility: MutableRefObject<Record<string, string>> = useRef({});
  const { routineData, enumList, cpData, handleSubmitRoutine } = useContentsRoutine();
  const {
    categoryTypeEnumList,
    sftAdminTypeEnumList,
    bodyAlignmentTypeEnumList,
    romTypeEnumList,
    recommendAgeTypeEnumList,
    levelTypeEnumList,
    exerciseIntensityTypeEnumList,
    equipmentTypeEnumList,
    positionTypeEnumList,
    bodyPartTypeEnumList,
    exceptionBodyPartTypeEnumList,
    exceptionDiseaseTypeEnumList,
    exercisePurposeTypeEnumList,
    contentStorageLocationEnumList,
    filteredSubCategoryEnumList,
  } = enumList;

  const { cpName, mainCategoryValue } = cpData;

  const [
    contentStorageLocationWatch,
    categoryTypeWatch,
    equipmentTypeWatch,
    positionTypeWatch,
    bodyPartTypeWatch,
    exceptionBodyPartTypeWatch,
    exceptionDiseaseTypeWatch,
    exercisePurposeTypeWatch,
  ] = useWatch({
    control,
    name: [
      FORM_NAMES.CONTENTS_STORAGE_LOCATION,
      FORM_NAMES.CATEGORY_TYPE,
      FORM_NAMES.EQUIPMENT_TYPE,
      FORM_NAMES.POSITION_TYPE,
      FORM_NAMES.BODY_PART_TYPE,
      FORM_NAMES.EXCEPTION_BODYPART_TYPE,
      FORM_NAMES.EXCEPTION_DISEASE_TYPE,
      FORM_NAMES.EXERCISE_PURPOSE_TYPE,
    ],
  });

  const handleSelectRomTypeGroupAll = useCallback(
    (event: ChangeEvent<HTMLInputElement>, index: number) => {
      const romTypeGroups = {
        0: ['RT001', 'RT002', 'RT003', 'RT004', 'RT005'],
        6: ['RT007', 'RT008', 'RT009'],
        10: ['RT011', 'RT012', 'RT013'],
        14: ['RT015'],
        16: ['RT017', 'RT018'],
      };
      const isChecked = event.target.checked;
      const group = romTypeGroups[index as keyof typeof romTypeGroups];

      if (group) {
        if (isChecked) {
          group.forEach((item, itemIndex) => {
            setValue(`${FORM_NAMES.ROM_TYPE}.${index + itemIndex + 1}`, item);
          });
        } else {
          group.forEach((_, itemIndex) => {
            setValue(`${FORM_NAMES.ROM_TYPE}.${index + itemIndex + 1}`, false);
          });
        }
      }
    },
    [setValue]
  );

  const visibilityConditions = useMemo(
    () => ({
      [FORM_NAMES.CONTENTS_STORAGE_LOCATION_IP]: contentStorageLocationWatch === 'CSL001',
      [FORM_NAMES.CATEGORY_TYPE_ETC]: categoryTypeWatch === 'CRCT003',
      [FORM_NAMES.EQUIPMENT_TYPE_ETC]: equipmentTypeWatch && equipmentTypeWatch[equipmentTypeWatch.length - 1],
      [FORM_NAMES.POSITION_TYPE_ETC]: positionTypeWatch && positionTypeWatch[positionTypeWatch.length - 1],
      [FORM_NAMES.BODY_PART_TYPE_ETC]: bodyPartTypeWatch && bodyPartTypeWatch[bodyPartTypeWatch.length - 1],
      [FORM_NAMES.EXCEPTION_BODYPART_TYPE_ETC]:
        exceptionBodyPartTypeWatch && exceptionBodyPartTypeWatch[exceptionBodyPartTypeWatch.length - 1],
      [FORM_NAMES.EXCEPTION_DISEASE_TYPE_ETC]:
        exceptionDiseaseTypeWatch && exceptionDiseaseTypeWatch[exceptionDiseaseTypeWatch.length - 1],
      [FORM_NAMES.EXERCISE_PURPOSE_TYPE_ETC]:
        exercisePurposeTypeWatch && exercisePurposeTypeWatch[exercisePurposeTypeWatch.length - 1],
    }),
    [
      contentStorageLocationWatch,
      categoryTypeWatch,
      equipmentTypeWatch,
      positionTypeWatch,
      bodyPartTypeWatch,
      exceptionBodyPartTypeWatch,
      exceptionDiseaseTypeWatch,
      exercisePurposeTypeWatch,
    ]
  );

  const handleInputVisibility = useCallback(() => {
    Object.entries(visibilityConditions).forEach(([field, isVisible]) => {
      if (!isVisible && previousVisibility.current[field] !== isVisible) {
        unregister(field);
      }
      previousVisibility.current[field] = isVisible;
    });
  }, [visibilityConditions, unregister]);

  const handleSubmitModal = useCallback(() => {
    showModal(
      <Modal
        key={MODAL_KEY_SUBMIT}
        handleClose={() => closeModal(MODAL_KEY_SUBMIT)}
        children={<Text>저장하시겠습니까?</Text>}
        footerChildren={
          <ButtonSection>
            <ExtendedButton onClick={() => closeModal(MODAL_KEY_SUBMIT)}>취소</ExtendedButton>
            <ExtendedPrimaryButton onClick={handleSubmit(handleSubmitRoutine)}>저장</ExtendedPrimaryButton>
          </ButtonSection>
        }
      ></Modal>
    );
  }, [closeModal, handleSubmit, handleSubmitRoutine, showModal]);

  const handleCancleModal = useCallback(() => {
    showModal(
      <Modal
        key={MODAL_KEY_CANCLE}
        handleClose={() => closeModal(MODAL_KEY_CANCLE)}
        children={<Text>목록으로 돌아가시겠습니까?</Text>}
        footerChildren={
          <ButtonSection>
            <ExtendedButton onClick={() => closeModal(MODAL_KEY_CANCLE)}>취소</ExtendedButton>
            <ExtendedPrimaryButton
              onClick={() => {
                navigate(-1);
                closeModal(MODAL_KEY_CANCLE);
              }}
            >
              확인
            </ExtendedPrimaryButton>
          </ButtonSection>
        }
      ></Modal>
    );
  }, [closeModal, showModal, navigate]);

  useEffect(() => {
    handleInputVisibility();
  }, [handleInputVisibility]);

  useEffect(() => {
    if (routineData) {
      reset({
        contentsInfo: routineData.contentsInfo,
        routineInfo: routineData.routineInfo,
        routineDetailList: routineData.routineDetailList,
      });
    }
  }, [routineData, reset]);

  return (
    <FormProvider {...useFormInstance}>
      <FTAPageTitle title={'컨텐츠 관리'} />
      {/*------------------------------------------------ 기본정보 섹션 ------------------------------------------------*/}
      <DefaultSectionTitleWraper>
        <SectionTitle>기본정보</SectionTitle>
      </DefaultSectionTitleWraper>
      <GridBox>
        <ItemTitle $isRequired={true}>컨텐츠명</ItemTitle>
        <FTAInput
          type='text'
          name={FORM_NAMES.CONTENTS_NAME}
          placeholder='컨텐츠명을 입력해주세요.'
          maxLength={100}
          debounce={{ enabled: true, delay: 100 }}
        />
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true}>CP명</ItemTitle>
        <FTAInput name={FORM_NAMES.CP_NAME} value={cpName} readOnly />
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true}>컨텐츠 분류 1</ItemTitle>
        <FTAInput name={FORM_NAMES.MAIN_CATEGORY} value={mainCategoryValue} readOnly />
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true}>컨텐츠 분류 2</ItemTitle>
        <RadioBox>
          {filteredSubCategoryEnumList.map((filteredSubCategory) => (
            <FTARadio key={filteredSubCategory.code} name={FORM_NAMES.SUB_CATEGORY} value={filteredSubCategory.code}>
              {filteredSubCategory.value}
            </FTARadio>
          ))}
        </RadioBox>
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true}>컨텐츠 저장 위치</ItemTitle>
        <RadioBoxHorizen>
          {contentStorageLocationEnumList.map((contentStorageLocation) => (
            <FTARadio
              key={contentStorageLocation.code}
              name={FORM_NAMES.CONTENTS_STORAGE_LOCATION}
              value={contentStorageLocation.code}
            >
              {contentStorageLocation.value}
            </FTARadio>
          ))}
          {visibilityConditions[FORM_NAMES.CONTENTS_STORAGE_LOCATION_IP] && (
            <FTAInput name={FORM_NAMES.CONTENTS_STORAGE_LOCATION_IP} placeholder='IP 주소를 입력하세요.' />
          )}
        </RadioBoxHorizen>
      </GridBox>

      {/*--------------------------------------------- 루틴 컨텐츠 정보 섹션 ---------------------------------------------*/}

      <DefaultSectionTitleWraper>
        <SectionTitle>루틴/추천 운동 정보</SectionTitle>
      </DefaultSectionTitleWraper>
      <GridBox>
        <ItemTitle $isRequired={true} $rowSpan={visibilityConditions[FORM_NAMES.CATEGORY_TYPE_ETC] ? 2 : 1}>
          카테고리
        </ItemTitle>
        <RadioBox>
          {categoryTypeEnumList.map((categoryTypeEnum) => (
            <FTARadio key={categoryTypeEnum.code} name={FORM_NAMES.CATEGORY_TYPE} value={categoryTypeEnum.code}>
              {categoryTypeEnum.value}
            </FTARadio>
          ))}
        </RadioBox>
        {visibilityConditions[FORM_NAMES.CATEGORY_TYPE_ETC] && (
          <FTAInput
            type='text'
            name={FORM_NAMES.CATEGORY_TYPE_ETC}
            placeholder='기타를 입력해주세요.'
            maxLength={20}
            debounce={{ enabled: true, delay: 100 }}
          />
        )}
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true} $rowSpan={2}>
          신체능력평가 종류
        </ItemTitle>
        <InfoText>고객의 신체능력 평가 결과가 관리나 등급일 경우, 해당 운동이 더 많이 추천될 수 있습니다.</InfoText>
        <CheckboxWraper>
          {sftAdminTypeEnumList.map((sftAdminTypeEnum, index) => (
            <FTACheckbox
              key={sftAdminTypeEnum.code}
              name={`${FORM_NAMES.STF_TYPE}.${index}`}
              value={sftAdminTypeEnum.code}
            >
              {/* EnumList에는 SftAdminType로 들어옴 */}
              {sftAdminTypeEnum.value}
            </FTACheckbox>
          ))}
        </CheckboxWraper>
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true} $rowSpan={2}>
          체형분석 종류
        </ItemTitle>
        <InfoText>고객의 신체능력 평가 결과가 관리나 등급일 경우, 해당 운동이 더 많이 추천될 수 있습니다.</InfoText>
        <CheckboxWraper>
          {bodyAlignmentTypeEnumList.map((bodyAlignmentTypeEnum, index) => (
            <FTACheckbox
              key={bodyAlignmentTypeEnum.code}
              name={`${FORM_NAMES.ALIGNMENT_TYPE}.${index}`}
              value={bodyAlignmentTypeEnum.code}
            >
              {bodyAlignmentTypeEnum.value}
            </FTACheckbox>
          ))}
        </CheckboxWraper>
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true} $rowSpan={5}>
          관절가동범위
        </ItemTitle>
        <RomTypeContainer>
          {romTypeEnumList.map((romTypeEnum, index) => (
            <RomTypeChecboxContainer key={romTypeEnum.code} $romTypeIndex={index}>
              <FTACheckbox
                onChange={
                  ROM_TYPE_ALL_INDEXES.includes(index)
                    ? (event: ChangeEvent<HTMLInputElement>) => handleSelectRomTypeGroupAll(event, index)
                    : undefined
                }
                name={`${FORM_NAMES.ROM_TYPE}.${index}`}
                value={romTypeEnum.code}
              >
                {romTypeEnum.value}
              </FTACheckbox>
            </RomTypeChecboxContainer>
          ))}
        </RomTypeContainer>
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true}>권장 연령대</ItemTitle>
        <RadioBox>
          {recommendAgeTypeEnumList.map((recommendAgeTypeEnum) => (
            <FTARadio
              key={recommendAgeTypeEnum.code}
              name={FORM_NAMES.RECOMMEND_AGE_TYPE}
              value={recommendAgeTypeEnum.code}
            >
              {recommendAgeTypeEnum.value}
            </FTARadio>
          ))}
        </RadioBox>
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true}>난이도</ItemTitle>
        <RadioBox>
          {levelTypeEnumList.map((levelTypeEnum) => (
            <FTARadio key={levelTypeEnum.code} name={FORM_NAMES.LEVEL_TYPE} value={levelTypeEnum.code}>
              {levelTypeEnum.value}
            </FTARadio>
          ))}
        </RadioBox>
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true}>운동강도</ItemTitle>
        <RadioBox>
          {exerciseIntensityTypeEnumList.map((exerciseIntensityTypeEnum) => (
            <FTARadio
              key={exerciseIntensityTypeEnum.code}
              name={FORM_NAMES.EXERCISE_INTENSITY_TYPE}
              value={exerciseIntensityTypeEnum.code}
            >
              {exerciseIntensityTypeEnum.value}
            </FTARadio>
          ))}
        </RadioBox>
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true} $rowSpan={visibilityConditions[FORM_NAMES.EQUIPMENT_TYPE_ETC] ? 2 : 1}>
          사용기구
        </ItemTitle>
        <CheckboxWraper>
          {equipmentTypeEnumList.map((equipmentTypeEnum, index) => (
            <FTACheckbox
              key={equipmentTypeEnum.code}
              name={`${FORM_NAMES.EQUIPMENT_TYPE}.${index}`}
              value={equipmentTypeEnum.code}
            >
              {equipmentTypeEnum.value}
            </FTACheckbox>
          ))}
        </CheckboxWraper>
        {visibilityConditions[FORM_NAMES.EQUIPMENT_TYPE_ETC] && (
          <FTAInput name={FORM_NAMES.EQUIPMENT_TYPE_ETC} maxLength={20} placeholder='기타를 입력해주세요.' />
        )}
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true} $rowSpan={visibilityConditions[FORM_NAMES.POSITION_TYPE_ETC] ? 2 : 1}>
          포지션
        </ItemTitle>
        <CheckboxWraper>
          {positionTypeEnumList.map((positionTypeEnum, index) => (
            <FTACheckbox
              key={positionTypeEnum.code}
              name={`${FORM_NAMES.POSITION_TYPE}.${index}`}
              value={positionTypeEnum.code}
            >
              {positionTypeEnum.value}
            </FTACheckbox>
          ))}
        </CheckboxWraper>
        {visibilityConditions[FORM_NAMES.POSITION_TYPE_ETC] && (
          <FTAInput name={FORM_NAMES.POSITION_TYPE_ETC} maxLength={20} placeholder='기타를 입력해주세요.' />
        )}
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true} $rowSpan={visibilityConditions[FORM_NAMES.BODY_PART_TYPE_ETC] ? 2 : 1}>
          신체부위
        </ItemTitle>
        <CheckboxWraper>
          {bodyPartTypeEnumList.map((bodyPartTypeEnum, index) => (
            <FTACheckbox
              key={bodyPartTypeEnum.code}
              name={`${FORM_NAMES.BODY_PART_TYPE}.${index}`}
              value={bodyPartTypeEnum.code}
            >
              {bodyPartTypeEnum.value}
            </FTACheckbox>
          ))}
        </CheckboxWraper>
        {visibilityConditions[FORM_NAMES.BODY_PART_TYPE_ETC] && (
          <FTAInput name={FORM_NAMES.BODY_PART_TYPE_ETC} maxLength={20} placeholder='기타를 입력해주세요.' />
        )}
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true}>근육명</ItemTitle>
        <FTAInput
          type='text'
          name={FORM_NAMES.MUSCLE}
          placeholder='근육명을 입력해주세요.'
          maxLength={20}
          debounce={{ enabled: true, delay: 100 }}
        />
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true} $rowSpan={visibilityConditions[FORM_NAMES.EXCEPTION_BODYPART_TYPE_ETC] ? 3 : 2}>
          예외 대상 1(신체부위)
        </ItemTitle>
        <InfoText>해당 운동을 유의해야하는 고객군을 문제 신체부위 기준으로 선택해주세요.</InfoText>
        <CheckboxWraper>
          {exceptionBodyPartTypeEnumList.map((exceptionBodyPartTypeEnum, index) => (
            <FTACheckbox
              key={exceptionBodyPartTypeEnum.code}
              name={`${FORM_NAMES.EXCEPTION_BODYPART_TYPE}.${index}`}
              value={exceptionBodyPartTypeEnum.code}
            >
              {exceptionBodyPartTypeEnum.value}
            </FTACheckbox>
          ))}
        </CheckboxWraper>
        {visibilityConditions[FORM_NAMES.EXCEPTION_BODYPART_TYPE_ETC] && (
          <FTAInput name={FORM_NAMES.EXCEPTION_BODYPART_TYPE_ETC} maxLength={20} placeholder='기타를 입력해주세요.' />
        )}
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true} $rowSpan={visibilityConditions[FORM_NAMES.EXCEPTION_DISEASE_TYPE_ETC] ? 3 : 2}>
          예외 대상 2(질환명)
        </ItemTitle>
        <InfoText>해당 운동을 유의해야하는 고객군을 문제 신체부위 기준으로 선택해주세요.</InfoText>
        <CheckboxWraper>
          {exceptionDiseaseTypeEnumList.map((exceptionDiseaseTypeEnum, index) => (
            <FTACheckbox
              key={exceptionDiseaseTypeEnum.code}
              name={`${FORM_NAMES.EXCEPTION_DISEASE_TYPE}.${index}`}
              value={exceptionDiseaseTypeEnum.code}
            >
              {exceptionDiseaseTypeEnum.value}
            </FTACheckbox>
          ))}
        </CheckboxWraper>
        {visibilityConditions[FORM_NAMES.EXCEPTION_DISEASE_TYPE_ETC] && (
          <FTAInput name={FORM_NAMES.EXCEPTION_DISEASE_TYPE_ETC} maxLength={20} placeholder='기타를 입력해주세요.' />
        )}
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true}>운동효과</ItemTitle>
        <FTAInput
          type='text'
          name={FORM_NAMES.EXERCISE_EFFECT}
          placeholder='운동 효과를 입력해주세요.'
          maxLength={100}
          debounce={{ enabled: true, delay: 100 }}
        />
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true}>동작 설명</ItemTitle>
        <FTAInput
          type='text'
          name={FORM_NAMES.ACTION_DESCRIPTION}
          placeholder='동작 설명을 입력해주세요.'
          maxLength={1000}
          debounce={{ enabled: true, delay: 100 }}
        />
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true} $rowSpan={visibilityConditions[FORM_NAMES.EXERCISE_PURPOSE_TYPE_ETC] ? 2 : 1}>
          운동 목적
        </ItemTitle>
        <CheckboxWraper>
          {exercisePurposeTypeEnumList.map((exercisePurposeTypeEnum, index) => (
            <FTACheckbox
              key={exercisePurposeTypeEnum.code}
              name={`${FORM_NAMES.EXERCISE_PURPOSE_TYPE}.${index}`}
              value={exercisePurposeTypeEnum.code}
            >
              {exercisePurposeTypeEnum.value}
            </FTACheckbox>
          ))}
        </CheckboxWraper>
        {visibilityConditions[FORM_NAMES.EXERCISE_PURPOSE_TYPE_ETC] && (
          <FTAInput name={FORM_NAMES.EXERCISE_PURPOSE_TYPE_ETC} maxLength={20} placeholder='기타를 입력해주세요.' />
        )}
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true}>영상 썸네일 이미지</ItemTitle>
        <FTAImageUpload
          name={FORM_NAMES.CONTENTS_IMAGE_FILE}
          imageUrl={routineData?.routineInfo?.contentsImageFile?.fileUrl}
          required={true}
        />
      </GridBox>
      <GridBox>
        <ItemTitle $isRequired={true}>영상 파일</ItemTitle>
        <FTAVideoUpload
          name={FORM_NAMES.CONTENTS_ROUTINE_FILE}
          videoFileName={routineData?.routineInfo?.contentsRoutineFile?.originalFileName}
          required={true}
        />
      </GridBox>
      <ButtonSection>
        <ExtendedPrimaryButton onClick={handleSubmitModal}>등록</ExtendedPrimaryButton>
        <ExtendedButton onClick={handleCancleModal}>취소</ExtendedButton>
      </ButtonSection>
    </FormProvider>
  );
};

export default ContentsFormCP;
