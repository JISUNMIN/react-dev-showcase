import { useCallback, useEffect, useRef } from 'react';

import { useFieldArray } from 'react-hook-form';
import styled from 'styled-components';

import { Div } from '@src/components/atoms';
import { FTADropdown } from '@src/components/service/molecules';
import { useQueryParams } from '@src/hooks';
import { flex } from '@src/styles/variables';
import { CodeValue } from '@src/zustand/enumStore';

import ClosableChip from './ClosableChip';

export interface ChipProps {
  name: string;
  fieldArrayName: string;
  placeholder: string;
  maxContent?: number;
  content: CodeValue[];
}

interface FieldQueryParams {
  [name: string]: string;
}

type FieldType = {
  id: string;
  code: string;
  value: string;
};

const Wrapper = styled(Div)`
  ${flex({ gap: '12px' })}
`;

const ChipItem = styled(Div)`
  ${flex({ gap: '8px' })}
  margin-top: 10px;
`;

const FilterChip = ({ name, fieldArrayName, placeholder, maxContent = 20, content }: ChipProps) => {
  const { getQueryParam, setQueryParam, deleteParam } = useQueryParams<FieldQueryParams>();
  const { fields, append, remove, replace } = useFieldArray({ name: fieldArrayName });
  const isUpdatingFromURL = useRef(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const addChip = useCallback(
    (chip: CodeValue) => {
      if (!chip) return;

      const isDuplicate = fields.some((field) => (field as FieldType).code === chip.code);

      if (isDuplicate) return;

      if (fields.length >= maxContent) {
        alert(`${maxContent}개를 초과하여 추가할 수 없습니다.`);
        return;
      }
      append(chip);
    },
    [fields, append, maxContent]
  );

  const removeChip = (index: number) => {
    remove(index);

    if (fields.length === 1) {
      deleteParam(fieldArrayName);
    }
  };

  const handleOnChange = useCallback(
    (chip: CodeValue) => {
      addChip(chip);
    },
    [addChip]
  );

  useEffect(() => {
    const handleURLChange = () => {
      const preSelectedChipsParams = getQueryParam(fieldArrayName);
      const preSelectedChips = preSelectedChipsParams?.split(',').filter(Boolean);

      if (preSelectedChips && preSelectedChips.length > 0) {
        const newFields = preSelectedChips.map((code) => {
          const matchingContent = content.find((item) => item.code === code);
          return matchingContent || { code, value: code };
        });

        isUpdatingFromURL.current = true;
        replace(newFields);
      } else {
        isUpdatingFromURL.current = true;
        replace([]);
      }
    };

    handleURLChange();

    window.addEventListener('popstate', handleURLChange);

    return () => {
      window.removeEventListener('popstate', handleURLChange);
    };
  }, [getQueryParam, fieldArrayName, content, replace]);

  useEffect(() => {
    if (!isUpdatingFromURL.current) {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        const newParams = fields.map((field) => (field as FieldType).code).join(',');
        if (newParams !== '') {
          setQueryParam(fieldArrayName, newParams, true);
        }
      }, 0);
    } else {
      isUpdatingFromURL.current = false;
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [fields, setQueryParam, fieldArrayName]);

  return (
    <Wrapper>
      <FTADropdown name={name} content={content} placeholder={placeholder} onChange={handleOnChange} hasDefaultValue />
      <ChipItem>
        {fields?.map((field, index) => (
          <ClosableChip key={field.id} text={(field as FieldType).value} handleRemove={() => removeChip(index)} />
        ))}
      </ChipItem>
    </Wrapper>
  );
};

export default FilterChip;
