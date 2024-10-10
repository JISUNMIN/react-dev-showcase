/** 관리자 계정 관리 > 관리자 계정 */
import { useMemo } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Div, FTATable } from '@components/index';
import StatusChip from '@components/molecules/chip/StatusChip';
import useAccount, { Accounts } from '@src/hooks/rest/accounts/useAccount';

const columnHelper = createColumnHelper<Accounts>();

const CPNameBox = styled(Div)`
  cursor: pointer;
  text-decoration: underline;
`;

const AccountList = () => {
  const navigate = useNavigate();

  const { accountListData } = useAccount();

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.adminId, {
        id: 'adminId',
        size: 170,
        header: 'ID',
        cell: ({ getValue, row: { original } }) => {
          const { adminInfoId } = original;
          return <CPNameBox onClick={() => navigate(adminInfoId.toString())}>{getValue()}</CPNameBox>;
        },
      }),
      columnHelper.accessor((row) => row.adminName, {
        id: 'adminName',
        size: 170,
        header: '이름',
      }),
      columnHelper.accessor((row) => row.className, {
        id: 'className',
        size: 170,
        header: '관리자 등급',
      }),
      columnHelper.accessor((row) => row.adminApproveStatus, {
        id: 'adminApproveStatus',
        size: 170,
        header: '승인상태',
        cell: ({ getValue }) => {
          return <StatusChip code={getValue()} />;
        },
      }),
      columnHelper.accessor((row) => row.registDate, {
        id: 'registDate',
        size: 170,
        header: '등록일',
      }),
    ],
    [navigate]
  );

  return <FTATable data={accountListData} columns={columns} />;
};

export default AccountList;
