import { useFieldArray, useFormContext } from 'react-hook-form';
import styled, { RuleSet } from 'styled-components';

import { PlusIcon } from '@src/assets/images';
import { Div, Icon } from '@src/components/atoms';
import { RHFInput } from '@src/components/rhf';
import { absolute, flex, size } from '@src/styles/variables';

import ClosableChip from './ClosableChip';

export interface InputChipProps {
  /** Chip의 value를 위한 name */
  name: string;
  /** Input의 value를 위한 name */
  inputName: string;
  placeholder?: string;
  maxContent?: number;
  classes?: {
    FeatureInput?: RuleSet<object>;
  };
}

type FieldType = {
  id: string;
  value: string;
};

const Container = styled(Div)``;

const InputContainer = styled(Div)`
  position: relative;
  width: 300px;
`;
const FeatureInput = styled(RHFInput)<{ $classes: InputChipProps['classes'] }>`
  width: 100%;

  ${({ $classes }) => $classes && $classes.FeatureInput}
`;
const IconWrraper = styled(Div)`
  ${absolute({ right: '12px', top: '50%' })}
  transform: translateY(-50%);
`;
const FilteredChipList = styled(Div)`
  ${flex({ justify: 'start', gap: '8px' })}
  margin-top: 10px;
`;

const S = {
  Icon: styled(Icon)`
    ${size({ w: '18px', h: '18px' })}
    cursor: pointer;
  `,
};

const InputChip = ({
  name,
  inputName,
  maxContent = 20,
  placeholder = '특징을 추가해주세요.',
  classes,
  ...rest
}: InputChipProps) => {
  const { getValues, control, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  const addChip = () => {
    const currentFeature = getValues(inputName);

    if (!currentFeature) {
      alert('값을 입력하세요.');
      return;
    }

    if (maxContent === fields.length) {
      alert(`${maxContent}개를 초과하여 추가할 수 없습니다.`);
      return;
    }

    const isDuplicate = fields.some((field) => (field as FieldType).value === currentFeature);
    if (isDuplicate) {
      alert('이미 존재하는 값입니다.');
      return;
    }

    append({ value: currentFeature });
    setValue(inputName, '');
  };

  const removeChip = (index: number) => {
    remove(index);
  };

  return (
    <Container>
      <InputContainer {...rest}>
        <FeatureInput $classes={classes} type='text' name={inputName} placeholder={placeholder} />
        <IconWrraper onClick={addChip}>
          <S.Icon icon={PlusIcon} />
        </IconWrraper>
      </InputContainer>
      <FilteredChipList>
        {fields?.map((field, index) => (
          <ClosableChip key={field.id} text={(field as FieldType).value} handleRemove={() => removeChip(index)} />
        ))}
      </FilteredChipList>
    </Container>
  );
};

export default InputChip;
