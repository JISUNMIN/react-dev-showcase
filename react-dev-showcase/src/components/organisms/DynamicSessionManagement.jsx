import { useCallback } from 'react';

import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import styled, { css } from 'styled-components';

import { Button, Div } from '@components/index';

import GridSessionLayout from '../GridLayout/GridSessionLayout';

const ButtonContainer = styled(Div)`
  display: flex;
  align-items: center;

  button + button {
    ::before {
      content: '';
      width: 1px;
      height: 16px;
      background-color: rgba(229, 229, 229, 1);
      margin-right: 10px;
      margin-left: -10px;
    }
  }
`;

const buttonCss = css`
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
`;

const LIMIT_SESSION = 3;

const DynamicSessionManagement = ({ initialSession, exerciseInfo, setExerciseInfo, sessionOrder, setSessionOrder }) => {
  /* edit이면 api 받아온 세션순서 아니면 [1] */
  // const [sessionsOrder, setSessionOrder] = useState([api 받아온 세션 순서]);
  const { unregister } = useFormContext();

  const handleAddSession = useCallback(() => {
    if (exerciseInfo.length >= LIMIT_SESSION) {
      return;
    }

    setSessionOrder((prevSessionOrder) => {
      // 현재 sessionOrder에서 사용 중인 세션 번호들
      const usedSessionNumbers = new Set(prevSessionOrder);

      // 가능한 세션 번호 후보 중 최소값 찾기 (1, 2, 3 중)
      let newSessionNumber = 1;
      while (usedSessionNumbers.has(newSessionNumber)) {
        newSessionNumber += 1;
        if (newSessionNumber > 3) {
          newSessionNumber = 1; // 세션 번호가 1, 2, 3 중 하나로 유지되도록 보장
        }
      }

      setExerciseInfo((prev) => {
        const newSession = initialSession(newSessionNumber);
        const updatedExerciseInfo = [...prev, newSession];
        return updatedExerciseInfo;
      });

      return [...prevSessionOrder, newSessionNumber];
    });
  }, [initialSession, sessionOrder, exerciseInfo]);

  const handleMoveUp = (index) => {
    if (index > 0) {
      const updatedInfo = [...exerciseInfo];
      const temp = updatedInfo[index];
      updatedInfo[index] = updatedInfo[index - 1];
      updatedInfo[index - 1] = temp;
      setExerciseInfo(updatedInfo);

      const updateOrder = [...sessionOrder];
      const tempOrder = updateOrder[index];
      updateOrder[index] = updateOrder[index - 1];
      updateOrder[index - 1] = tempOrder;
      setSessionOrder(updateOrder);
    }
  };

  const handleMoveDown = (index) => {
    if (index < exerciseInfo.length - 1) {
      const updatedInfo = [...exerciseInfo];
      const temp = updatedInfo[index];
      updatedInfo[index] = updatedInfo[index + 1];
      updatedInfo[index + 1] = temp;
      setExerciseInfo(updatedInfo);

      const updateOrder = [...sessionOrder];
      const tempOrder = updateOrder[index];
      updateOrder[index] = updateOrder[index + 1];
      updateOrder[index + 1] = tempOrder;
      setSessionOrder(updateOrder);
    }
  };

  const handleDeleteSession = useCallback(
    (index) => {
      setExerciseInfo((prev) => {
        const updatedExerciseInfo = prev.filter((_, idx) => idx !== index);

        return updatedExerciseInfo;
      });
      setSessionOrder((prevSessionOrder) => {
        const updatedSessionOrder = prevSessionOrder.filter((_, idx) => idx !== index);
        return updatedSessionOrder;
      });
      unregister(`sessions.${[index + 1]}`);
    },
    [initialSession]
  );

  const buttonGroup = (index) => {
    if (!exerciseInfo) {
      return null;
    }

    const canDeleteItem = exerciseInfo.length > 1 && exerciseInfo.length !== index;
    const canMoveDownItem = exerciseInfo.length > 1 && exerciseInfo.length !== index + 1;
    const canMoveUpItem = index > 0;
    const canAddSession = exerciseInfo.length === index + 1 && exerciseInfo.length < LIMIT_SESSION;

    return (
      <ButtonContainer>
        {canDeleteItem && (
          <Button classes={{ Button: buttonCss }} onClick={() => handleDeleteSession(index)}>
            삭제
          </Button>
        )}
        {canMoveDownItem && (
          <Button classes={{ Button: buttonCss }} onClick={() => handleMoveDown(index)}>
            아래로 이동
          </Button>
        )}
        {canMoveUpItem && (
          <Button classes={{ Button: buttonCss }} onClick={() => handleMoveUp(index)}>
            위로 이동
          </Button>
        )}
        {canAddSession && (
          <Button classes={{ Button: buttonCss }} onClick={handleAddSession}>
            세션 추가
          </Button>
        )}
      </ButtonContainer>
    );
  };

  /*
  useEffect(() => {
  
   // call api for program detail and session list
    }, [])
  
  */

  return <GridSessionLayout data={exerciseInfo} buttonGroup={buttonGroup} />;
};

DynamicSessionManagement.propTypes = {
  /* 세션 만들어주는 함수 */
  initialSession: PropTypes.func.isRequired,
  /* 세션 배열 */
  exerciseInfo: PropTypes.arrayOf(
    PropTypes.shape({
      dynamicItems: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          content: PropTypes.object.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  /* 세션을 set해주는 함수 */
  setExerciseInfo: PropTypes.func.isRequired,
  /* 세션 순서 배열 */
  sessionOrder: PropTypes.array.isRequired,
  /* 세션 순서 배열을 set 해주는 함수 */
  setSessionOrder: PropTypes.func.isRequired,
};
export default DynamicSessionManagement;
