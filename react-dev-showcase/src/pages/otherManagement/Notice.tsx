/** 기타 관리 > 공지사항 */
import { useMemo } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import PATHS from '@router/path';
import { EmptyIcon } from '@src/assets/images';
import { Div, FTATable, Icon } from '@src/components';
import useNotice, { INotice } from '@src/hooks/rest/etc/useNotice';
import { flex, font, size } from '@src/styles/variables';

const columnHelper = createColumnHelper<INotice>();

const EmptyContainer = styled(Div)`
  ${flex({ direction: 'column' })};
  margin: auto;
`;

const EmptyIconStyle = styled(Icon)`
  ${size({ w: '120px' })}
`;

const TextStyles = styled(Div)`
  ${font({ size: '18px', weight: '600px' })}
  color: ${({ theme }) => theme.colors.gray07};
`;

const CPNameBox = styled(Div)`
  cursor: pointer;
  text-decoration: underline;
`;

const Notice = () => {
  const navigate = useNavigate();

  const { noticeListData, isListPending } = useNotice();

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.country, {
        id: 'country',
        size: 170,
        header: '국가',
      }),
      columnHelper.accessor((row) => row.category, {
        id: 'category',
        size: 170,
        header: '카테고리',
      }),
      columnHelper.accessor((row) => row.title, {
        id: 'title',
        size: 170,
        header: '제목',
        cell: ({ getValue, row: { original } }) => {
          const { noticeInfoId } = original;
          return <CPNameBox onClick={() => navigate(noticeInfoId.toString())}>{getValue()}</CPNameBox>;
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

  return (
    <>
      {noticeListData?.total <= 0 ? (
        <EmptyContainer>
          <EmptyIconStyle icon={EmptyIcon} />
          <TextStyles>등록된 공지사항이 없습니다.</TextStyles>
        </EmptyContainer>
      ) : (
        <FTATable
          data={noticeListData}
          columns={columns}
          isPending={isListPending}
          onRegister={() => navigate(`/${PATHS.NOTICE_EDIT}`)}
        />
      )}
    </>
  );
};

export default Notice;
