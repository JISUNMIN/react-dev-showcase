/** 승인 관리 > 승인 대기 CP */
import { useMemo } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { EmptyIcon } from '@src/assets/images';
import { Div, FTATable, Icon } from '@src/components';
import useApprovalCp, { ApprovalCpList } from '@src/hooks/rest/approval/useApprovalCp';
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

const columnHelper = createColumnHelper<ApprovalCpList>();

const Container = styled(Div)``;

const CellBox = styled(Div)`
  cursor: pointer;
  text-decoration: underline;
`;

const PendingApprovalCP = () => {
  const { processedCpListData, isCpListPending } = useApprovalCp();

  const { convertEnum } = enumStore();

  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.cpName, {
        id: 'cpName',
        size: 200,
        header: 'CP명',
        cell: ({ getValue, row: { original } }) => {
          const { cpManagementInfoId } = original;
          return (
            <CellBox onClick={() => navigate(`${PATHS.ROOT}${PATHS.CP_INFO_DETAIL}/${cpManagementInfoId}`)}>
              {getValue()}
            </CellBox>
          );
        },
      }),
      columnHelper.accessor((row) => convertEnum(row.mainCategoryType), {
        id: 'mainCategoryType',
        size: 126,
        header: '컨텐츠 분류1',
      }),
      columnHelper.accessor((row) => row.subCategoryType, { id: 'subCategoryType', size: 126, header: '컨텐츠 분류2' }),
      columnHelper.accessor((row) => row.programCnt.toString(), {
        id: 'programCnt',
        size: 126,
        header: '노출 프로그램 수',
      }),
      columnHelper.accessor((row) => row.contentsCnt.toString(), {
        id: 'contentsCnt',
        size: 126,
        header: '컨텐츠 수',
      }),
      columnHelper.accessor((row) => row.priceYn.toString(), {
        id: 'priceYn',
        size: 126,
        header: '유/무료',
      }),
      columnHelper.accessor((row) => row.registDate, { id: 'registDate', size: 106, header: '등록일' }),
    ],
    []
  );

  return (
    <Container>
      {processedCpListData?.total <= 0 ? (
        <EmptyContainer>
          <EmptyIconStyle icon={EmptyIcon} />
          <TextStyles>등록된 승인대기 CP가 없습니다.</TextStyles>
        </EmptyContainer>
      ) : (
        <FTATable data={processedCpListData} columns={columns} isPending={isCpListPending} />
      )}
    </Container>
  );
};

export default PendingApprovalCP;
