/** 기타 관리 > CS 대응 */
import { useMemo } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { EmptyIcon } from '@src/assets/images';
import { Div, FTATable, Icon } from '@src/components';
import useCS, { CsList } from '@src/hooks/rest/etc/useCS';
import Cell from '@src/layout/grid/Cell';
import Grid from '@src/layout/grid/Grid';
import { flex, font, size } from '@src/styles/variables';
import { enumStore } from '@src/zustand';

export interface PageIndexParams {
  size: number;
  page: number;
}

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

const columnHelper = createColumnHelper<CsList>();

const Container = styled(Div)``;

const CellBox = styled(Div)`
  cursor: pointer;
  text-decoration: underline;
`;

const StatusDiv = styled(Div)`
  margin-top: 50px;
`;

const StatusCell = styled(Cell)`
  background: ${({ theme }) => theme.colors.gray01};
`;

{
  /** CS 대응에서 기획에 등록, 수정 X, 단건 조회 시 답변하기만 존재 */
}
const CsResponse = () => {
  const { processedListData, isListPending, processedStatusData, pageableInfo } = useCS();
  const { pageNumber, pageSize } = pageableInfo || { pageNumber: 1, pageSize: 10 };

  const { convertEnum } = enumStore();

  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => convertEnum(row.country), { id: 'country', size: 144, header: '국가' }),
      columnHelper.accessor((row) => row.userId, { id: 'userId', size: 126, header: '작성자' }),
      columnHelper.accessor((row) => convertEnum(row.csStatus), { id: 'csStatus', size: 126, header: '상태' }),
      columnHelper.accessor((row) => row.category, { id: 'category', size: 126, header: '카테고리' }),
      columnHelper.accessor((row) => row.title, {
        id: 'title',
        size: 200,
        header: '제목',
        cell: ({ getValue, row: { original, index } }) => {
          const { csRequestInfoId } = original;
          const itemIndex = (pageNumber - 1) * pageSize + index + 1;
          return (
            <CellBox onClick={() => navigate(csRequestInfoId.toString(), { state: { itemIndex } })}>
              {getValue()}
            </CellBox>
          );
        },
      }),
      columnHelper.accessor((row) => row.registDate, { id: 'registDate', size: 106, header: '등록일' }),
    ],
    [convertEnum, navigate, pageNumber, pageSize]
  );

  return (
    <Container>
      {processedListData?.total <= 0 ? (
        <EmptyContainer>
          <EmptyIconStyle icon={EmptyIcon} />
          <TextStyles>등록된 CS가 없습니다.</TextStyles>
        </EmptyContainer>
      ) : (
        <FTATable data={processedListData} columns={columns} isPending={isListPending} />
      )}

      <StatusDiv>
        <Grid title='대응 현황' column={6}>
          <StatusCell title='미완료 건 수' value={processedStatusData.incompleteCount || 0} />
          <StatusCell title='완료 건 수' value={processedStatusData.completeCount || 0} />
          <StatusCell title='등록 건 수' value={processedStatusData.totalCount || 0} />
        </Grid>
      </StatusDiv>
    </Container>
  );
};

export default CsResponse;
