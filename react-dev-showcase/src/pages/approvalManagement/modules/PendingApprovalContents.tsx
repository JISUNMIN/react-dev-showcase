/** 승인 관리 > 승인 대기 컨텐츠 */
import { useMemo } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { EmptyIcon } from '@src/assets/images';
import { Div, FTATable, Icon } from '@src/components';
import useApprovalContents, { ApprovalContentsList } from '@src/hooks/rest/approval/useApprovalContents';
import PATHS from '@src/router/path';
import { flex, font, size } from '@src/styles/variables';
import { enumStore } from '@src/zustand';

const EmptyContainer = styled(Div)`
  ${flex({ direction: 'column' })};
  margin: auto;
`;

const EmptyIconStyle = styled(Icon)`
  ${size({ w: '120px' })}
`;

const TextStyles = styled(Div)`
  ${font({ size: '18px', weight: '600px' })}
  line-height: 1.17;
  color: ${({ theme }) => theme.colors.gray07};
`;

const columnHelper = createColumnHelper<ApprovalContentsList>();

const Container = styled(Div)``;

const CellBox = styled(Div)`
  cursor: pointer;
  text-decoration: underline;
`;

const PendingApprovalContents = () => {
  const { processedContentsListData, isContentsListPending } = useApprovalContents();

  const { convertEnum } = enumStore();

  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.contentsName, {
        id: 'contentsName',
        size: 200,
        header: '콘텐츠명',
        cell: ({ getValue, row: { original } }) => {
          const { contentsInfoId } = original;
          return (
            /** FIXME 컨텐츠 이동은  확인 필요*/
            <CellBox onClick={() => navigate(`${PATHS.ROOT}${PATHS.CONTENTS_CP_DETAIL}/${contentsInfoId}`)}>
              {getValue()}
            </CellBox>
          );
        },
      }),
      columnHelper.accessor((row) => row.cpName, {
        id: 'cpName',
        size: 144,
        header: 'CP명',
      }),
      columnHelper.accessor((row) => convertEnum(row.mainCategoryType), {
        id: 'mainCategoryType',
        size: 126,
        header: '컨텐츠 분류1',
      }),
      columnHelper.accessor((row) => row.subCategoryType, { id: 'content', size: 126, header: '컨텐츠 분류2' }),
      columnHelper.accessor((row) => row.categoryType, { id: 'categoryType', size: 126, header: '카테고리' }),
      columnHelper.accessor((row) => row.recommendAgeType, {
        id: 'recommendAgeType',
        size: 126,
        header: '권장 연령대',
      }),
      columnHelper.accessor((row) => row.levelType, { id: 'levelType', size: 126, header: '난이도' }),
      columnHelper.accessor((row) => row.exerciseIntensityType, {
        id: 'exerciseIntensityType',
        size: 126,
        header: '운동 강도',
      }),
      columnHelper.accessor((row) => row.registDate, { id: 'registDate', size: 106, header: '등록일' }),
    ],
    []
  );

  return (
    <Container>
      {processedContentsListData?.total <= 0 ? (
        <EmptyContainer>
          <EmptyIconStyle icon={EmptyIcon} />
          <TextStyles>등록된 승인대기 콘텐츠가 없습니다.</TextStyles>
        </EmptyContainer>
      ) : (
        <FTATable data={processedContentsListData} columns={columns} isPending={isContentsListPending} />
      )}
    </Container>
  );
};

export default PendingApprovalContents;
