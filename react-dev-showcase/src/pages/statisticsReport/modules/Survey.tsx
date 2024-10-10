import styled from 'styled-components';

import { Div } from '@src/components';
import Grid from '@src/layout/grid/Grid';

const Container = styled(Div)``;

const StyledGrid = styled(Grid)`
  margin-bottom: 20px;
  gap: 80px;
`;

const Table = styled.table`
  --border: 1px solid ${({ theme }) => theme.colors.gray04};

  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  text-align: left;
  font-size: 12px;
`;

const Th = styled.th`
  padding: 12px;
  border-top: var(--border);
  border-bottom: var(--border);
  background: ${({ theme }) => theme.colors.gray02};
  font-weight: 700;
`;

const Tr = styled.tr``;

const Td = styled.td`
  padding: 12px;
  border-top: var(--border);
  border-bottom: var(--border);
  :first-child {
    font-weight: 600;
    width: 54%;
  }
  :nth-child(2) {
    width: 25%;
  }
  :nth-child(3) {
    width: 20%;
  }
`;

// FIXME: MOCK_DATA
const sections = [
  {
    title: '기본 정보',
    items: [
      {
        title: '현재 나이',
        rows: [
          ['John Doe', 30, 'john@example.com'],
          ['Jane Smith', 25, 'jane@example.com'],
          ['Sam Johnson', 35, 'sam@example.com'],
        ],
      },
      {
        title: '성별',
        rows: [
          ['John Doe', '남', 'john@example.com'],
          ['Jane Smith', '여', 'jane@example.com'],
          ['Sam Johnson', '남', 'sam@example.com'],
        ],
      },
      {
        title: '키',
        rows: [
          ['John Doe', '175cm', 'john@example.com'],
          ['Jane Smith', '160cm', 'jane@example.com'],
          ['Sam Johnson', '180cm', 'sam@example.com'],
        ],
      },
      {
        title: '몸무게',
        rows: [
          ['John Doe', '70kg', 'john@example.com'],
          ['Jane Smith', '55kg', 'jane@example.com'],
          ['Sam Johnson', '80kg', 'sam@example.com'],
        ],
      },
    ],
  },
  {
    title: '바디 정보',
    items: [
      {
        title: '질환',
        rows: [
          ['John Doe', '없음', 'john@example.com'],
          ['Jane Smith', '당뇨', 'jane@example.com'],
          ['Sam Johnson', '고혈압', 'sam@example.com'],
        ],
      },
      {
        title: '신체활동 제한질환 보유여부',
        rows: [
          ['John Doe', '아니오', 'john@example.com'],
          ['Jane Smith', '예', 'jane@example.com'],
          ['Sam Johnson', '아니오', 'sam@example.com'],
        ],
      },
      {
        title: '통증 부위',
        rows: [
          ['John Doe', '없음', 'john@example.com'],
          ['Jane Smith', '허리', 'jane@example.com'],
          ['Sam Johnson', '무릎', 'sam@example.com'],
        ],
      },
      {
        title: '1년이내 수술여부',
        rows: [
          ['John Doe', '아니오', 'john@example.com'],
          ['Jane Smith', '예', 'jane@example.com'],
          ['Sam Johnson', '예', 'sam@example.com'],
        ],
      },
    ],
  },
  {
    title: '운동 정보',
    items: [
      {
        title: '운동목적',
        rows: [
          ['John Doe', '체중 감소', 'john@example.com'],
          ['Jane Smith', '건강 유지', 'jane@example.com'],
          ['Sam Johnson', '근육 증가', 'sam@example.com'],
        ],
      },
      {
        title: '관심 신체부위',
        rows: [
          ['John Doe', '복근', 'john@example.com'],
          ['Jane Smith', '하체', 'jane@example.com'],
          ['Sam Johnson', '상체', 'sam@example.com'],
        ],
      },
      {
        title: '선호운동',
        rows: [
          ['John Doe', '달리기', 'john@example.com'],
          ['Jane Smith', '요가', 'jane@example.com'],
          ['Sam Johnson', '수영', 'sam@example.com'],
        ],
      },
      {
        title: '주간운동 횟수',
        rows: [
          ['John Doe', '3회', 'john@example.com'],
          ['Jane Smith', '4회', 'jane@example.com'],
          ['Sam Johnson', '2회', 'sam@example.com'],
        ],
      },
      {
        title: '하루 운동시간',
        rows: [
          ['John Doe', '1시간', 'john@example.com'],
          ['Jane Smith', '30분', 'jane@example.com'],
          ['Sam Johnson', '45분', 'sam@example.com'],
        ],
      },
    ],
  },
  {
    title: '생활 정보',
    items: [
      {
        title: '흡연여부',
        rows: [
          ['John Doe', '아니오', 'john@example.com'],
          ['Jane Smith', '예', 'jane@example.com'],
          ['Sam Johnson', '아니오', 'sam@example.com'],
        ],
      },
      {
        title: '음주여부',
        rows: [
          ['John Doe', '예', 'john@example.com'],
          ['Jane Smith', '아니오', 'jane@example.com'],
          ['Sam Johnson', '예', 'sam@example.com'],
        ],
      },
      {
        title: '통증 부위',
        rows: [
          ['John Doe', '없음', 'john@example.com'],
          ['Jane Smith', '어깨', 'jane@example.com'],
          ['Sam Johnson', '다리', 'sam@example.com'],
        ],
      },
      {
        title: '1년이내 수술여부',
        rows: [
          ['John Doe', '아니오', 'john@example.com'],
          ['Jane Smith', '예', 'jane@example.com'],
          ['Sam Johnson', '아니오', 'sam@example.com'],
        ],
      },
    ],
  },
];

const Survey = () => {
  {
    /* FIXME: 기획 Title Fix되면 title 변경해야됨 */
  }
  return (
    <Container>
      {sections.map((section) => (
        <StyledGrid title={section.title} column={4} key={section.title}>
          {section.items.map((item) => (
            <Table key={item.title}>
              <thead>
                <Tr>
                  {['Name', 'Value', 'Email'].map((dataTitle, index) => (
                    <Th key={index}>{dataTitle}</Th>
                  ))}
                </Tr>
              </thead>
              <tbody>
                {item.rows.map((row, rowIndex) => (
                  <Tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <Td key={cellIndex}>{cell}</Td>
                    ))}
                  </Tr>
                ))}
              </tbody>
            </Table>
          ))}
        </StyledGrid>
      ))}
    </Container>
  );
};

export default Survey;
