import { useMemo } from 'react';

import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { Div, Text } from '@components/index';
import FTABreadCrumbs from '@components/service/organisms/FTABreadCrumbs';
import MENU_MAP from '@router/menuMap';
import { flex, font } from '@styles/variables';

export interface FTAPageTitleProps {
  title: string;
}

export interface FTAPathProps {
  path: string;
  name: string;
}

const Container = styled(Div)`
  ${flex({ justify: 'space-between' })}
  width: 100%;
  margin-bottom: 36px;
`;

const HeaderTitle = styled(Text)`
  ${font({ size: '32px', weight: '700' })}
  color: ${({ theme }) => theme.colors.gray12};
`;

const PageTitle = ({ title, ...rest }: FTAPageTitleProps) => {
  const location = useLocation();
  const pathname = location.pathname.slice(1);

  const { dynamicTitle, crumbs } = useMemo(() => {
    return MENU_MAP.reduce(
      (acc: { dynamicTitle: string; crumbs: FTAPathProps[] }, cur) => {
        if (acc.dynamicTitle !== '') return acc;

        if (cur.path === pathname) {
          acc.dynamicTitle = cur.mainTitle;
          acc.crumbs = [{ path: cur.path, name: cur.mainTitle }];
        }

        if (cur.subItem) {
          cur.subItem.forEach((item) => {
            if (pathname.split('/')[0] === item.path) {
              acc.dynamicTitle = cur.mainTitle;
              acc.crumbs = [
                { path: '', name: cur.mainTitle },
                { path: item.path, name: item.subTitle },
              ];
            }
          });
        }

        return acc;
      },
      { dynamicTitle: '', crumbs: [] as FTAPathProps[] }
    );
  }, [pathname]);

  return (
    <Container {...rest}>
      <HeaderTitle>{title || dynamicTitle}</HeaderTitle>
      <FTABreadCrumbs crumbs={crumbs} />
    </Container>
  );
};

export default PageTitle;
