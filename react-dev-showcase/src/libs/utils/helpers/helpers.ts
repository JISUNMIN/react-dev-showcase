/** Helpers: 코드베이스에서 자주 사용되는 간단하고 반복적인 작업을 수행하는 작은 유틸리티 함수입니다. 주로 다른 함수나 클래스 내에서 보조 역할을 합니다. */

/** UTF-8 방식 byte 구하는 함수 */
const LINE_FEED = 10; // '\n'

const getByteLength = (decimal: number): number => {
  return decimal >> 7 || LINE_FEED === decimal ? 2 : 1;
};

export const getByte = (str: string): number => {
  return str
    .split('')
    .map((s) => s.charCodeAt(0))
    .reduce((prev, unicodeDecimalValue) => prev + getByteLength(unicodeDecimalValue), 0);
};

/** 지정해준 byte number 만큼만 출력해주는 함수 */
export const getLimitedByteText = (inputText: string, maxByte: number): string => {
  const characters = inputText.split('');
  let validText = '';
  let totalByte = 0;

  for (let i = 0; i < characters.length; i += 1) {
    const character = characters[i];
    const decimal = character.charCodeAt(0);
    const byte = getByteLength(decimal); // 글자 한 개가 몇 바이트 길이인지 구해주기

    // 현재까지의 바이트 길이와 더해 최대 바이트 길이를 넘지 않으면
    if (totalByte + byte < maxByte) {
      totalByte += byte; // 바이트 길이 값을 더해 현재까지의 총 바이트 길이 값을 구함
      validText += character; // 글자를 더해 현재까지의 총 문자열 값을 구함
    } else {
      // 최대 바이트 길이를 넘으면
      break; // for 루프 종료
    }
  }

  return validText;
};

export const convertDateToString = (date: Date, separator = ''): string => {
  if (!date || !(date instanceof Date)) {
    console.error('Invalid Date');
    return ''; // 빈 문자열 반환
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  switch (separator) {
    case 'ko':
      return `${year}년 ${month}월 ${day}일`;
    default:
      return `${year}${separator}${month}${separator}${day}`;
  }
};

// 날짜 문자열을 'YYYY-MM-DD 형식으로 변환하는 함수'
export const formatDate = (dateStr: string) => {
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);

  return `${year}-${month}-${day}`;
};

/**
 * 조건에 따른 날짜 범위를 계산해주는 함수
 *
 * @example
 *   import { dateCalculator } from '@utils';
 *
 *   const { method, conditions } = dateCalculator;
 *   method(new Date(), conditions.THIS_MONTH);
 *   // 오늘이 2024년 4월 어느 날짜인 경우
 *   // { startDate: new Date('2024-04-01'), endDate: new Date('2024-04-30') }
 *
 * @param {Date} date - 계산의 기준이 되는 날짜
 * @param {'today'
 *   | 'yesterday'
 *   | 'thisWeek'
 *   | 'lastWeek'
 *   | 'thisMonth'
 *   | 'lastMonth'
 *   | 'recent7Days'
 *   | 'recent30Days'} condition
 *   - 어느 범위의 날짜를 계산할지 정해주는 조건 (conditions 객체 사용)
 *
 * @returns {{ startDate: Date; endDate: Date }} 계산된 날짜 범위의 시작일과 종료일을 반환
 */

type DateCondition =
  | 'today'
  | 'yesterday'
  | 'thisWeek'
  | 'lastWeek'
  | 'thisMonth'
  | 'lastMonth'
  | 'recent7Days'
  | 'recent30Days';

const DATE_CALCULATOR_CONTIDIONS = Object.freeze({
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  THIS_WEEK: 'thisWeek',
  LAST_WEEK: 'lastWeek',
  THIS_MONTH: 'thisMonth',
  LAST_MONTH: 'lastMonth',
  RECENT_7_DAYS: 'recent7Days',
  RECENT_30_DAYS: 'recent30Days',
} as const);

interface DateRange {
  startDate: Date;
  endDate: Date;
}

const dateCalculatorMethod = (date: Date, condition: DateCondition): DateRange => {
  const startDate = new Date(date);
  const endDate = new Date(date);

  switch (condition) {
    case DATE_CALCULATOR_CONTIDIONS.TODAY:
      break;
    case DATE_CALCULATOR_CONTIDIONS.YESTERDAY:
      startDate.setDate(startDate.getDate() - 1);
      endDate.setDate(endDate.getDate() - 1);
      break;
    case DATE_CALCULATOR_CONTIDIONS.THIS_WEEK:
      startDate.setDate(startDate.getDate() - startDate.getDay());
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
      break;
    case DATE_CALCULATOR_CONTIDIONS.LAST_WEEK:
      startDate.setDate(startDate.getDate() - startDate.getDay() - 7);
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay() - 7));
      break;
    case DATE_CALCULATOR_CONTIDIONS.THIS_MONTH:
      startDate.setDate(1);
      endDate.setDate(new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate());
      break;
    case DATE_CALCULATOR_CONTIDIONS.LAST_MONTH:
      startDate.setDate(1);
      startDate.setMonth(startDate.getMonth() - 1);
      endDate.setDate(0);
      break;
    case DATE_CALCULATOR_CONTIDIONS.RECENT_7_DAYS:
      startDate.setDate(startDate.getDate() - 6);
      break;
    case DATE_CALCULATOR_CONTIDIONS.RECENT_30_DAYS:
      startDate.setDate(startDate.getDate() - 29);
      break;
    default:
      break;
  }

  return { startDate, endDate };
};

export const dateCalculator = Object.freeze({
  conditions: DATE_CALCULATOR_CONTIDIONS,
  method: dateCalculatorMethod,
});
