/** 컨텐츠 관리 > CP 컨텐츠 관리 등록*/
import { useCallback, useMemo, useRef } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Div, Img, Modal, Span, Text } from '@src/components';
import { FTAPlayButton } from '@src/components/service/atoms';
import { FTAPageTitle, FTAShakaPlayer } from '@src/components/service/organisms';
import { useModal } from '@src/hooks';
import useContentsCP from '@src/hooks/rest/contents/useContentsCP';
import ApprovalButton from '@src/pages/modules/detailButtons/ApprovalButton';
import DeleteButton from '@src/pages/modules/detailButtons/DeleteButton';
import GoToEditButton from '@src/pages/modules/detailButtons/GoToEditButton';
import GoToListButton from '@src/pages/modules/detailButtons/GoToListButton';
import RefusalButton from '@src/pages/modules/detailButtons/RefusalButton';
import ReqApprovalButton from '@src/pages/modules/detailButtons/ReqApprovalButton';
import { flex, font, grid, size } from '@src/styles/variables';
import { enumStore } from '@src/zustand';

const Container = styled(Div)``;

const DefaultSectionTitleWraper = styled(Div)`
  ${flex({ align: 'start', direction: 'column' })}
  margin-top: 40px;

  &:after {
    content: '';
    ${size({ w: '100%', h: '2px' })}
    background-color: ${({ theme }) => theme.colors.gray07};
  }
`;
const SectionTitle = styled(Text)`
  ${font({ size: '22px', weight: '700' })}
  color: ${({ theme }) => theme.colors.gray10};
  padding: 20px 0;
`;
const ItemTitle = styled(Span)<{ $isRequired?: boolean; $colSpan?: number; $rowSpan?: number }>`
  ${font({ weight: '700' })};
  word-wrap: break-word;
  ${({ $colSpan }) => {
    if ($colSpan && $colSpan > 0) {
      return `grid-column: 1 / span ${$colSpan};`;
    }
  }}
  ${({ $rowSpan }) => {
    if ($rowSpan && $rowSpan > 0) {
      return `grid-row: 1 / span ${$rowSpan};`;
    }
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
const ItemDescription = styled(Text)`
  ${font({ size: '16px', weight: '600' })}
  color: ${({ theme }) => theme.colors.gray08};
`;

const GridBox = styled(Div)<{ $firstBox?: boolean }>`
  ${grid({ columns: 'minmax(160px, 1fr) 15fr', rows: 'auto', align: 'center' })}
  column-gap: 20px;
  row-gap: 16px;
  padding: 24px 0;
  min-height: 100px;
  ${({ $firstBox, theme }) => !$firstBox && `border-top: 1px solid ${theme.colors.gray03}`}
`;

const ImgPreview = styled(Img)`
  ${size({ w: '120px', h: '120px' })}
  border-radius: 8px;
`;
const VideoPreview = styled(Div)`
  ${font({ size: '16px', weight: '600' })}
  color: ${({ theme }) => theme.colors.gray08};
`;

const FlexRow = styled(Div)`
  ${flex({ justify: 'start', gap: '12px' })};
`;
const FlexBox = styled(Div)`
  ${flex({ justify: 'start', gap: '14px', direction: 'column', align: 'start' })};
  ${font({ size: '16px', weight: '600' })}
  color: ${({ theme }) => theme.colors.gray08};
`;

const RomTypeContainer = styled(Div)`
  ${grid({ columns: '50px repeat(5, auto)', rows: 'auto', align: 'center', gap: '16px 24px' })}
  max-width: 800px;
`;

const RomTypeItem = styled(Div)<{ $firstItem?: boolean }>`
  ${flex({ justify: 'start', align: 'center' })}
  ${({ $firstItem, theme }) => $firstItem && `border-right: 1px solid ${theme.colors.gray05}`}
`;

const ButtonSection = styled(Div)`
  ${flex({ justify: 'center', gap: '10px' })}
`;

interface RomtypeObject {
  [key: string]: string[];
  RT000: string[];
  RT006: string[];
  RT010: string[];
  RT014: string[];
  RT016: string[];
}

const ContentsCPDetail = () => {
  const { id } = useParams();
  const { convertEnum } = enumStore();
  const navigate = useNavigate();
  const { showModal, closeModal } = useModal();
  const { routineData, cpData, handleApprovalReq, handleApprovalConfirm, handleApprovalReject, handleDeleteCPContent } =
    useContentsCP();
  const { cpName, mainCategoryValue } = cpData;

  const handleNavigate = useCallback(
    (path: string | number) => {
      if (typeof path === 'string') {
        navigate(path);
      } else if (typeof path === 'number') {
        navigate(path);
      }
    },
    [navigate]
  );

  const description = useCallback(
    (data: string | Array<string | boolean> | undefined) => {
      return typeof data === 'string'
        ? convertEnum(data ?? '')
        : data?.map((item, index) => {
            const isLastIndex = data.length - 1 === index;
            const stringItem = item as string;

            return (
              <Span key={stringItem}>
                {convertEnum(stringItem)}
                {isLastIndex ? null : `, `}
              </Span>
            );
          });
    },
    [convertEnum]
  );

  const reOrderedRomTypes = useMemo(() => {
    const getIncludedCodes = (inputCodes: Array<string>) => {
      const result = [];
      const resultObj: RomtypeObject = {
        RT000: [],
        RT006: [],
        RT010: [],
        RT014: [],
        RT016: [],
      };
      // RT000 포함 조건
      if (inputCodes.some((code) => ['RT001', 'RT002', 'RT003', 'RT004', 'RT005'].includes(code))) {
        result.push('RT000');
        const items = inputCodes.filter((code) => ['RT001', 'RT002', 'RT003', 'RT004', 'RT005'].includes(code));
        resultObj.RT000.push(...items);
      }

      // RT006 포함 조건
      if (inputCodes.some((code) => ['RT007', 'RT008', 'RT009'].includes(code))) {
        result.push('RT006');
        const items = inputCodes.filter((code) => ['RT007', 'RT008', 'RT009'].includes(code));
        resultObj.RT006.push(...items);
      }

      // RT010 포함 조건
      if (inputCodes.some((code) => ['RT011', 'RT012', 'RT013'].includes(code))) {
        result.push('RT010');
        const items = inputCodes.filter((code) => ['RT011', 'RT012', 'RT013'].includes(code));
        resultObj.RT010.push(...items);
      }

      // RT014 포함 조건
      if (inputCodes.includes('RT015')) {
        result.push('RT014');
        const items = inputCodes.filter((code) => ['RT015'].includes(code));
        resultObj.RT014.push(...items);
      }

      // RT016 포함 조건
      if (inputCodes.some((code) => ['RT017', 'RT018'].includes(code))) {
        result.push('RT016');
        const items = inputCodes.filter((code) => ['RT017', 'RT018'].includes(code));
        resultObj.RT016.push(...items);
      }
      const array = inputCodes.concat(result);

      const uniqueSortedArray = Array.from(new Set(array)).sort((a: string, b: string) => a.localeCompare(b));
      return { list: uniqueSortedArray, object: resultObj };
    };
    const categoryKeys = ['RT000', 'RT006', 'RT010', 'RT014', 'RT016'];
    const { list, object } = getIncludedCodes((routineData?.routineInfo?.romType as Array<string>) ?? []);
    const categoryList = list.filter((item) => categoryKeys.includes(item));

    return { categoryList, object };
  }, [routineData]);

  /*------------------------------------------------ ShakaPlayer Start ------------------------------------------------*/
  const playerRef = useRef(null);
  const handleModal = useCallback(
    (src: string) => {
      const onVideoProgress = () => {
        // do nothing
      };
      const onVideoEnd = () => {
        console.log('ShakaPlayerTest onVideoEnd');
      };
      const MODAL_KEY = 'video-modal-contents-cp';
      showModal(
        <Modal key={MODAL_KEY} handleClose={() => closeModal(MODAL_KEY)}>
          <FTAShakaPlayer playerRef={playerRef} src={src} onProgress={onVideoProgress} onEnded={onVideoEnd} />
        </Modal>
      );
    },
    [showModal, closeModal]
  );
  /*------------------------------------------------ ShakaPlayer End ------------------------------------------------*/

  return (
    <Container>
      <FTAPageTitle title={'컨텐츠 관리'} />
      {/*------------------------------------------------ 기본정보 섹션 ------------------------------------------------*/}
      <DefaultSectionTitleWraper>
        <SectionTitle>기본정보</SectionTitle>
      </DefaultSectionTitleWraper>
      <GridBox $firstBox>
        <ItemTitle>컨텐츠명</ItemTitle>
        <ItemDescription>{routineData?.contentsInfo?.contentsDetailList?.[0]?.contentsName}</ItemDescription>
      </GridBox>
      <GridBox>
        <ItemTitle>CP명</ItemTitle>
        <ItemDescription>{cpName}</ItemDescription>
      </GridBox>
      <GridBox>
        <ItemTitle>컨텐츠 분류 1</ItemTitle>
        <ItemDescription>{mainCategoryValue}</ItemDescription>
      </GridBox>
      <GridBox>
        <ItemTitle>컨텐츠 분류 2</ItemTitle>
        <ItemDescription>{description(routineData?.contentsInfo?.subCategoryType)}</ItemDescription>
      </GridBox>
      <GridBox>
        <ItemTitle>컨텐츠 저장 위치</ItemTitle>
        <ItemDescription>{description(routineData?.contentsInfo?.contentsStorageLocation)}</ItemDescription>
      </GridBox>

      {/*--------------------------------------------- 루틴 컨텐츠 정보 섹션 ---------------------------------------------*/}

      <DefaultSectionTitleWraper>
        <SectionTitle>루틴/추천 운동 정보</SectionTitle>
      </DefaultSectionTitleWraper>
      <GridBox $firstBox>
        <ItemTitle>카테고리</ItemTitle>
        <ItemDescription>{description(routineData?.routineInfo?.categoryType)}</ItemDescription>
      </GridBox>
      <GridBox>
        <ItemTitle>신체능력평가 종류</ItemTitle>
        <ItemDescription>{description(routineData?.routineInfo?.sftType)}</ItemDescription>
      </GridBox>
      <GridBox>
        <ItemTitle>체형분석 종류</ItemTitle>
        <ItemDescription>{description(routineData?.routineInfo?.alignmentType)}</ItemDescription>
      </GridBox>
      <GridBox>
        <ItemTitle>관절가동범위</ItemTitle>
        <FlexBox>
          {reOrderedRomTypes?.categoryList?.map((category) => {
            return (
              <RomTypeContainer key={`${category}-row`}>
                <RomTypeItem key={category} $firstItem>
                  {convertEnum(category)}
                </RomTypeItem>
                {reOrderedRomTypes.object[category]?.map((item) => {
                  return <RomTypeItem key={item}>{convertEnum(item)}</RomTypeItem>;
                })}
              </RomTypeContainer>
            );
          })}
        </FlexBox>
      </GridBox>
      <GridBox>
        <ItemTitle>권장 연령대</ItemTitle>
        <ItemDescription>{description(routineData?.routineInfo?.recommendAgeType)}</ItemDescription>
      </GridBox>
      <GridBox>
        <ItemTitle>난이도</ItemTitle>
        <ItemDescription>{description(routineData?.routineInfo?.levelType)}</ItemDescription>
      </GridBox>
      <GridBox>
        <ItemTitle>운동강도</ItemTitle>
        <ItemDescription>{description(routineData?.routineInfo?.exerciseIntensityType)}</ItemDescription>
      </GridBox>

      <GridBox>
        <ItemTitle>사용기구</ItemTitle>
        <ItemDescription>{description(routineData?.routineInfo?.equipmentType)}</ItemDescription>
      </GridBox>
      <GridBox>
        <ItemTitle>포지션</ItemTitle>
        <ItemDescription>{description(routineData?.routineInfo?.positionType)}</ItemDescription>
      </GridBox>
      <GridBox>
        <ItemTitle>신체부위</ItemTitle>
        <ItemDescription>{description(routineData?.routineInfo?.bodyPartType)}</ItemDescription>
      </GridBox>
      <GridBox>
        <ItemTitle>근육명</ItemTitle>
        <ItemDescription>{routineData?.routineDetailList?.[0]?.muscle[0]}</ItemDescription>
      </GridBox>
      <GridBox>
        <ItemTitle>예외 대상 1(신체부위)</ItemTitle>
        <ItemDescription>{description(routineData?.routineInfo?.exceptionBodyPartType)}</ItemDescription>
      </GridBox>
      <GridBox>
        <ItemTitle>예외 대상 2(질환명)</ItemTitle>
        <ItemDescription>{description(routineData?.routineInfo?.exceptionDiseaseType)}</ItemDescription>
      </GridBox>
      <GridBox>
        <ItemTitle>운동효과</ItemTitle>
        <ItemDescription>{routineData?.routineDetailList?.[0]?.exerciseEffect}</ItemDescription>
      </GridBox>
      <GridBox>
        <ItemTitle>동작 설명</ItemTitle>
        <ItemDescription>{routineData?.routineDetailList?.[0]?.actionDescription}</ItemDescription>
      </GridBox>
      <GridBox>
        <ItemTitle>운동 목적</ItemTitle>
        <ItemDescription>{description(routineData?.routineInfo?.exercisePurposeType)}</ItemDescription>
      </GridBox>
      <GridBox>
        <ItemTitle>영상 썸네일 이미지</ItemTitle>
        <ImgPreview src={routineData?.routineInfo?.contentsImageFile?.fileUrl} />
      </GridBox>
      <GridBox>
        <ItemTitle>영상 파일</ItemTitle>
        <VideoPreview>
          {routineData?.routineInfo?.contentsRoutineFile && (
            <FlexRow>
              {routineData?.routineInfo?.contentsRoutineFile?.originalFileName}
              <FTAPlayButton onClick={() => handleModal(routineData?.routineInfo?.contentsRoutineFile?.fileUrl)}>
                재생
              </FTAPlayButton>
            </FlexRow>
          )}
        </VideoPreview>
      </GridBox>
      <GridBox>
        <ItemTitle>동작 설명</ItemTitle>
        <ItemDescription>
          {new Date(routineData?.contentsInfo?.registDate ?? '').toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}
        </ItemDescription>
      </GridBox>
      <ButtonSection>
        <ReqApprovalButton handleConfirm={() => handleApprovalReq({ contentsInfoId: Number(id) })} />
        <GoToEditButton onClick={() => handleNavigate(`/contents/cp/edit/${id}`)} />
        <DeleteButton handleConfirm={() => handleDeleteCPContent({ contentsInfoId: Number(id) })} />
        <GoToListButton onClick={() => handleNavigate(-1)} />
      </ButtonSection>
      <Text>NOTE: 권한 분리 시 반영</Text>
      <ButtonSection>
        <ApprovalButton handleConfirm={() => handleApprovalConfirm({ contentsInfoId: Number(id) })} />
        <RefusalButton handleConfirm={() => handleApprovalReject({ contentsInfoId: Number(id) })} />
        <GoToListButton onClick={() => handleNavigate(-1)} />
      </ButtonSection>
    </Container>
  );
};

export default ContentsCPDetail;
