import React, { useCallback, useMemo, useState } from 'react';

import { FieldValues, Path, useController, useFormContext } from 'react-hook-form';
import styled, { CSSObject, css } from 'styled-components';

import { Div } from '../atoms';

const HasScrollStyle = css`
  overflow-y: auto;
`;

const StyledContainer = styled(Div)`
  ${({ classes }) => classes && classes.StyledContainer}
`;

const LabelContainer = styled(Div)`
  ${({ classes }) => classes && classes.LaybelContainer}
`;

const OptionList = styled.ul<{ isShow?: boolean; disabled?: boolean; hasScroll?: boolean; classes?: CSSObject }>`
  ${({ isShow }) => isShow && `display:block;`}
  ${({ classes }) => classes && classes.OptionList}
  ${({ disabled }) => disabled && `display: none !important; height: 0px !important;`}
  ${({ hasScroll }) => hasScroll && HasScrollStyle};
`;

const OptionItem = styled.li<{ hasScroll?: boolean; classes?: CSSObject }>`
  ${({ classes }) => classes && classes.OptionItem}
  ${({ hasScroll }) => hasScroll && ` border-right: 0px`}
`;

export interface Option {
  id: string;
  title: string;
}

export interface SelectBoxProps<T extends FieldValues> {
  name: Path<T>;
  /** 값 선택 필수 유무 */
  required?: boolean;
  /** Disabled 여부 */
  disabled?: boolean;
  /** Scroll 존재 유무 */
  hasScroll?: boolean;
  /** SelectBox의 목록 (list)값이 있는 Object */
  options: {
    list: Option[];
  };
  /** SelectBox의 초기 label(guide) */
  guideLabel?: string;
  /** 커스텀 스타일 오브젝트 */
  classes?: {
    StyledContainer?: string;
    LabelContainer?: string;
    OptionList?: string;
    OptionItem?: string;
  };
  selectValue?: (item: Option) => void;
}

const SelectBox = <T extends FieldValues>({
  name,
  required,
  disabled,
  hasScroll = false,
  options,
  guideLabel,
  classes,
  selectValue,
  ...rest
}: SelectBoxProps<T>) => {
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isShow, setIsShow] = useState<boolean>(false);
  const { control } = useFormContext<T>();
  const { field } = useController({
    name,
    control,
    rules: {
      required,
    },
  });

  const label = useMemo(() => {
    const defaultLabel = guideLabel ?? options?.list[0]?.title;

    if (currentIndex === -1) {
      return defaultLabel;
    }

    return options?.list[currentIndex]?.title;
  }, [currentIndex, guideLabel, options.list]);

  const onSelectBoxClick: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
    setIsShow((prev) => !prev);
  }, []);

  const onOptionClick = useCallback(
    (item: Option) => {
      field.onChange(item.id);
      selectValue && selectValue(item);

      if (options.list && field.value) {
        const index = options.list.findIndex(({ id }) => id === item.id);
        setCurrentIndex(index);
      }
    },
    [field, selectValue, options]
  );

  return (
    <StyledContainer onClick={onSelectBoxClick} classes={classes} {...rest}>
      <LabelContainer classes={classes}>
        <div>{label}</div>
      </LabelContainer>
      {isShow && (
        <OptionList isShow={isShow} hasScroll={hasScroll} classes={classes}>
          {!disabled &&
            options?.list.map((item, index) => (
              <OptionItem key={`${item.id}-${index}`} onClick={() => onOptionClick(item)} classes={classes}>
                {item.title}
              </OptionItem>
            ))}
        </OptionList>
      )}
    </StyledContainer>
  );
};

SelectBox.displayName = 'SelectBox';

export default SelectBox;
