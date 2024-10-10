import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useController, useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { arrowIcon, refreshIcon } from '@src/assets/images';
import { Checkbox, Div, Icon, Span } from '@src/components/atoms';
import { SearchKeywordParams } from '@src/components/service/molecules/table/modules/SearchContainer';
import { useQueryParams } from '@src/hooks';
import { flex, font } from '@src/styles/variables';
import { CodeValue } from '@src/zustand/enumStore';

type Size = 'small' | 'medium' | 'large';

const widthMap: Record<Size, string> = {
  small: '120px',
  medium: '160px',
  large: '200px',
};
interface DropdownMult {
  name: string;
  children?: ReactNode;
  content?: CodeValue[];
  disabled?: boolean;
  size?: Size;
  line?: string;
  placeholder?: string;
  onChange?: (value: string[]) => void;
}

interface DropdownContainer {
  disabled?: boolean;
  size: Size;
}
interface DropdownButton {
  expanded?: string;
  size?: Size;
  selected?: boolean;
  line?: string;
}
interface DropdownExpanded {
  expanded?: string;
}
interface DropdownItemProps {
  onClick?: (event: MouseEvent) => void;
  selected?: boolean;
}

interface DropdownMultParams {
  [key: string]: string;
}

const DropdownContainer = styled(Div)<DropdownContainer>`
  position: relative;
  display: inline-block;
  width: ${({ size }) => widthMap[size] ?? widthMap.medium};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

const DropdownButton = styled(Div)<DropdownButton>`
  ${flex({ justify: 'space-between', gap: '6px' })};
  ${({ size }) => font(size === 'small' ? { size: '12px' } : { size: '14px' })}
  background-color: ${({ selected, theme }) => (selected ? theme.colors.hover01 : theme.colors.gray01)};
  width: 100%;
  height: 100%;
  padding: 12px;
  border-radius: 4px;
  border: ${({ line, theme }) => (line === 'true' ? `1px solid ${theme.colors.gray05}` : 'none')};
  &:hover {
    background-color: ${({ theme }) => theme.colors.hover02};
  }
`;

const DropdownList = styled.ul<DropdownExpanded>`
  position: absolute;
  z-index: 999;
  width: 100%;
  overflow: hidden;
  border: ${({ theme }) => `1px solid ${theme.colors.gray03}`};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.gray01};

  transition:
    max-height 0.3s ease-out,
    visibility 0.3s ease-out,
    opacity 0.3s ease-out;

  ${({ expanded }) =>
    expanded === 'true'
      ? `
      visibility: visible;
      opacity: 1;
    `
      : `
      max-height: 0px;
      visibility: hidden;
      opacity: 0;
    `}
`;

const DropdownItem = styled.li<DropdownItemProps>`
  ${flex({ gap: '10px', justify: 'start' })}
  padding: 10px 8px;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${({ selected, theme }) => (selected ? theme.colors.brown01 : 'transparent')};

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover01};
  }
`;

const DropdownArrow = styled(Span)<DropdownExpanded>`
  transition: transform 0.3s ease;
  transform: ${({ expanded }) => (expanded === 'true' ? 'rotate(270deg)' : 'rotate(90deg)')};
`;

const ResetFilterItem = styled.li`
  ${flex({ gap: '10px', justify: 'start' })}
  padding: 10px 8px;
  border-top: ${({ theme }) => `1px solid ${theme.colors.gray03}`};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover01};
  }
`;

const ArrowIcon = styled(Icon)`
  width: 18px;
  aspect-ratio: 1;
`;

const RefreshFilterIcon = styled(Icon)`
  width: 12px;
  aspect-ratio: 1;
`;

const DropdownMult = ({
  name,
  content,
  disabled,
  size = 'medium',
  line = 'true',
  placeholder = 'Select',
}: DropdownMult) => {
  const [expanded, setExpanded] = useState('false');

  const dropdownToggleRef = useRef<HTMLDivElement>(null);
  const dropdownListRef = useRef<HTMLUListElement>(null);

  const { getQueryParam, setQueryParam, deleteParam } = useQueryParams<DropdownMultParams>();
  // const searchParams = getAllQueryParams();
  const { control } = useFormContext();
  const { field } = useController({
    name,
    control,
  });

  const handleChange = useCallback(
    (value: string) => {
      const prev: string[] = field.value || [];
      let updatedValue: string[];

      if (prev.includes(value)) {
        updatedValue = prev.filter((item) => item !== value);
      } else {
        updatedValue = [...prev, value];
      }

      field.onChange(updatedValue);

      if (updatedValue.length === 0) {
        deleteParam(name);
      } else {
        setQueryParam(name as keyof SearchKeywordParams, updatedValue.join(','));
      }
    },
    [name, field, deleteParam, setQueryParam]
  );

  const handleToggleDropdown = useCallback(() => {
    if (!disabled) {
      setExpanded((prev) => (prev === 'true' ? 'false' : 'true'));
    }
  }, [disabled]);

  const handleResetFilters = useCallback(() => {
    field.onChange([]);
    deleteParam(name);
    dropdownListRef?.current?.childNodes.forEach((node) => {
      const checkbox = node.childNodes[0].childNodes[0];
      if (checkbox && checkbox instanceof HTMLInputElement) checkbox.checked = false;
    });
  }, [name, deleteParam, field]);

  const renderButtonLabel = useMemo(() => {
    if (field.value?.length) {
      if (field.value.length === 0) return placeholder;
      if (field.value.length === 1) return field.value[0];
      return `${field.value[0]} 외 ${field.value.length - 1}개`;
    } else {
      return placeholder;
    }
  }, [field, placeholder]);

  const updateCheckboxes = useCallback((selectedValues: string | string[] | undefined) => {
    if (dropdownListRef.current) {
      dropdownListRef.current.childNodes.forEach((node) => {
        const checkbox = node.childNodes[0].childNodes[0];
        if (checkbox && checkbox instanceof HTMLInputElement) {
          checkbox.checked = selectedValues?.includes(checkbox.name) || false;
        }
      });
    }
  }, []);

  const handleListItem = useCallback((event: MouseEvent | null, item: string) => {
    if (event && event.target instanceof HTMLElement) {
      if (event.target.tagName === 'LI') {
        let childCheckbox: HTMLInputElement | null = null;
        dropdownListRef?.current?.childNodes.forEach((node) => {
          const checkbox = node.childNodes[0].childNodes[0];
          if (checkbox && checkbox instanceof HTMLInputElement && checkbox?.name === item) {
            childCheckbox = checkbox;
            childCheckbox?.click();
          }
        });
      }
    }
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const dropdownMenuList = dropdownListRef.current;
    const dropdownToggle = dropdownToggleRef.current;

    const isOutsideClick =
      dropdownMenuList &&
      !dropdownMenuList.contains(event.target as Node) &&
      !dropdownToggle?.contains(event.target as Node);

    if (isOutsideClick) {
      dropdownToggle?.setAttribute('aria-expanded', 'false');
      setExpanded('false');
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    const targetParam = getQueryParam(name as keyof SearchKeywordParams);
    const fieldString = field?.value?.join(',');

    if (fieldString !== targetParam) {
      const value = targetParam?.split(',').filter(Boolean);
      field.onChange(value);
      updateCheckboxes(value);
    }
  }, [field, name, getQueryParam]);

  return (
    <DropdownContainer disabled={disabled} size={size}>
      <DropdownButton
        ref={dropdownToggleRef}
        onClick={handleToggleDropdown}
        expanded={expanded}
        line={line}
        size={size}
        selected={field.value?.length > 0}
      >
        {renderButtonLabel}
        <DropdownArrow expanded={expanded}>
          <ArrowIcon icon={arrowIcon} />
        </DropdownArrow>
      </DropdownButton>
      <DropdownList ref={dropdownListRef} expanded={expanded}>
        {content?.map((option, index) => (
          <DropdownItem
            key={`${option.code}${index}`}
            onClick={(event: MouseEvent) => handleListItem(event, option.value)}
            selected={field.value?.includes(option.value)}
          >
            <Checkbox name={option.value} onChange={() => handleChange(option.value)}>
              {option.value}
            </Checkbox>
          </DropdownItem>
        ))}
        <ResetFilterItem onClick={handleResetFilters}>
          <RefreshFilterIcon icon={refreshIcon} />
          필터 초기화
        </ResetFilterItem>
      </DropdownList>
    </DropdownContainer>
  );
};

export default DropdownMult;
