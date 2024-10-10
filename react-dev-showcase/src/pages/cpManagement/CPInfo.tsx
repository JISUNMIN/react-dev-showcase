/** CP 관리 > CP 정보 */
import { useMemo } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Div, FTATable } from '@src/components';
import useCPs from '@src/hooks/rest/CPs/useCPs';
import type { FormattedCPList } from '@src/hooks/rest/CPs/useCPs';
import PATHS from '@src/router/path';

const columnHelper = createColumnHelper<FormattedCPList>();

const CPNameBox = styled(Div)`
  cursor: pointer;
  text-decoration: underline;
`;

const CPInfo = () => {
  const { id } = useParams();
  const { processedListData, isListPending } = useCPs(id!);
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.cpName, {
        id: 'cpName',
        size: 409,
        header: 'CP명',
        cell: ({ getValue, row: { original } }) => {
          const { cpManagementId } = original;
          return <CPNameBox onClick={() => navigate(cpManagementId.toString())}>{getValue()}</CPNameBox>;
        },
      }),
      columnHelper.accessor((row) => row.mainCategory, { id: 'mainCategory', size: 144, header: '컨텐츠 분류 1' }),
      columnHelper.accessor((row) => row.subCategory, { id: 'subCategory', size: 126, header: '컨텐츠 분류 2' }),
      columnHelper.accessor((row) => row.exposeCount?.toString(), {
        id: 'exposeCount',
        size: 139,
        header: '노출 프로그램 수',
      }),
      columnHelper.accessor((row) => row.contentsCount?.toString(), {
        id: 'contentsCount',
        size: 106,
        header: '컨텐츠 수',
      }),
      // columnHelper.accessor((row) => row., { id: '', size: 98,  header: '유/무료' }), // FIXME: response에 없음
      columnHelper.accessor((row) => row.priceCount?.toString(), { id: 'priceCount', size: 106, header: '구독자 수' }),
      // columnHelper.accessor((row) => row., { id: '', size: 82, header: '평점' }), // FIXME: response에 없음
      columnHelper.accessor((row) => row.approvalStatusType, {
        id: 'approvalStatusType',
        size: 102,
        header: '승인상태',
      }),
      columnHelper.accessor((row) => row.registDate, { id: 'registDate', size: 106, header: '등록일' }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleRegisterClick = () => {
    navigate(`/${PATHS.CP_INFO_EDIT}`);
  };

  return (
    <FTATable data={processedListData} columns={columns} isPending={isListPending} onRegister={handleRegisterClick} />
  );
};

CPInfo.propTypes = {};

export default CPInfo;
