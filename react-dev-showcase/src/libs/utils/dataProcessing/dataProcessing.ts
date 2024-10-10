/** 데이터 자체를 처리하고 변환하는 데 중점을 두며, 보통 좀 더 복잡하고 큰 작업을 수행합니다.: .helpers(간단하고 반복적인 작업) 추후 필요 없을시 helpers로 통합할 예정 */

export const TIME_OPTIONS = () => {
  const options = [];
  for (let hour = 0; hour <= 23; hour += 1) {
    const timeString = `${hour.toString().padStart(2, '0')}:00`;
    const timeCodevalue = { code: timeString, value: timeString };
    options.push(timeCodevalue);
  }
  return options;
};
