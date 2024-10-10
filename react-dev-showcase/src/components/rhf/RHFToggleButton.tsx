import { FieldValues, Path, PathValue, RegisterOptions, UseControllerProps, useController } from 'react-hook-form';

import { ToggleButton } from '@components/molecules';

// NOTE: 헬퍼타입 정의
// (PathValue<T, K>)이 boolean인 경로만을 선택.
// BooleanPath<T>는 T의 boolean 타입 필드에 해당하는 경로들의 유니언 타입이 됨.
// [Path<T>] : 위에서 연산된 경로들의 집합에서 'never'가 아닌 경로들만 선택해서 최종 반환
type BooleanPath<T extends FieldValues> = {
  [K in Path<T>]: PathValue<T, K> extends boolean ? K : never;
}[Path<T>];

export interface RHFToggleButtonProps<T extends FieldValues> extends UseControllerProps<T, BooleanPath<T>> {
  name: BooleanPath<T>;
  options?: RegisterOptions<T, BooleanPath<T>>;
}

const RHFToggleButton = <T extends FieldValues>({ name, rules, defaultValue, ...rest }: RHFToggleButtonProps<T>) => {
  const {
    field: { value, onChange, ...field },
  } = useController<T, BooleanPath<T>>({
    name,
    rules,
    defaultValue,
  });

  const handleClick = () => {
    onChange(!value);
  };

  return <ToggleButton {...rest} toggleState={value} onChange={handleClick} {...field} />;
};

RHFToggleButton.displayName = 'RHFToggleButton';
export default RHFToggleButton;
