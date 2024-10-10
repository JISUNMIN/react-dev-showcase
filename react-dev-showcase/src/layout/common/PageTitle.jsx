import { useMemo } from 'react';

import propTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { Text } from '@components/index';
import MENU_MAP from '@router/menuMap';

import BreadCrumbs from './BreadCrumbs';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 36px;
`;

const HeaderTitle = styled(Text)``;

const PageTitle = ({ title }) => {
  const location = useLocation();
  const pathname = location.pathname.slice(1);

  const { dynamicTitle, crumbs } = useMemo(() => {
    return MENU_MAP.reduce(
      (acc, cur) => {
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
                { path: null, name: cur.mainTitle },
                { path: item.path, name: item.subTitle },
              ];
            }
          });
        }

        return acc;
      },
      { dynamicTitle: '', crumbs: [] }
    );
  }, [pathname]);

  return (
    <Container>
      <HeaderTitle fontSize={32} fontWeight={700} color='#222222' innerHtml={title || dynamicTitle} />
      <BreadCrumbs crumbs={crumbs} />
    </Container>
  );
};

PageTitle.propTypes = {
  title: propTypes.string,
};

export default PageTitle;
