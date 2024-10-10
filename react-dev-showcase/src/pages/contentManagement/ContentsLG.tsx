/** 컨텐츠 관리 > 자사 컨텐츠 */
import { useCallback, useMemo } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Div, FTAPageTitle, FTATable } from '@src/components';
import StatusChip from '@src/components/molecules/chip/StatusChip';
import type { FormattedCPContent } from '@src/hooks/rest/contents/useContentsCP';
import useContentsLG from '@src/hooks/rest/contents/useContentsLG';
import { enumStore } from '@src/zustand';

const columnHelper = createColumnHelper<FormattedCPContent>();

const Container = styled(Div)``;
const CPNameBox = styled(Div)`
  cursor: pointer;
  text-decoration: underline;
`;

const ContentsLG = () => {
  const navigate = useNavigate();
  const { routineListData } = useContentsLG();
  const { getEnumByKey } = enumStore();

  const handleNavigate = useCallback(() => {
    navigate('edit');
  }, [navigate]);

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.contentsName, {
        id: 'contentsName',
        size: 223,
        header: '콘텐츠명',
        cell: ({ getValue, row: { original } }) => {
          const { contentsInfoId } = original;
          return <CPNameBox onClick={() => navigate(`${contentsInfoId.toString()}`)}>{getValue()}</CPNameBox>;
        },
      }),
      columnHelper.accessor((row) => row.cpName, { id: 'cpName', size: 170, header: 'CP명' }),
      columnHelper.accessor((row) => row.mainCategory, { id: 'mainCategory', size: 144, header: '컨텐츠 분류 1' }),
      columnHelper.accessor((row) => row.subCategory, { id: 'subCategory', size: 126, header: '컨텐츠 분류 2' }),
      columnHelper.accessor((row) => row.categoryType, {
        id: 'categoryType',
        size: 126,
        header: '카테고리',
      }),
      columnHelper.accessor((row) => row.recommendAge, {
        id: 'recommendAge',
        size: 115,
        header: '권장 연령대',
      }),
      columnHelper.accessor((row) => row.level, { id: 'level', size: 98, header: '난이도' }),
      columnHelper.accessor((row) => row.exerciseIntensity, { id: 'exerciseIntensity', size: 102, header: '운동강도' }),
      columnHelper.accessor((row) => row.routineApprovalStatus, {
        id: 'routineApprovalStatus',
        size: 102,
        header: '승인상태',
        cell: ({ getValue }) => {
          return <StatusChip code={getValue()} />;
        },
      }),
      columnHelper.accessor((row) => row.registDate, { id: 'registDate', size: 106, header: '등록일' }),
    ],
    [navigate]
  );

  return (
    <Container>
      <FTAPageTitle title={'자사 컨텐츠 관리'} />
      <FTATable
        data={routineListData}
        columns={columns}
        onRegister={handleNavigate}
        hasSubFilter={getEnumByKey('MainCategoryType')}
      />
    </Container>
  );
};

export default ContentsLG;
