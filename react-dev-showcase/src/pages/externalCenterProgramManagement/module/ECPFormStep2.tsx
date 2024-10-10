/** 외부 센터프로그램 관리 > 프로그램 구성 > 등록 (세션 정보)*/
import { useFieldArray, useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { Button, Div, FtHfDropdown, Text } from '@src/components';
import { FTACheckbox, FTAInput, FTALineButton } from '@src/components/service/atoms';
import { flex, font, grid, size } from '@src/styles/variables';

interface StepProps {
  step: number;
  onNext: () => void;
  onPrev: () => void;
}

interface FormValues {
  sessions: {
    sessionName: string;
    sessionInfo: string;
    daySelect: string;
    period: number;
  }[];
}

const SectionTitleWraper = styled(Div)`
  ${flex({ align: 'start', direction: 'column' })}
  margin-bottom: 40px;

  &:after {
    content: '';
    ${size({ w: '2px', h: '100%' })}
    background-color: ${({ theme }) => theme.colors.gray07};
  }
`;

const SectionTitle = styled(Text)`
  ${font({ size: '22px', weight: '700' })}
  color: ${({ theme }) => theme.colors.gray10};
  padding-top: 20px;
  padding-bottom: 20px;
`;

const Container = styled(Div)`
  padding: 20px;
`;

const SessionTitle = styled(Div)`
  ${font({ weight: '700' })}
  ${grid({ columns: 'minmax(140px, 1fr) 15fr', gap: '20px', align: 'center' })}
  border-top: 1px solid ${({ theme }) => theme.colors.gray04};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray04};
  padding: 20px;
`;

const GridBox = styled(Div)`
  ${grid({ columns: 'minmax(140px, 1fr) 15fr', gap: '20px', align: 'center' })}
  padding: 24px 0;
  padding-bottom: 24px;
`;

const FlexContainer = styled(Div)`
  ${flex({ justify: 'flex-start' })};
  padding: 20px 0;
`;

const ItemTitle = styled.div<{ $isRequired: boolean }>`
  ${font({ size: '15px', weight: '800' })}
`;

const ButtonContainer = styled(Div)`
  ${flex({})}
`;

const SessionButtonContainer = styled(Div)`
  ${font({ size: '15px', weight: '800' })}
  ${flex({})}
  padding: 20px;
`;

const ExtendsFtaInput = styled(FTAInput)`
  border: 1px solid ${({ theme }) => theme.colors.gray11};
`;

const ECPFormStep2 = ({ onPrev, onNext }: StepProps) => {
  const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];

  const { control, handleSubmit } = useFormContext<FormValues>();

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'sessions' as const,
  });

  const onSubmit = (data: FormValues) => {
    console.log('data :: ', data);
    // FIXME 저장
    onNext();
  };

  const handleAddSession = () => {
    append({ sessionName: '', sessionInfo: '', daySelect: '', period: 0 });
  };

  const handleMoveSessionUp = (order: number) => {
    move(order, order - 1);
  };

  const handleMoveSessionDown = (order: number) => {
    move(order, order + 1);
  };

  const handleRemoveSession = (order: number) => {
    remove(order);
  };

  return (
    <div>
      <SectionTitleWraper>
        <SectionTitle>세션 정보</SectionTitle>
      </SectionTitleWraper>
      <Container>
        {fields.map((field, index) => (
          <div key={field.id}>
            <SessionTitle>세션 {index + 1}</SessionTitle>
            <GridBox>
              <ItemTitle $isRequired={true}>세션명</ItemTitle>
              <ExtendsFtaInput
                name={`sessions.${index}.sessionName`}
                placeholder='소개글을 입력해주세요'
                maxLength={1000}
              />
            </GridBox>
            <GridBox>
              <ItemTitle $isRequired={true}>설명</ItemTitle>
              <ExtendsFtaInput
                name={`sessions.${index}.sessionInfo`}
                placeholder='소개글을 입력해주세요'
                maxLength={1000}
              />
            </GridBox>
            <GridBox>
              <ItemTitle $isRequired={true}>세션 기간 및 요일 선택</ItemTitle>
              {/* FIXME 유효성 검사 필요 선택 안하고 넘어가면 에러*/}
              <Div>
                <FtHfDropdown
                  name={`sessions.${index}.period`}
                  line='true'
                  size='large'
                  content={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']}
                  placeholder='기간 선택'
                />
                <FlexContainer>
                  {daysOfWeek.map((day) => (
                    <FTACheckbox key={`sessions.${index}.daySelect.${day}`} name={`sessions.${index}.daySelect.${day}`}>
                      {day}
                    </FTACheckbox>
                  ))}
                </FlexContainer>
              </Div>
            </GridBox>
            <SessionButtonContainer>
              {index === fields.length - 1 && <Button onClick={handleAddSession}>추가</Button>}
              <Button onClick={() => handleRemoveSession(index)}>삭제</Button>
              {index > 0 && (
                <Button
                  onClick={() => {
                    handleMoveSessionUp(index);
                  }}
                >
                  위로 이동
                </Button>
              )}
              {index < fields.length - 1 && (
                <Button
                  onClick={() => {
                    handleMoveSessionDown(index);
                  }}
                >
                  아래로 이동
                </Button>
              )}
            </SessionButtonContainer>
          </div>
        ))}
      </Container>
      <ButtonContainer>
        <FTALineButton onClick={onPrev}>이전</FTALineButton>
        <FTALineButton onClick={handleSubmit(onSubmit)}>다음</FTALineButton>
      </ButtonContainer>
    </div>
  );
};

export default ECPFormStep2;
