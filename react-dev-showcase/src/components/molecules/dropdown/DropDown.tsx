import {
  Dispatch,
  HTMLProps,
  SetStateAction,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuButton } from '@mui/base/MenuButton';
import { MenuItem } from '@mui/base/MenuItem';
import { CssTransition } from '@mui/base/Transitions';
import { PopupContext } from '@mui/base/Unstable_Popup';
import { useController, useFormContext } from 'react-hook-form';
import styled, { RuleSet, css } from 'styled-components';

import { arrowIcon } from '@src/assets/images';
import { Div, Icon, Span } from '@src/components';
import { useQueryParams } from '@src/hooks';
import { flex, font } from '@src/styles/variables';
import { CodeValue } from '@src/zustand/enumStore';

type Size = 'small' | 'medium' | 'large';
// eslint-disable-next-line react-refresh/only-export-components
const widthMap: Record<Size, string> = {
  small: '120px',
  medium: '160px',
  large: '200px',
};

interface DropDownProps {
  name: string;
  content: CodeValue[];
  classes?: {
    MenuToggle?: string | RuleSet<object>;
    Menu?: string | RuleSet<object>;
    MenuItem?: string | RuleSet<object>;
  };
  disabled?: boolean;
  /** dropdown의 width를 결정 */
  size?: Size;
  height?: string;
  /** dropdown border 여부를 결정함 'true' | 'false' */
  line?: string;
  placeholder?: string;
  /** dropdown 특정 항목이 선택될 때 추가 작업을 위한 함수 */
  dropDownFunc?: (item: CodeValue) => void;
  /** dropdown value 값 전달 */
  onChange?: (value: CodeValue) => void;
  /** 선택된 항목의 index를 부모에서 사용하기 위한 set함수*/
  setCheckedIndex?: Dispatch<SetStateAction<number | null>>;
  /**
   * 특정 기본 값을 정의할 때 사용
   *
   * e.g. query string을 초기 상태에 반영할 때 사용
   */
  initialValueIndex?: number;
  /** Dropdown {}..rest}에 딸려 들어가지 않도록 구조분해 할당하여 rest에서 분리시킴 */
  className?: string;
  /** 기본으로 셋업된 값이 있는 경우 EX) page size 등 */
  hasDefaultValue?: boolean;
}
interface DropdownButton {
  expanded?: string;
  size: Size;
  height?: string;
  selected?: boolean;
  line?: string;
  hasDefaultValue?: boolean;
  onClick?: () => void;
}
interface DropdownExpanded {
  expanded?: string;
}
interface DropdownItemProps {
  onClick?: (event: MouseEvent) => void;
  selected?: boolean;
}
interface DropdownParams {
  [key: string]: string;
}

const expandedCss = css`
  visibility: visible;
  opacity: 1;
`;

const collapsedCss = css`
  max-height: 0px;
  visibility: hidden;
  opacity: 0;
`;

const DropDownToggle = styled(MenuButton)<DropdownButton>`
  ${flex({ justify: 'space-between' })};

  width: ${({ size }) => widthMap[size] ?? widthMap.medium};
  height: ${({ height }) => height ?? '60px'};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  border: ${({ line, theme }) => (line === 'true' ? `1px solid ${theme.colors.gray05}` : 'none')};
  border-radius: 4px;
  background-color: ${({ selected, theme }) => (selected ? theme.colors.hover01 : theme.colors.gray01)};
  ${font({ size: '14px' })}
  padding: 12px;
  ${({ className }) => className && className}
`;

const DropDownToggleExpand = styled(Div)``;

const DropdownMenuList = styled(Menu)<DropdownExpanded>`
  padding: 10px;
  z-index: 10;
  overflow: hidden;
  width: ${({ width }) => (width ? `${width}px` : 'auto')};
  border: ${({ theme }) => `1px solid ${theme.colors.gray03}`};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.gray01};

  transition:
    max-height 0.3s ease-out,
    visibility 0.3s ease-out,
    opacity 0.3s ease-out;

  ${({ expanded }) => (expanded === 'true' ? expandedCss : collapsedCss)}

  .closed {
    opacity: 0;
    pointer-events: none;
  }
  .open {
    opacity: 1;
    li {
      cursor: pointer;
    }
  }

  ${({ className }) => className && className}
`;

const DropdownMenuItem = styled(MenuItem)<DropdownItemProps>`
  ${flex({ gap: '10px', justify: 'start' })}
  padding: 10px 8px;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${({ selected, hasDefaultValue, theme }) =>
    !hasDefaultValue && selected ? theme.colors.brown01 : 'transparent'};

  &:not(:last-of-type) {
    padding-bottom: 15px;
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.hover01};
  }

  ${({ className }) => className && className}
`;

const DropdownArrow = styled(Span)<DropdownExpanded>`
  transition: transform 0.3s ease;
  transform: ${({ expanded }) => (expanded === 'true' ? 'rotate(270deg)' : 'rotate(90deg)')};
`;

const ArrowIcon = styled(Icon)`
  width: 18px;
  aspect-ratio: 1;
`;

interface ListboxProps extends Omit<HTMLProps<HTMLUListElement>, 'ownerState'> {
  ownerState: {
    expanded?: string;
  };
}

const Listbox = forwardRef<HTMLUListElement, ListboxProps>((props, ref) => {
  const popupContext = useContext(PopupContext);
  const { ownerState, ...rest } = props;

  if (popupContext == null) {
    throw new Error('The `Listbox` component cannot be rendered outside a `Popup` component');
  }

  return (
    <CssTransition
      enterClassName={ownerState.expanded === 'true' ? 'open' : ''}
      exitClassName={ownerState.expanded === 'false' ? 'closed' : ''}
    >
      <ul {...rest} ref={ref} />
    </CssTransition>
  );
});
const DropDown = ({
  name,
  content,
  classes,
  placeholder,
  dropDownFunc,
  onChange,
  disabled,
  size = 'medium',
  line = 'true',
  height,
  setCheckedIndex,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  className,
  hasDefaultValue,
  ...rest
}: DropDownProps) => {
  const DropDownToggleRef = useRef<HTMLButtonElement>(null);
  const DropdownMenuListRef = useRef<HTMLUListElement>(null);
  const [dropDownWidth, setDropDownWidth] = useState<number>(0);
  const [expanded, setExpanded] = useState('false');

  const { control } = useFormContext();
  const { field } = useController({
    name,
    control,
  });
  const { getQueryParam, getAllQueryParams, setQueryParam } = useQueryParams<DropdownParams>();
  const allParams = getAllQueryParams();

  const handleToggleDropdown = useCallback(() => {
    if (!disabled) {
      setExpanded((prev) => (prev === 'true' ? 'false' : 'true'));
    }
  }, [disabled]);

  const handleMenuItemClick = useCallback(
    (index: number, item: CodeValue) => {
      if (!onChange) {
        setCheckedIndex && setCheckedIndex(index);
        field.onChange(item);
        setQueryParam(name, item.code);
        setExpanded('false');
      } else {
        setCheckedIndex && setCheckedIndex(index);

        setExpanded('false');
        onChange && onChange(item);
      }
    },
    [onChange, dropDownFunc, setCheckedIndex, allParams, name]
  );

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const dropdownMenuList = DropdownMenuListRef.current;
    const dropdownToggle = DropDownToggleRef.current;

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
    if (DropDownToggleRef.current) {
      setDropDownWidth(DropDownToggleRef.current.clientWidth);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const isFirstRender = useRef(true);

  useEffect(() => {
    const currentField = field?.value;

    if (isFirstRender.current) {
      const targetParam = getQueryParam(name);
      const fieldString = currentField?.value;
      if (targetParam && fieldString !== targetParam) {
        const target = content.find((item) => item.code === targetParam);
        const targetIndex = content.findIndex((item) => item.code === targetParam);
        setCheckedIndex && setCheckedIndex(targetIndex);
        field.onChange(target);
        isFirstRender.current = false;
      }
    }

    if (currentField?.code && currentField.code !== getQueryParam(name)) {
      const target = content.find((item) => item.code === getQueryParam(name));
      field.onChange(target);
    }
  }, [field]);

  return (
    <Dropdown {...rest}>
      <DropDownToggleExpand>
        <DropDownToggle
          onClick={handleToggleDropdown}
          ref={DropDownToggleRef}
          line={line}
          size={size}
          height={height}
          disabled={disabled}
          className={classes?.MenuToggle as string}
          hasDefaultValue={hasDefaultValue}
          selected={!hasDefaultValue && field?.value?.value?.length > 0}
        >
          {field?.value?.value ?? placeholder}
          <DropdownArrow expanded={expanded}>
            <ArrowIcon icon={arrowIcon} />
          </DropdownArrow>
        </DropDownToggle>
      </DropDownToggleExpand>

      <DropdownMenuList
        ref={DropdownMenuListRef}
        expanded={expanded}
        width={dropDownWidth}
        slots={{
          listbox: Listbox,
        }}
        className={classes?.Menu as string}
      >
        {content?.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => handleMenuItemClick(index, item)}
            className={classes?.MenuItem as string}
            selected={field?.value?.code === item.code}
          >
            {item.value}
          </DropdownMenuItem>
        ))}
      </DropdownMenuList>
    </Dropdown>
  );
};

export default DropDown;
