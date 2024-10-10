/** 기타 관리 > FAQ */
import { useMemo } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { EmptyIcon } from '@src/assets/images';
import { Div, FTATable, Icon } from '@src/components';
import { FTAPrimaryButton } from '@src/components/service/atoms';
import useFaq, { FaqList } from '@src/hooks/rest/etc/useFaq';
import { flex, font, size } from '@src/styles/variables';

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

const columnHelper = createColumnHelper<FaqList>();

const Container = styled(Div)``;

const CellBox = styled(Div)`
  cursor: pointer;
  text-decoration: underline;
`;

const Faq = () => {
  const { processedListData, isListPending } = useFaq();

  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.title, {
        id: 'title',
        size: 200,
        header: '제목',
        cell: ({ getValue, row: { original }, row: { index } }) => {
          const { faqInfoId } = original;
          return <CellBox onClick={() => navigate(faqInfoId.toString(), { state: { index } })}>{getValue()}</CellBox>;
        },
      }),
      columnHelper.accessor((row) => row.country, { id: 'country', size: 144, header: '국가' }),
      columnHelper.accessor((row) => row.category, { id: 'category', size: 126, header: '카테고리' }),
      columnHelper.accessor((row) => row.registDate, { id: 'registDate', size: 106, header: '등록일' }),
    ],
    []
  );

  return (
    <Container>
      {processedListData?.total <= 0 ? (
        <EmptyContainer>
          <EmptyIconStyle icon={EmptyIcon} />
          <TextStyles>등록된 FAQ가 없습니다.</TextStyles>
        </EmptyContainer>
      ) : (
        <FTATable data={processedListData} columns={columns} isPending={isListPending} />
      )}

      <FTAPrimaryButton onClick={() => navigate('edit')}>등록</FTAPrimaryButton>
    </Container>
  );
};

export default Faq;
