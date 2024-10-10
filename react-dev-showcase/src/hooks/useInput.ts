import { ChangeEvent, useCallback, useState } from 'react';

export interface useInputProps {
  /** Input 공통 컴포넌트 사용 시 지정해주는 초기 value */
  initialValue?: string;
  /** Input 유효성 검사시 결과값을 반환하게 되는데, input값이 바뀌게 되면 이 결과값을 리셋 하기 위한 값 */
  handleChecked?: (checked: boolean) => void;
  /** Input의 값이 바꼈을때 부가적으로 수행해야하는 함수 */
  onChangefunc?: () => void;
}

const useInput = ({
  initialValue = '',
  handleChecked,
  onChangefunc,
}: useInputProps): [
  string,
  (e: React.ChangeEvent<HTMLElement>) => void,
  React.Dispatch<React.SetStateAction<string>>,
] => {
  const [value, setValue] = useState<string>(initialValue);

  const onChange = useCallback((e: ChangeEvent<HTMLElement>) => {
    const target = e.target as HTMLInputElement;

    setValue(target.value);
    handleChecked && handleChecked(false);

    onChangefunc && onChangefunc();
  }, []);

  return [value, onChange, setValue];
};

export default useInput;
