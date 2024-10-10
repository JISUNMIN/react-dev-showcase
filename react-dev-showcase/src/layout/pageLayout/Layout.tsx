import React, { useCallback } from 'react';

import { Outlet, ScrollRestoration } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { logoutHoverIcon, logoutIcon, topButtonIcon } from '@src/assets/images';
import { Div, Icon, Text } from '@src/components';
import useLogin from '@src/hooks/rest/useLogin';
import { flex, font, size } from '@src/styles/variables';

import SideBar from '../common/SideBar';

const Container = styled(Div)`
  --sidebar-width: 300px;

  display: flex;
  min-height: 100vh;
`;

const SidebarChidren = styled(Div)`
  ${flex({ direction: 'column', align: 'flex-start' })};
  flex-grow: 1;
  width: 100%;
`;

const DividerMargin = styled(Div)`
  width: 100%;
  display: block;
  height: 1px;
  opacity: 0.05;
  background-color: ${({ theme }) => theme.colors.gray01};
`;

const SideBarFooter = styled(Div)`
  margin-top: auto;
  margin-left: 28px;
  min-height: 60px;
  align-items: center;
`;

const IconLogout = styled(Icon)`
  ${size({ w: '24px' })}
  fill: ${({ theme }) => theme.colors.gray07};
`;

const LogoutText = styled(Text)`
  ${font({ size: '18px', weight: '800' })}
  color: ${({ theme }) => theme.colors.gray07};
`;

const LogoutContainer = styled(Div)`
  ${flex({ align: 'flex-start' })};
  height: 100%;
  cursor: pointer;
  &:hover {
    ${IconLogout} {
      background-image: url(${logoutHoverIcon});
    }
    ${LogoutText} {
      color: ${({ theme }) => theme.colors.gray01};
    }
  }
`;

const MainContents = styled(Div)`
  flex: 4;
  flex-grow: 4;
  flex-shrink: 1;
  flex-basis: 0%;
  padding-top: 70px;
  padding-left: var(--sidebar-width);
`;

const PaddingWrapper = styled(Div)`
  flex-direction: column;
  padding: 0 60px;
  min-height: calc(100vh - 305px); // Footer 최소 높이 154px top padding 70px footer divider 1px divider margin 80px
`;

const Footer = styled(Div)`
  ${flex({ justify: 'space-between' })};
  min-height: 154px;
  text-align: left;
`;

const FooterDivider = styled(Div)`
  background: ${({ theme }) => theme.colors.gray03};
  height: 1px;
  opacity: 1;
  margin-top: 80px;
`;

const FlexDiv = styled(Div)`
  ${flex({ justify: 'flex-start', align: 'flex-start' })};
`;

const VerticalDividerText = styled(Text)`
  ${font({ size: '14px', weight: '400' })}
  color: ${({ theme }) => theme.colors.gray07};
  height: 100%;
  text-align: left;
  align-items: flex-start;
  :after {
    ${size({ w: '1px', h: '10px' })}
    background-color: ${({ theme }) => theme.colors.gray07};
    display: inline-block;
    margin: 0 12px;
    opacity: 0.3;
    vertical-align: middle;
  }
`;

const CompanyDetails = styled(Div)`
  ${flex({ direction: 'column', gap: '14px', align: 'flex-start' })};
`;

const Rights = styled(Div)`
  ${flex({ direction: 'column', gap: '6px', align: 'flex-start' })};
  align-self: flex-start;
`;

const Contents = styled(Div)`
  ${flex({ direction: 'column', gap: '14px', justify: 'space-between' })}
  height: auto;
  text-align: left;
  padding: 28px 60px;
`;

const SidebarContainerCSS = css`
  background: ${({ theme }) => theme.colors.gray10};
  min-width: var(--sidebar-width);
  height: 100vh;
  position: fixed;
  flex-direction: column;
`;

const SidebarHeaderContainerCSS = css``;

const GoTopIcon = styled(Div)`
  ${flex({})};
  margin-bottom: 36px;
  margin-right: 36px;
  cursor: pointer;
`;

const TopButton = styled(Icon)`
  ${size({ w: '56px' })}
`;

const Layout: React.FC = () => {
  const { logout } = useLogin();

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const handleGoTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <Container>
      <ScrollRestoration />
      <SideBar classes={{ SideBar: SidebarContainerCSS, HeaderContainer: SidebarHeaderContainerCSS }}>
        {/* <SideBarAdmin /> */}
        <SidebarChidren>
          <SideBarFooter>
            <DividerMargin />
            <LogoutContainer onClick={handleLogout}>
              <IconLogout icon={logoutIcon} />
              <LogoutText>로그아웃</LogoutText>
            </LogoutContainer>
          </SideBarFooter>
        </SidebarChidren>
      </SideBar>
      <MainContents>
        <PaddingWrapper>
          <Outlet />
        </PaddingWrapper>
        <FooterDivider />
        <Footer>
          <Contents>
            <CompanyDetails>
              <FlexDiv>
                <VerticalDividerText>대표번호 : 02-3777-1114</VerticalDividerText>
                <VerticalDividerText>주소 : 서울시 영등포구 여의대로 128 LG트윈타워</VerticalDividerText>
              </FlexDiv>
              <FlexDiv>
                <VerticalDividerText>LGE.COM</VerticalDividerText>
                <VerticalDividerText>사업자등록번호 : 107-86-14075</VerticalDividerText>
                <VerticalDividerText>사업자 정보확인</VerticalDividerText>
                <VerticalDividerText>사업자 정보확인 통신판매업신고번호 : 제1997-00084호</VerticalDividerText>
                <VerticalDividerText>주소 : 서울시 영등포구 여의대로 128 LG트윈타워</VerticalDividerText>
              </FlexDiv>
            </CompanyDetails>
            <Rights>
              <VerticalDividerText>
                본 사이트의 모든 콘텐츠는 저작권법의 보호를 받는 바, 무단 전재, 복사, 배포 등을 금합니다.
              </VerticalDividerText>
              <VerticalDividerText>Copyright © 2023 LG Electronics. All Rights Reserved.</VerticalDividerText>
            </Rights>
          </Contents>
          <GoTopIcon onClick={handleGoTop}>
            <TopButton icon={topButtonIcon} />
          </GoTopIcon>
        </Footer>
      </MainContents>
    </Container>
  );
};

export default Layout;
