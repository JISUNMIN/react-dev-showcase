import { ReactNode, useCallback, useLayoutEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import styled, { RuleSet } from 'styled-components';

import MENU_MAP from '@router/menuMap';
import { caregoryOpenIcon, categoryCloseIcon, clock, dummyProfile, logo } from '@src/assets/images';
import { Button, Div, Icon, Img, Span, Text } from '@src/components';
import { flex, font } from '@src/styles/variables';
import { userInfoStore } from '@src/zustand';

interface SideBarProps {
  children?: ReactNode;
  classes?: {
    SideBar?: RuleSet<object>;
    HeaderContainer?: RuleSet<object>;
  };
}
interface MenuItem {
  mainTitle: string;
  path?: string;
  subItem?: Array<SubMenuItem>;
}

interface SubMenuItem {
  subTitle: string;
  path: string;
}

const Container = styled(Div)<{ $customstyle?: RuleSet<object> }>`
  ${flex({ direction: 'column', justify: 'flex-start' })};
  z-index: 999;
  padding-top: 23px;
  flex: 1;
  background-color: ${({ theme }) => theme.colors.gray10};
  ${({ $customstyle }) => $customstyle};
`;

const SideBarHeader = styled(Div)<{ $customstyle?: RuleSet<object> }>`
  width: 100%;
  min-height: 252px;
  padding-left: 28px;
  padding-right: 28px;
  ${({ $customstyle }) => $customstyle};
`;

const DividerMargin = styled(Div)`
  margin-top: 16px;
  margin-bottom: 36px;
  width: 100%;
  display: block;
  height: 1px;
  opacity: 0.05;
  background-color: ${({ theme }) => theme.colors.gray01};
`;

const UserProfileContainer = styled(Div)`
  ${flex({ gap: '10px', justify: 'flex-start' })};
`;

const UserProfileIcon = styled(Icon)`
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.graphy01};
  width: 40px;
  height: 40px;
`;

const UserInfoContainer = styled(Div)`
  ${flex({ direction: 'column', align: '' })};
`;

const TextUserNameCSS = styled(Text)`
  flex-grow: 1;
  color: ${({ theme }) => theme.colors.gray03};
  ${font({ size: '18px' })}
`;

const TextUserAuthCSS = styled(Text)`
  flex-grow: 1;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.gray04};
  ${font({ size: '14px' })}
`;

const SessionContainer = styled(Div)`
  ${flex({ justify: 'space-between' })};
  min-height: 40px;
  padding: 0 12px;
  margin-top: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.gray09};
`;

const TimerContainer = styled(Div)`
  ${flex({})}
  color: ${({ theme }) => theme.colors.graphy01};
`;

const ClockIcon = styled(Icon)`
  width: 16px;
  height: 16px;
`;

const UnderLineButton = styled(Button)`
  ${font({ size: '14px', weight: '700' })};
  color: ${({ theme }) => theme.colors.gray05};
  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.colors.gray02};
  }
`;

const MainUl = styled(Div)`
  padding: 0;
  margin: 0;
  background: ${({ theme }) => theme.colors.gray10};
`;

const SubUl = styled(Div)``;

const MenuItemContainer = styled(Div)`
  padding: 0;
`;

const MenuTitleRow = styled(Div)`
  ${flex({ justify: 'space-between' })};
  transition: background-color 0.3s;
  padding: 15px 28px;
  cursor: pointer;
`;

const MenuTitle = styled(Text)`
  ${font({ size: '18px' })}
  color: ${({ theme }) => theme.colors.gray04};
`;

const SubItemContainer = styled(Div)``;

const SubItem = styled(Div)<{ $isActive: boolean }>`
  ${font({ size: '16px' })}
  text-decoration: none;
  cursor: pointer;
  padding: 11.5px 36px;

  color: ${({ theme, $isActive }) => ($isActive ? theme.colors.graphy01 : theme.colors.gray06)};

  &:hover {
    color: ${({ theme }) => theme.colors.gray01};
  }
`;

const SpanArrowStyle = styled(Span)`
  width: 20px;
  height: 20px;
  display: inline-block;
  overflow: hidden;
`;

const MainLogo = styled(Icon)`
  width: 100px;
  height: 36px;
  cursor: pointer;
`;

const SideBar = ({ classes, children, ...rest }: SideBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = userInfoStore((state) => state);

  const [expandedMenu, setExpandedMenu] = useState<boolean[]>(Array(MENU_MAP.length).fill(false));

  const checkUrlActive = useCallback((path: string) => location.pathname === `/${path}`, [location]);

  const initExpandedMenu = useCallback(
    (index: number) => {
      if (!MENU_MAP[index]?.subItem) return false;

      const isIncludedCurrentPath = MENU_MAP[index].subItem.some(({ path }) => checkUrlActive(path));
      return isIncludedCurrentPath;
    },
    [checkUrlActive]
  );

  const handleExpandedStatus = useCallback(
    (item: MenuItem, index: number) => {
      setExpandedMenu((prev) => [...prev].map((expandedState, i) => (i === index ? !expandedState : expandedState)));

      if (item.path) {
        navigate(item.path);
      }
    },
    [navigate]
  );

  const handleNavigateSubPath = useCallback(
    (subItem: SubMenuItem) => {
      if (`/${subItem.path}` !== location.pathname) {
        navigate(subItem.path);
      }
    },
    [navigate, location]
  );

  const handleNavigate = useCallback(
    (path: string) => {
      if (path) {
        navigate(path);
      }
    },
    [navigate]
  );

  useLayoutEffect(() => {
    const initExpandedStates = expandedMenu.map((_, i) => initExpandedMenu(i));
    setExpandedMenu(initExpandedStates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container $customstyle={classes?.SideBar} {...rest}>
      <SideBarHeader $customstyle={classes?.HeaderContainer}>
        <MainLogo onClick={() => handleNavigate('/')} icon={logo} />
        <DividerMargin />
        <UserProfileContainer>
          <UserProfileIcon icon={dummyProfile} />
          <UserInfoContainer>
            <TextUserNameCSS>{userInfo?.adminName || ''}</TextUserNameCSS>
            <TextUserAuthCSS>{userInfo?.adminId || ''}</TextUserAuthCSS>
          </UserInfoContainer>
        </UserProfileContainer>
        <SessionContainer>
          <TimerContainer>
            <ClockIcon icon={clock} />
            {/* <Timer /> */} {/* FIXME[CS]  타이머 구현 필요 */}
          </TimerContainer>
          <UnderLineButton>
            {/* FIXME[CS]  타이머 구현 필요 */}
            연장하기
          </UnderLineButton>
        </SessionContainer>
      </SideBarHeader>
      <MainUl>
        {MENU_MAP.map((item, index) => (
          <MenuItemContainer key={`${item}-${index}`}>
            <MenuTitleRow onClick={() => handleExpandedStatus(item, index)}>
              <MenuTitle>{item.mainTitle}</MenuTitle>
              {item.subItem && (
                <SpanArrowStyle>
                  <Img src={expandedMenu[index] ? caregoryOpenIcon : categoryCloseIcon} alt='더보기' />
                </SpanArrowStyle>
              )}
            </MenuTitleRow>
            {expandedMenu[index] && item.subItem && (
              <SubUl>
                <SubItemContainer>
                  {item.subItem.map((subItem, index) => (
                    <SubItem
                      key={`${subItem}-${index}`}
                      onClick={() => handleNavigateSubPath(subItem)}
                      $isActive={checkUrlActive(subItem.path)}
                    >
                      {subItem.subTitle}
                    </SubItem>
                  ))}
                </SubItemContainer>
              </SubUl>
            )}
          </MenuItemContainer>
        ))}
      </MainUl>
      {children}
    </Container>
  );
};

export default SideBar;
