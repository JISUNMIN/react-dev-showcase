import { Link } from 'react-router-dom';
import styled from 'styled-components';

import path from '@src/router/path';
import { flex, font } from '@src/styles/variables';

interface Crumb {
  path?: string;
  name: string;
}

interface BreadCrumbsProps {
  crumbs: Crumb[];
}

const Container = styled.div`
  ${flex({})}
  column-gap: 10px;
  color: ${({ theme }) => theme.colors.gray07};
`;

const BreadCrumb = styled(Link)<{ $current?: boolean }>`
  ${font({ size: '16px', weight: '400' })}
  text-decoration: ${({ $current }) => ($current ? 'underline' : 'none')};
  color: ${({ theme }) => theme.colors.gray07};
  line-height: 24px;
`;

const CrumbDivider = styled.span``;

const BreadCrumbs = ({ crumbs }: BreadCrumbsProps) => (
  <Container>
    <BreadCrumb to={`/${path.HOME}`}>홈</BreadCrumb>
    {crumbs.map((crumb, index) => (
      <div key={index}>
        <CrumbDivider>/</CrumbDivider>
        <BreadCrumb to={crumb.path ? `/${crumb.path}` : ''} $current={crumbs.length - 1 === index}>
          {crumb.name}
        </BreadCrumb>
      </div>
    ))}
  </Container>
);

export default BreadCrumbs;
