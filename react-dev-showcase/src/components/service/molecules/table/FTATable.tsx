import { useMemo } from 'react';

import { ColumnDef } from '@tanstack/react-table';
import { FormProvider, useForm } from 'react-hook-form';
import { css } from 'styled-components';

import Table from '@src/components/molecules/table/Table';
import type { TableProps } from '@src/components/molecules/table/Table';
import { PrimaryButtonStyle } from '@src/components/service/atoms/button/FTAPrimaryButton';
import { useTableColumns } from '@src/hooks';
import { font } from '@src/styles/variables';
import { CodeValue } from '@src/zustand/enumStore';

import SearchContainer, { SearchKeywords } from './modules/SearchContainer';
import TableViewControl from './modules/TableViewControl';

export interface FTATableProps<TData, TValue> extends TableProps<TData, TValue> {
  /** 테이블 제일 왼쪽에 "번호" column 추가 여부 */
  useIndexColumn?: boolean;
  /** 키워드 사용 여부 (미사용 시 검색하는 부분은 없고, 날짜 선택하는 부분만 있음) */
  useKeyword?: boolean;
  /** 서브 필터 사용 여부 (사용시 필터 선택 추가됨) */
  hasSubFilter?: CodeValue[];
}

const FTARegisterButtonStyle = css`
  ${PrimaryButtonStyle};
  ${font({ size: '14px' })};
  width: 53px; // NOTE 디자인대로 51px로 하면 글자 세로로 잘림
  border-radius: 6px;
  padding: 8px 14px;
`;

const FTATable = <TData, TValue>({
  useIndexColumn = true,
  useKeyword,
  data,
  columns,
  isPending,
  hasSubFilter,
  ...rest
}: FTATableProps<TData, TValue>) => {
  const { getIndexColumn } = useTableColumns();
  const hookFormInstance = useForm<SearchKeywords>();
  // FIXME: 어떤 값이 들어가는지 기획에 명시되어 있지 않음
  const searchContainerOptions = useMemo(
    () =>
      columns.map((column) => {
        return { code: column?.id ?? '', value: column?.id ?? '' };
      }),
    [columns]
  );

  const numberedColumns = useMemo(() => {
    if (!useIndexColumn) {
      return columns;
    }

    return [getIndexColumn(), ...columns] as ColumnDef<TData, TValue>[];
  }, [getIndexColumn, useIndexColumn, columns]);

  const classes = {
    RegisterButton: FTARegisterButtonStyle,
  };

  return (
    <>
      <FormProvider {...hookFormInstance}>
        <SearchContainer useKeyword={useKeyword} content={searchContainerOptions} hasSubFilter={hasSubFilter} />
        <TableViewControl total={data?.total ?? 0} />
      </FormProvider>
      <Table data={data} columns={numberedColumns} isPending={isPending} classes={classes} {...rest} />
    </>
  );
};

export default FTATable;
