import { useEffect } from 'react';

import { SubmitHandler, useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { Div } from '@src/components/atoms';
import { RangeCalendar } from '@src/components/organisms';
import { FTAInput, FTALineButton } from '@src/components/service/atoms';
import FTADropdown from '@src/components/service/molecules/FTADropdown';
import FTADropdownMult from '@src/components/service/molecules/FTADropdownMult';
import { useQueryParams } from '@src/hooks';
import { flex, font } from '@src/styles/variables';
import { CodeValue } from '@src/zustand/enumStore';

interface SearchContainerProps {
  /** dropdown multi에 사용 될 content 배열 */
  content: CodeValue[] | undefined;
  /** 키워드 사용 여부 (미사용 시 검색하는 부분은 없고, 날짜 선택하는 부분만 있음) */
  useKeyword?: boolean;
  /** 서브 필터 사용 여부 (사용시 필터 선택 추가됨) */
  hasSubFilter?: CodeValue[];
}

// NOTE API 명세서대로 했는데, searchKeywork가 오타인 것 같음 (searchKeyword로 수정해야 할 것 같음)
export interface SearchKeywords {
  searchType?: string[];
  searchKeywork?: string;
  subFilter?: CodeValue;
  date?: [Date | null, Date | null];
}

// NOTE searchType이 API 명세서에 string type으로만 되어 있어서 ,로 구분되도록 함
export interface SearchKeywordParams extends Pick<SearchKeywords, 'searchKeywork'> {
  searchType?: string;
  searchStartDate?: string;
  searchEndDate?: string;
  subFilter?: string;
  content?: CodeValue[];
}

const Container = styled(Div)`
  padding: 8px 0; // NOTE 디자인 상에는 위 아래 합이 17px이지만, 균등하게 하기 위해 각각 8px로 설정함
  border: 1px solid ${({ theme }) => theme.colors.gray03};
  border-left: none;
  border-right: none;
`;

const SearchBox = styled(Div)`
  --default-height: 40px;
  height: var(--default-height);

  ${flex({ justify: 'space-between' })};
`;

const KeywordBox = styled(Div)`
  ${flex({})};
  height: 100%;
`;

const SearchContainerDropdownMulti = styled(FTADropdownMult<SearchKeywords>).attrs({
  size: 'small',
  line: 'false',
})`
  margin-right: 12px;
`;
const SearchContainerSubDropdown = styled(FTADropdown).attrs({
  size: 'small',
  line: 'false',
})`
  margin-right: 12px;
`;

const KeywordInput = styled(FTAInput<SearchKeywords>)`
  height: var(--default-height);
  border-color: #dbd7d4;
`;

const KeywordSearchButton = styled(FTALineButton)`
  ${font({ size: '14px' })};
  width: 60px;
  height: var(--default-height);
  padding: 10px 0;
  border-width: 1px;
`;

const SearchContainerCalendar = styled(RangeCalendar)`
  height: var(--default-height);
`;

const SearchContainer = ({ content = [], useKeyword = true, hasSubFilter }: SearchContainerProps) => {
  const { getQueryParam, setQueryParam } = useQueryParams<SearchKeywordParams>();
  const { handleSubmit, resetField } = useFormContext();

  const handleTableSearchClick: SubmitHandler<SearchKeywords> = ({ searchType, searchKeywork }) => {
    setQueryParam('searchType', searchType?.join(',') ?? '');
    setQueryParam('searchKeywork', searchKeywork ?? '');
  };

  useEffect(() => {
    const searchType = getQueryParam('searchType');
    const searchKeywork = getQueryParam('searchKeywork');
    const subFilter = getQueryParam('subFilter');
    if (searchType) {
      resetField('searchType', {
        defaultValue: searchType.split(','),
      });
    }

    if (searchKeywork) {
      resetField('searchKeywork', {
        defaultValue: searchKeywork,
      });
    }
    if (subFilter && hasSubFilter) {
      const currentSubFilter = hasSubFilter.find((item) => item.code === subFilter);
      resetField('subFilter', {
        defaultValue: currentSubFilter,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <SearchBox>
        {useKeyword && (
          <KeywordBox forwardedAs='form' onSubmit={handleSubmit(handleTableSearchClick)}>
            <SearchContainerDropdownMulti name='searchType' placeholder='필터 선택' content={content} />
            {hasSubFilter && <SearchContainerSubDropdown name='subFilter' content={hasSubFilter} hasDefaultValue />}
            <KeywordInput name='searchKeywork' placeholder='검색어를 입력해주세요.' />
            <KeywordSearchButton>검색</KeywordSearchButton>
          </KeywordBox>
        )}
        <SearchContainerCalendar name='date' />
      </SearchBox>
    </Container>
  );
};

export default SearchContainer;
