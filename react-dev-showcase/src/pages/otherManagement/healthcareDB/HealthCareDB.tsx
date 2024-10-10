/** 기타 관리 > 헬스케어 DB */
import { useMemo } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import PATHS from '@router/path';
import { EmptyIcon } from '@src/assets/images';
import { Div, FTATable, Icon } from '@src/components';
import useHealthcareDB, { HealthDBList } from '@src/hooks/rest/useHealthcareDB';
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

const columnHelper = createColumnHelper<HealthDBList>();

const Container = styled(Div)``;

const CellBox = styled(Div)`
  cursor: pointer;
  text-decoration: underline;
`;

const HealthCareDB = () => {
  const { processedListData, isListPending } = useHealthcareDB();

  const { convertEnum } = enumStore();

  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.mainCategoryType, {
        id: 'mainCategoryType',
        size: 200,
        header: '고객 피드백용 DB종류',
        cell: ({ getValue, row: { original } }) => {
          const { healthCareInfoId } = original;
          return <CellBox onClick={() => navigate(healthCareInfoId.toString())}>{convertEnum(getValue())}</CellBox>;
        },
      }),
      columnHelper.accessor((row) => convertEnum(row.subCategoryType), {
        id: 'subCategoryType',
        size: 144,
        header: '등급기준 DB종류',
      }),
      columnHelper.accessor((row) => row.content, { id: 'content', size: 126, header: '업데이트 사항' }),
      columnHelper.accessor((row) => row.country, {
        id: 'country',
        size: 200,
        header: '국가 / 언어',
        cell: ({ getValue, row: { original } }) => {
          const { languageType } = original;
          return <Div>{`${convertEnum(languageType)} / ${convertEnum(getValue())}`}</Div>;
        },
      }),
      columnHelper.accessor((row) => row.registDate, { id: 'registDate', size: 106, header: '등록일' }),
    ],
    []
  );

  return (
    <Container>
      {processedListData?.total <= 0 ? (
        <EmptyContainer>
          <EmptyIconStyle icon={EmptyIcon} />
          <TextStyles>등록된 헬스케어 DB가 없습니다.</TextStyles>
        </EmptyContainer>
      ) : (
        <FTATable
          data={processedListData}
          columns={columns}
          isPending={isListPending}
          onRegister={() => navigate(`/${PATHS.HEALTHCAREDB_EDIT}`)}
        />
      )}
    </Container>
  );
};

export default HealthCareDB;
