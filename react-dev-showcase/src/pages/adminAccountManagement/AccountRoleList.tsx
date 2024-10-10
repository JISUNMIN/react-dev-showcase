/** 관리자 계정 관리 > 관리자 등급설정 */
import { useMemo } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Div, FTATable } from '@src/components';
import useAccountSetting, { AccountsSetting } from '@src/hooks/rest/accounts/useAccountSetting';

const columnHelper = createColumnHelper<AccountsSetting>();

const CPNameBox = styled(Div)`
  cursor: pointer;
  text-decoration: underline;
`;

const AccountRoleList = () => {
  const navigate = useNavigate();

  const { roleListData } = useAccountSetting();

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.className, {
        id: 'className',
        size: 170,
        header: '관리자 등급',
        cell: ({ getValue, row: { original } }) => {
          const { adminClassInfoId } = original;
          return <CPNameBox onClick={() => navigate(adminClassInfoId.toString())}>{getValue()}</CPNameBox>;
        },
      }),
      columnHelper.accessor((row) => row.approvalAuthority.toString(), {
        id: 'approvalAuthority',
        size: 170,
        header: '승인 권한',
        cell: ({ getValue }) => {
          return <span>{getValue() === 'true' ? '가능' : '불가능'}</span>;
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
  return <FTATable data={roleListData} columns={columns} />;
};

export default AccountRoleList;
