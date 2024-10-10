/** 외부 센터프로그램 관리 > 프로그램 구성 (테이블)*/
import { useMemo } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { EmptyIcon } from '@src/assets/images';
import { Div, FTATable, Icon } from '@src/components';
import { FTAPrimaryButton } from '@src/components/service/atoms';
import useProgram from '@src/hooks/rest/useProgram';
import type { PROGRAM } from '@src/hooks/rest/useProgram';
import { flex, font, size } from '@src/styles/variables';

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

const columnHelper = createColumnHelper<PROGRAM>();

const Container = styled(Div)``;

const CellBox = styled(Div)`
  cursor: pointer;
  text-decoration: underline;
`;

const ECPConfiguration = () => {
  const { processedListData, isListPending } = useProgram();

  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.programName, {
        id: 'programName',
        size: 200,
        header: '프로그램명',
        cell: ({ getValue, row: { original } }) => {
          const { programInfoId } = original;
          return <CellBox onClick={() => navigate(programInfoId.toString())}>{getValue()}</CellBox>;
        },
      }),
      columnHelper.accessor((row) => row.cpName, { id: 'cpName', size: 144, header: 'cp명' }),
      columnHelper.accessor((row) => row.priceYn?.toString(), { id: 'priceYn', size: 126, header: '유/무료' }),
      columnHelper.accessor((row) => row.programDuration?.toString(), {
        id: 'programDuration',
        size: 106,
        header: '프로그램 기간',
      }),
      columnHelper.accessor((row) => row.sessionCount?.toString(), {
        id: 'sessionCount',
        size: 106,
        header: '세션 수',
      }),
      columnHelper.accessor((row) => row.approvalStatus, {
        id: 'approvalStatus',
        size: 102,
        header: '승인상태',
      }),
      columnHelper.accessor((row) => row.registDate, { id: 'registDate', size: 106, header: '등록일' }),
      // columnHelper.accessor((row) => row., {
      //   id: '',
      //   size: 102,
      //   header: '언어추가',
      // }),
    ],
    []
  );

  return (
    <Container>
      {processedListData?.total <= 0 ? (
        <EmptyContainer>
          <EmptyIconStyle icon={EmptyIcon} />
          <TextStyles>등록된 프로그램이 없습니다.</TextStyles>
        </EmptyContainer>
      ) : (
        <FTATable data={processedListData} columns={columns} isPending={isListPending} />
      )}

      <FTAPrimaryButton onClick={() => navigate('edit')}>등록</FTAPrimaryButton>
    </Container>
  );
};

export default ECPConfiguration;
