import styled, { RuleSet, css } from 'styled-components';

import { Div } from '@src/components/atoms';
import { enumStore } from '@src/zustand';

// 심사대기(awaiting) 에대한 generalguide가 없음
type ChipStatus = 'approval' | 'reject' | 'pending' | 'awaiting';

const StatusCss: Record<ChipStatus, RuleSet<object>> = {
  approval: css`
    background-color: rgba(68, 162, 128, 0.2);
    color: ${({ theme }) => theme.colors.green};
  `,
  reject: css`
    background-color: rgba(244, 75, 74, 0.2);
    color: ${({ theme }) => theme.colors.red};
  `,
  pending: css`
    background-color: rgba(249, 184, 17, 0.2);
    color: ${({ theme }) => theme.colors.yellow};
  `,
  awaiting: css`
    /* background-color: rgba(249, 184, 17, 0.2);
    color: ${({ theme }) => theme.colors.yellow}; */
  `,
};

const baseStyle = css`
  display: inline-flex;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
`;

const isValidStatus = (status: string): status is ChipStatus => {
  return status in StatusCss;
};

const Wrapper = styled(Div)<{ status: string }>`
  ${baseStyle}
  ${({ status }) => (isValidStatus(status) ? StatusCss[status] : null)}
`;

const StatusMap = {
  approval: ['SAS000', 'OAST000', 'RAS001'],
  reject: ['SAS001', 'OAST001', 'RAS002'],
  pending: ['SAS002', 'OAST002', 'RAS003'],
  awaiting: ['OAST999', 'RAS999'],
};
const StatusChip = ({ code }: { code: string }) => {
  const { convertEnum } = enumStore();
  const status = Object.keys(StatusMap).find((key) => StatusMap[key as ChipStatus].includes(code));

  return <Wrapper status={status as string}>{convertEnum(code)}</Wrapper>;
};

export default StatusChip;
