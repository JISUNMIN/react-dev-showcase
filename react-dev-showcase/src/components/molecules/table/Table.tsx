import { useCallback, useMemo } from 'react';

import { Skeleton } from '@mui/material';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import styled, { RuleSet, css } from 'styled-components';

import { tableSortAscIcon, tableSortDefaultIcon, tableSortDescIcon } from '@src/assets/images';
import { Button, Div, Icon } from '@src/components';
import { useQueryParams } from '@src/hooks';
import { flex } from '@src/styles/variables';

import Pagination from './modules/Pagination';

type Classes = {
  RegisterButton?: RuleSet<object>;
};

export interface TableProps<TData, TValue> {
  /** Table에 뿌려질 cell들의 데이터들 */
  data?: {
    result: TData[];
    total: number;
  };
  /** Table에 뿌려질 cell들의 형태가 정의된 배열 */
  columns: ColumnDef<TData, TValue>[];
  /** 첫 진입 시 Skelton UI를 구현하기 위한 boolean */
  isPending?: boolean;
  /**
   * Pagination을 몇개까지 보여줄지에 대한 변수
   *
   * `e.g. paginationSizeLimit = 5 라면, 1 2 3 4 5, 6 7 8 9 10, ...`
   */
  paginationSizeLimit?: number;
  /** 등록버튼 onClick callback */
  onRegister?: () => void;
  /**
   * 커스텀 CSS 전달을 위한 객체
   *
   * @param RegisterButton: 등록버튼에 대한 커스텀 CSS
   */
  classes?: Classes;
}

export interface RequiredTableQueryParams {
  /** {page} 번째 페이지 */
  page: string;
  /** 한 페이지에 {size}개의 데이터가 테이블에 노출 */
  size: string;
}

export interface TableQueryParams extends RequiredTableQueryParams {
  orderFieldType?: string;
  orderDirectionType?: string;
}

const CellStyles = css`
  border: 1px solid black;
  vertical-align: middle;
  padding: 0 20px;
  border: 1px solid #d9d9d9;
  border-collapse: collapse;
  border-left: none;
  border-right: none;
`;

const TableContainer = styled(Div)``;

const PlainTable = styled.table`
  width: 100%;
  font-size: 12px;
  text-align: center;
`;

const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.colors.gray02};
  text-align: left;
  color: ${({ theme }) => theme.colors.gray08};
  font-weight: 700;
`;

const TableRow = styled.tr`
  height: 48px;
`;

const TableHeader = styled.th<{ $size: string | number }>`
  ${CellStyles}

  cursor: pointer;
  width: ${({ $size }) => ($size ? `${$size}px` : 'auto')};
`;

const TableHeaderIcon = styled(Icon)`
  margin-left: 6px;
  width: 16px;
  aspect-ratio: 1;
`;

const TableBody = styled.tbody`
  text-align: left;
  color: ${({ theme }) => theme.colors.gray09};
`;

const TableCell = styled.td`
  ${CellStyles}
`;

const TableFooter = styled(Div)`
  --button-width: 51px;

  margin-top: 42px;
  ${flex({ justify: 'space-between' })};
`;

const DummyDiv = styled(Div)`
  width: var(--button-width);
`;

const RegisterButton = styled(Button)<{ $classes?: Classes }>`
  width: var(--button-width);
  height: 36px;
  font-size: 14px;

  ${({ $classes }) => $classes?.RegisterButton};
`;

const Table = <TData, TValue>({
  data,
  columns,
  isPending,
  paginationSizeLimit,
  onRegister,
  classes,
  ...rest
}: TableProps<TData, TValue>) => {
  const { getAllQueryParams, setQueryParam } = useQueryParams<TableQueryParams>();
  const queryParams = getAllQueryParams();
  const page = queryParams.get('page');
  const size = queryParams.get('size');
  const orderFieldType = queryParams.get('orderFieldType');
  const orderDirectionType = queryParams.get('orderDirectionType');

  const pagination = useMemo(
    () => ({
      page: page!,
      size: size!,
    }),
    [page, size]
  );

  const tableData = useMemo(() => {
    if (isPending) {
      return Array(Number(size!)).fill({});
    }
    return data?.result ?? [];
  }, [isPending, size, data]);

  const tableColumns = useMemo(() => {
    if (isPending) {
      return columns.map((column) => ({
        ...column,
        cell: () => <Skeleton height={27} />, // NOTE 이유는 모르겠으나 60%만 반영 됨
      }));
    }

    return columns;
  }, [isPending, columns]);

  const tableInstance = useReactTable<TData>({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel<TData>(),
  });

  const getTableHeaderIcon = useCallback(
    (headerId: string) => {
      if (!orderFieldType || headerId !== orderFieldType) {
        return tableSortDefaultIcon;
      }

      return orderDirectionType === 'asc' ? tableSortAscIcon : tableSortDescIcon;
    },
    [orderFieldType, orderDirectionType]
  );

  const handleTableHeaderClick = (headerId: string) => {
    const sortingLoop = ['', 'asc', 'desc'];
    const currentIndex = sortingLoop.indexOf(orderDirectionType ?? '');
    const nextIndex = (currentIndex + 1) % sortingLoop.length;
    const nextDirection = sortingLoop[nextIndex];

    setQueryParam('orderFieldType', nextDirection ? headerId : '');
    setQueryParam('orderDirectionType', nextDirection);
    setQueryParam('page', '1');
  };

  return (
    <TableContainer {...rest}>
      <PlainTable>
        <TableHead>
          {tableInstance.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHeader
                  key={header.id}
                  colSpan={header.colSpan}
                  $size={header.getSize()}
                  onClick={() => handleTableHeaderClick(header.id)}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  <TableHeaderIcon icon={getTableHeaderIcon(header.id)} />
                </TableHeader>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {tableInstance.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </PlainTable>
      <TableFooter>
        <DummyDiv />
        <Pagination pagination={pagination} total={data?.total ?? 0} paginationSizeLimit={paginationSizeLimit} />
        {onRegister ? (
          <RegisterButton onClick={onRegister} $classes={classes}>
            등록
          </RegisterButton>
        ) : (
          <DummyDiv />
        )}
      </TableFooter>
    </TableContainer>
  );
};

export default Table;
