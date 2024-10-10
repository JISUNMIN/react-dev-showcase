/** 승인 관리 > 승인 대기 프로그램 */
import { useMemo } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { EmptyIcon } from '@src/assets/images';
import { Div, FTATable, Icon } from '@src/components';
import StatusChip from '@src/components/molecules/chip/StatusChip';
import useApprovalProgram, { ApprovalProgramList } from '@src/hooks/rest/approval/useApprovalProgram';
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

const columnHelper = createColumnHelper<ApprovalProgramList>();

const Container = styled(Div)``;

const CellBox = styled(Div)`
  cursor: pointer;
  text-decoration: underline;
`;

const PendingApprovalProgram = () => {
  const { processedProgramListData, isProgramListPending } = useApprovalProgram();

  const { convertEnum } = enumStore();

  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.programName, {
        id: 'programName',
        size: 200,
        header: '프로그램명',
        cell: ({ getValue, row: { original } }) => {
          const { programInfoId } = original;
          return (
            <CellBox onClick={() => navigate(`${PATHS.ROOT}${PATHS.ECP_CONFIGURATION_DETAIL}/${programInfoId}`)}>
              {getValue()}
            </CellBox>
          );
        },
      }),
      columnHelper.accessor((row) => convertEnum(row.cpName), {
        id: 'cpName',
        size: 126,
        header: 'CP명',
      }),
      columnHelper.accessor((row) => row.programGubun, { id: 'programGubun', size: 126, header: '프로그램 분류' }),
      columnHelper.accessor((row) => row.sessionCount.toString(), {
        id: 'sessionCount',
        size: 126,
        header: '세션 수',
      }),
      columnHelper.accessor((row) => row.scheduleYn.toString(), {
        id: 'scheduleYn',
        size: 126,
        header: '스케줄 여부',
      }),
      columnHelper.accessor((row) => row.exposeYn.toString(), {
        id: 'exposeYn',
        size: 126,
        header: '노출 여부',
      }),
      columnHelper.accessor((row) => row.priceYn.toString(), {
        id: 'priceYn',
        size: 126,
        header: '유/무료',
      }),
      columnHelper.accessor((row) => row.approvalStatus, {
        id: 'approvalStatus',
        size: 102,
        header: '승인상태',
        cell: ({ getValue }) => {
          return <StatusChip code={getValue()} />;
        },
      }),
      columnHelper.accessor((row) => row.programDuration, {
        id: 'programDuration',
        size: 126,
        header: '프로그램 기간',
      }),
      columnHelper.accessor((row) => row.registDate, { id: 'registDate', size: 106, header: '등록일' }),
    ],
    []
  );

  return (
    <Container>
      {processedProgramListData?.total <= 0 ? (
        <EmptyContainer>
          <EmptyIconStyle icon={EmptyIcon} />
          <TextStyles>등록된 승인대기 프로그램이 없습니다.</TextStyles>
        </EmptyContainer>
      ) : (
        <FTATable data={processedProgramListData} columns={columns} isPending={isProgramListPending} />
      )}
    </Container>
  );
};

export default PendingApprovalProgram;
