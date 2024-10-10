import { useMemo } from 'react';

import styled from 'styled-components';

import { pagingFirstLeftIcon, pagingLastRightIcon, pagingLeftIcon, pagingRightIcon } from '@src/assets/images';
import { Button, Div, Icon } from '@src/components';
import type { RequiredTableQueryParams } from '@src/components/molecules/table/Table';
import useQueryParams from '@src/hooks/useQueryParams';

interface PaginationProps {
  pagination: RequiredTableQueryParams;
  total: number;
  paginationSizeLimit?: number;
}

const PaginatorsContainer = styled(Div)`
  display: flex;
  column-gap: 20px;
`;

const PaginatorButton = styled(Button)`
  padding: 0;
`;

const PaginatorIcon = styled(Icon)`
  width: 28px;
  aspect-ratio: 1;
`;

const Paginator = styled(Button)<{ $current: boolean }>`
  font-size: 14px;
  font-weight: 600;
  width: 28px;
  aspect-ratio: 1;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.gray08};

  background-color: ${({ $current, theme }) => $current && `${theme.colors.brown01}`};
  font-weight: ${({ $current }) => $current && `700`};
  color: ${({ $current, theme }) => $current && theme.colors.brown03};
`;

const Pagination = ({ pagination, total, paginationSizeLimit = 10 }: PaginationProps) => {
  const { setQueryParam } = useQueryParams<RequiredTableQueryParams>();
  const lastIndex = useMemo(() => Math.ceil(total / Number(pagination.size)), [total, pagination.size]);
  const currentPageIndex = Number(pagination.page);

  const handleFirstPageClick = () => {
    setQueryParam('page', '1');
  };

  const handlePreviousPageClick = () => {
    if (!(currentPageIndex > 1)) return;
    const previousPageIndex = currentPageIndex - 1;
    setQueryParam('page', previousPageIndex.toString());
  };

  const handlePaginatorClick = (page: number) => {
    setQueryParam('page', page.toString());
  };

  const handleNextPageClick = () => {
    if (!(lastIndex > currentPageIndex)) return;
    const nextPageIndex = currentPageIndex + 1;
    setQueryParam('page', nextPageIndex.toString());
  };

  const handleLastPageClick = () => {
    setQueryParam('page', lastIndex.toString());
  };

  return (
    <PaginatorsContainer>
      <PaginatorButton disabled={false} onClick={handleFirstPageClick}>
        <PaginatorIcon icon={pagingFirstLeftIcon} />
      </PaginatorButton>
      <PaginatorButton disabled={false} onClick={handlePreviousPageClick}>
        <PaginatorIcon icon={pagingLeftIcon} />
      </PaginatorButton>
      {Array.from({ length: paginationSizeLimit }, (_, index) => {
        const visiblePageIndex =
          Math.floor((Number(pagination.page) - 1) / paginationSizeLimit) * paginationSizeLimit + index + 1;

        return lastIndex >= visiblePageIndex ? (
          <Paginator
            key={visiblePageIndex}
            onClick={() => handlePaginatorClick(visiblePageIndex)}
            disabled={currentPageIndex === visiblePageIndex}
            $current={currentPageIndex === visiblePageIndex}
          >
            {visiblePageIndex}
          </Paginator>
        ) : null;
      })}
      <PaginatorButton disabled={false} onClick={handleNextPageClick}>
        <PaginatorIcon icon={pagingRightIcon} />
      </PaginatorButton>
      <PaginatorButton disabled={false} onClick={handleLastPageClick}>
        <PaginatorIcon icon={pagingLastRightIcon} />
      </PaginatorButton>
    </PaginatorsContainer>
  );
};

export default Pagination;
