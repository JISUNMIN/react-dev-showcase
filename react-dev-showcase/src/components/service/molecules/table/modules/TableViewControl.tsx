import { useCallback, useEffect, useMemo } from 'react';

import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { Div } from '@src/components/atoms';
import type { RequiredTableQueryParams } from '@src/components/molecules/table/Table';
import FTADropdown from '@src/components/service/molecules/FTADropdown';
import { useQueryParams } from '@src/hooks';
import { flex, font, size } from '@src/styles/variables';
import { CodeValue } from '@src/zustand/enumStore';

interface TableViewContorlProps {
  /** 총 데이터 개수 */
  total?: number;
}

const TableViewContainer = styled(Div)`
  ${flex({ justify: 'flex-start', gap: '28px' })};
  ${font({ size: '14px' })};
  height: 40px;
  margin-bottom: 28px;
  padding: 0 20px;
  color: ${({ theme }) => theme.colors.gray07};
`;

const TotalCount = styled(Div)``;

const TotalCountHighlight = styled(Div)`
  color: ${({ theme }) => theme.colors.gray10};
`;

const VerticalDivider = styled(Div)`
  ${size({ w: '1px', h: '20px' })};
  background-color: ${({ theme }) => theme.colors.gray04};
`;

const TableViewDropdown = styled(FTADropdown).attrs({
  size: 'small',
  height: '100%',
  line: 'false',
})``;

const sizeOptions = [
  { code: '10', value: '10개씩 보기' },
  { code: '20', value: '20개씩 보기' },
  { code: '30', value: '30개씩 보기' },
];

const TableViewControl = ({ total = 0 }: TableViewContorlProps) => {
  const { getQueryParam, setQueryParam } = useQueryParams<RequiredTableQueryParams>();
  const { resetField } = useFormContext();

  const size = getQueryParam('size') ?? '10';

  const pageOptions = useMemo(() => {
    const lastIndex = Math.ceil(total / Number(size));

    return lastIndex > 0
      ? Array(lastIndex)
          .fill(0)
          .map((_, index) => {
            return { code: (index + 1).toString(), value: `${index + 1} / ${lastIndex} 페이지` };
          })
      : [{ code: '1', value: '1 / 1 페이지' }];
  }, [total, size]);

  const onSizeChange = useCallback(
    (codeValue: CodeValue) => {
      const calculatedSize = Number(codeValue.code);
      setQueryParam('size', calculatedSize.toString());
    },
    [setQueryParam]
  );

  const onPageChange = useCallback(
    (codeValue: CodeValue) => {
      const calculatedPage = Number(codeValue.code);
      setQueryParam('page', calculatedPage.toString());
    },
    [setQueryParam]
  );

  useEffect(() => {
    const pageParam = getQueryParam('page');
    const sizeParam = getQueryParam('size');
    if (pageParam) {
      const currentPage = pageOptions.find((page) => page.code === pageParam);
      resetField('page', {
        defaultValue: currentPage,
      });
    }

    if (sizeParam) {
      const currentSize = sizeOptions.find((size) => size.code === sizeParam);
      resetField('size', {
        defaultValue: currentSize,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageOptions]);

  return (
    <TableViewContainer>
      <TotalCount>
        총 <TotalCountHighlight forwardedAs='span'>{total}</TotalCountHighlight>개 항목
      </TotalCount>
      <VerticalDivider />
      <TableViewDropdown name={'size'} content={sizeOptions} onChange={onSizeChange} hasDefaultValue />
      <TableViewDropdown name={'page'} content={pageOptions} onChange={onPageChange} hasDefaultValue />
    </TableViewContainer>
  );
};

export default TableViewControl;
