import { ReactNode, memo } from 'react';

import styled, { css } from 'styled-components';

import { Div, Text } from '@components/atoms';

export interface TabData {
  id: string;
  title: string;
  content: ReactNode;
}

export interface TabMenuProps {
  /* 여러개의 TabData로 구성된 배열 */
  tabData: Array<TabData>;
  /** 첫 진입 시 활성화 될 Tab id */
  currentTabIndex: number;
  /** TabIndex setter 함수 */
  setCurrentTabIndex: (index: number) => void;
  /** Content와 title사이의 gap을 조절하기 위함 */
  contentTopSpacing?: number;
  /** 부가적으로 렌더링할 요소 */
  children?: ReactNode;
}

const onCss = css`
  font-weight: bold;
  color: rgba(32, 32, 32, 1);
  font-weight: 600;
  &:after {
    content: '';
    display: block;
    height: 2px;
    background: black;
    position: relative;
    top: 12px;
  }
`;

const TabMenuContainer = styled(Div)``;

const TabMenuList = styled.ul`
  display: flex;
  cursor: pointer;
  gap: 27px;
`;

const TabMenuItem = styled.li`
  display: flex;
`;

const ButtonBox = styled(Div)<{ onTab: boolean }>`
  ${({ onTab }) => onTab && onCss}
`;

const TabMenuContentBox = styled(Div)<{ contentTopSpacing: number }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: ${({ contentTopSpacing }) => `${contentTopSpacing}px`};
`;

const Title = styled(Text)`
  font-size: 18px;
`;

const TabMenu = ({ tabData, currentTabIndex, setCurrentTabIndex, contentTopSpacing, children }: TabMenuProps) => {
  const handleTabClick = (index: number) => {
    setCurrentTabIndex(index);
  };

  return (
    <TabMenuContainer>
      <TabMenuList>
        {tabData.map((tab, index) => (
          <TabMenuItem key={tab.id}>
            <ButtonBox onTab={currentTabIndex === index} onClick={() => handleTabClick(index)}>
              <Title>{tab.title}</Title>
            </ButtonBox>
          </TabMenuItem>
        ))}
      </TabMenuList>
      <TabMenuContentBox contentTopSpacing={contentTopSpacing ?? 30}>
        {children && children}
        {tabData[currentTabIndex].content}
      </TabMenuContentBox>
    </TabMenuContainer>
  );
};

TabMenu.displayName = 'TabMenu';

export default memo(TabMenu);
