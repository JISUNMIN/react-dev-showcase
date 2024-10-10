import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface CodeValue {
  code: string;
  value: string;
}

export interface EnumObject {
  SftUpAndGoTestExercise: CodeValue[];
  BodyPartType: CodeValue[];
  LevelType: CodeValue[];
  FrontBackType: CodeValue[];
  SftType: CodeValue[];
  RoutineApprovalStatusType: CodeValue[];
  BASummaryImageType: CodeValue[];
  ItemCategory: CodeValue[];
  MarathonRoomType: CodeValue[];
  ExerciseDivisionType: CodeValue[];
  ProgramType: CodeValue[];
  AgeGroupType: CodeValue[];
  ExerciseIntensityType: CodeValue[];
  LogicTypeForRom: CodeValue[];
  SftSearchType: CodeValue[];
  LevelColorType: CodeValue[];
  RecommendationType: CodeValue[];
  ContentsPlaySpeedType: CodeValue[];
  Card5FeedbackType: CodeValue[];
  BodyAlignmentSearchType: CodeValue[];
  BodyAlignmentType: CodeValue[];
  AIFitManagerFeedbackType: CodeValue[];
  CsStatusType: CodeValue[];
  SideTypeForRom: CodeValue[];
  DirectionType: CodeValue[];
  FrontBackTypeForBA: CodeValue[];
  SectionType: CodeValue[];
  HomeCareGateProgressType: CodeValue[];
  UserType: CodeValue[];
  HealthCareSubType: CodeValue[];
  SubCategoryType: CodeValue[];
  RepeatCycleType: CodeValue[];
  ExceptionBodyPartType: CodeValue[];
  CategoryType: CodeValue[];
  ContentsStorageLocationType: CodeValue[];
  RomType: CodeValue[];
  SearchDateType: CodeValue[];
  AccessibleMenuType: CodeValue[];
  SftLowerBodyFlexExercise: CodeValue[];
  OutdoorApprovalStatusType: CodeValue[];
  AdminApproveStatusType: CodeValue[];
  SftAerobicExercise: CodeValue[];
  AIFitManagerLogicType: CodeValue[];
  LevelTypeForAlignment: CodeValue[];
  SftStaticBalanceExercise: CodeValue[];
  AccessScopeType: CodeValue[];
  ExerciseFeedback: CodeValue[];
  ClassLevelType: CodeValue[];
  NoteCategoryType: CodeValue[];
  SftLowerBodyStrExercise: CodeValue[];
  SftAdminType: CodeValue[];
  BodyPartForRoutineType: CodeValue[];
  SideType: CodeValue[];
  FeedbackPartTypeForRom: CodeValue[];
  SftUpperBodyFlexExercise: CodeValue[];
  BodyCheckupLevelType: CodeValue[];
  ExerciseHistoryType: CodeValue[];
  AdminUseStatusType: CodeValue[];
  MainCategoryType: CodeValue[];
  ExerciseType: CodeValue[];
  ScoreValue: CodeValue[];
  HealthCareMainType: CodeValue[];
  ThemeAdminType: CodeValue[];
  RecommendAgeType: CodeValue[];
  CountryType: CodeValue[];
  ExercisePurposeType: CodeValue[];
  ExercisePurposePOC: CodeValue[];
  ConvertResultsTypeForSFT: CodeValue[];
  PartTypeForBA: CodeValue[];
  LogicType: CodeValue[];
  BodyAlignmentScoreType: CodeValue[];
  AIFitManagerFeedbackPartType: CodeValue[];
  ActivityWalkingType: CodeValue[];
  ExceptionDiseaseType: CodeValue[];
  LanguageType: CodeValue[];
  FeedbackPartShortType: CodeValue[];
  PartTypeForRom: CodeValue[];
  SftUpperBodyStrExercise: CodeValue[];
  ConvertResultsTypeForBA: CodeValue[];
  ApprovalStatusType: CodeValue[];
  ExerciseTypeA: CodeValue[];
  BodyCheckUpDivisionType: CodeValue[];
  CoachingType: CodeValue[];
  FeedbackPartType: CodeValue[];
  PositionType: CodeValue[];
  StatusType: CodeValue[];
  TrackType: CodeValue[];
  ThemeType: CodeValue[];
  CoachmarkType: CodeValue[];
  ExerciseFiTManagerType: CodeValue[];
  ContentsType: CodeValue[];
  EquipmentType: CodeValue[];
}

const enumStore = create<{
  totalEnums: EnumObject | null;
  flatEnums: CodeValue[] | null;
  setEnum: (totalEnums: EnumObject) => void;
  convertEnum: (targetEnum: string | string[]) => string;
  getEnumByKey: (key: keyof EnumObject) => CodeValue[] | undefined;
  getEnumListByKeyList: (keyList: Array<keyof EnumObject>) => Array<CodeValue[]>;
}>()(
  devtools(
    persist(
      (set, get) => ({
        totalEnums: null,
        flatEnums: null,
        setEnum: (totalEnums: EnumObject) =>
          set({ totalEnums: totalEnums, flatEnums: Object.values(totalEnums).flat() as CodeValue[] }),
        convertEnum: (targetEnum) => {
          if (!targetEnum) return '';
          const { flatEnums } = get();
          if (Array.isArray(targetEnum)) {
            return targetEnum
              .map((enumValue) => {
                const target = flatEnums?.find(({ code }) => code === enumValue);
                return target ? target.value : enumValue;
              })
              .join(', ');
          } else {
            const target = flatEnums?.find(({ code }) => code === targetEnum);
            return target ? target.value : targetEnum;
          }
        },
        getEnumByKey: (key) => {
          const { totalEnums } = get();
          return totalEnums?.[key];
        },
        getEnumListByKeyList: (keyList) => {
          const { totalEnums } = get();
          if (!totalEnums) return [];
          return keyList.map((key) => totalEnums[key] || []);
        },
      }),
      {
        name: 'enum',
      }
    )
  )
);

export { enumStore };
