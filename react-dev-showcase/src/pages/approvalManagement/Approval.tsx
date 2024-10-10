import { useState } from 'react';

import styled from 'styled-components';

import { Div, FTATabMenu } from '@src/components';
import { TabData } from '@src/components/molecules/TabMenu';

import PendingApprovalCP from './modules/PendingApprovalCP';
import PendingApprovalContents from './modules/PendingApprovalContents';
import PendingApprovalProgram from './modules/PendingApprovalProgram';

const Container = styled(Div)``;

const Approval = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const tabData: Array<TabData> = [
    {
      id: 'tab1',
      title: '승인 대기 콘텐츠',
      content: <PendingApprovalContents />,
    },
    {
      id: 'tab2',
      title: '승인 대기 프로그램',
      content: <PendingApprovalProgram />,
    },
    {
      id: 'tab3',
      title: '승인 대기 CP',
      content: <PendingApprovalCP />,
    },
  ];

  return (
    <Container>
      <FTATabMenu
        tabData={tabData}
        currentTabIndex={currentTabIndex}
        setCurrentTabIndex={setCurrentTabIndex}
        contentTopSpacing={40}
      />
    </Container>
  );
};

export default Approval;
