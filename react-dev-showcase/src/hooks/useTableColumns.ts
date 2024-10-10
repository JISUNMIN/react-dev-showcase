import { ColumnDef } from '@tanstack/react-table';

import type { RequiredTableQueryParams } from '@src/components/molecules/table/Table';
import useQueryParams from '@src/hooks/useQueryParams';

const useTableColumns = <T extends RequiredTableQueryParams>() => {
  const { getAllQueryParams } = useQueryParams<T>();
  const queryParams = getAllQueryParams();
  const page = queryParams.get('page');
  const size = queryParams.get('size');

  const createColumn = <TData, TValue>(props: ColumnDef<TData, TValue>) => ({ ...props });

  const getIndexColumn = <TData, TValue>(props?: ColumnDef<TData, TValue>) => {
    return createColumn({
      size: 82, // NOTE fittv-admin에서 기본 값으로 사용 되고 있음
      ...props,
      accessorKey: 'No',
      id: 'No',
      header: '번호',
      cell: (props) => (Number(page!) - 1) * Number(size!) + props.row.index + 1,
    });
  };

  return {
    createColumn,
    getIndexColumn,
  };
};

export default useTableColumns;
