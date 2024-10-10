import { ReactNode, Suspense, lazy } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { RouteObject } from 'react-router-dom';

import Layout from '@src/layout/pageLayout/Layout';
import LayoutCenter from '@src/layout/pageLayout/LayoutCenter';
import ContentsFormLG from '@src/pages/contentManagement/ContentsFormLG';
import tableLoader from '@src/router/loaders/tableLoader';

import ProtectedRoute from '../layout/pageLayout/ProtectedRoute';
import contentsLgTableSubFilterLoader from './loaders/contentsLgTableSubFilterLoader';
import PATHS from './path';

const Login = lazy(() => import('@src/pages/authentication/Login'));
const UnAuth = lazy(() => import('@src/pages/authentication/UnAuth'));
const Home = lazy(() => import('@src/pages/Home'));
const Approval = lazy(() => import('@src/pages/approvalManagement/Approval'));
const CPInfo = lazy(() => import('@src/pages/cpManagement/CPInfo'));
const ECPConfiguration = lazy(() => import('@src/pages/externalCenterProgramManagement/ECPConfiguration'));
const ECPConfigurationForm = lazy(() => import('@src/pages/externalCenterProgramManagement/ECPConfigurationForm'));
const ECPConfigurationDetail = lazy(() => import('@src/pages/externalCenterProgramManagement/ECPConfigurationDetail'));
const CPDetail = lazy(() => import('@src/pages/cpManagement/CPDetail'));
const CPInfoForm = lazy(() => import('@src/pages/cpManagement/CPInfoForm'));
const ContentsCP = lazy(() => import('@src/pages/contentManagement/ContentsCP'));
const ContentsFormCP = lazy(() => import('@src/pages/contentManagement/ContentsFormCP'));
const ContentsCPDetail = lazy(() => import('@src/pages/contentManagement/ContentsCPDetail'));
const ContentsLG = lazy(() => import('@src/pages/contentManagement/ContentsLG'));
const AccountList = lazy(() => import('@src/pages/adminAccountManagement/AccountList'));
const AccountDetail = lazy(() => import('@src/pages/adminAccountManagement/AccountDetail'));
const AccountForm = lazy(() => import('@src/pages/adminAccountManagement/AccountForm'));
const AccountRoleList = lazy(() => import('@src/pages/adminAccountManagement/AccountRoleList'));
const AccountRoleDetail = lazy(() => import('@src/pages/adminAccountManagement/AccountRoleDetail'));
const AccountRoleForm = lazy(() => import('@src/pages/adminAccountManagement/AccountRoleForm'));
const Notice = lazy(() => import('@src/pages/otherManagement/Notice'));
const NoticeDetail = lazy(() => import('@src/pages/otherManagement/NoticeDetail'));
const NoticeForm = lazy(() => import('@src/pages/otherManagement/NoticeForm'));
const HealthCareDB = lazy(() => import('@src/pages/otherManagement/healthcareDB/HealthCareDB'));
const HealthCareDBDetail = lazy(() => import('@src/pages/otherManagement/healthcareDB/HealthCareDBDetail'));
const HealthCareDBForm = lazy(() => import('@src/pages/otherManagement/healthcareDB/HealthCareDBForm'));
const CsResponse = lazy(() => import('@src/pages/otherManagement/cs/CsResponse'));
const CsResponseDetail = lazy(() => import('@src/pages/otherManagement/cs/CsResponseDetail'));
const CsResponseForm = lazy(() => import('@src/pages/otherManagement/cs/CsResponseForm'));
const Faq = lazy(() => import('@src/pages/otherManagement/faq/Faq'));
const FaqDetail = lazy(() => import('@src/pages/otherManagement/faq/FaqDetail'));
const FaqForm = lazy(() => import('@src/pages/otherManagement/faq/FaqForm'));
const Survey = lazy(() => import('@src/pages/otherManagement/Survey'));
const ReportApp = lazy(() => import('@src/pages/statisticsReport/ReportApp'));
const ReportCp = lazy(() => import('@src/pages/statisticsReport/ReportCP'));

export const menuPathMap = {
  AC000: '/',
  AC001: 'approval',
  AC002: 'cpinfo',
  AC003: 'ecp',
  AC004: 'contents',
  AC005: 'account',
  AC006: 'common',
  AC007: 'report',
};

const ErrorFallback = ({ error }: { error: Error }) => (
  <div role='alert'>
    <p>Something went wrong:</p>
    <pre>{error.message}</pre>
  </div>
);

const LoadingFallback = () => <div>Loading...</div>;

const SuspenseWrapper = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
  </ErrorBoundary>
);

const Router: RouteObject[] = [
  {
    path: menuPathMap.AC000,
    element: <Layout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: (
              <SuspenseWrapper>
                <Home />
              </SuspenseWrapper>
            ),
          },
          {
            path: menuPathMap.AC001,
            element: (
              <SuspenseWrapper>
                <Approval />
              </SuspenseWrapper>
            ),
          },
          {
            path: menuPathMap.AC002,
            children: [
              {
                index: true,
                element: (
                  <SuspenseWrapper>
                    <CPInfo />
                  </SuspenseWrapper>
                ),
                loader: tableLoader,
              },
              {
                path: ':id',
                element: (
                  <SuspenseWrapper>
                    <CPDetail />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'edit',
                element: (
                  <Suspense>
                    <CPInfoForm />
                  </Suspense>
                ),
              },
              {
                path: 'edit/:id',
                element: (
                  <SuspenseWrapper>
                    <CPInfoForm />
                  </SuspenseWrapper>
                ),
              },
            ],
          },
          {
            path: menuPathMap.AC003,
            children: [
              {
                path: 'configuration',
                children: [
                  {
                    index: true,
                    element: (
                      <SuspenseWrapper>
                        <ECPConfiguration />
                      </SuspenseWrapper>
                    ),
                    loader: tableLoader,
                  },
                  {
                    path: 'edit',
                    element: (
                      <SuspenseWrapper>
                        <ECPConfigurationForm />
                      </SuspenseWrapper>
                    ),
                  },
                  {
                    path: 'edit/:id',
                    element: (
                      <SuspenseWrapper>
                        <ECPConfigurationForm />
                      </SuspenseWrapper>
                    ),
                  },
                  {
                    path: ':id',
                    element: (
                      <SuspenseWrapper>
                        <ECPConfigurationDetail />
                      </SuspenseWrapper>
                    ),
                  },
                ],
              },
              // {
              //   path: '/edit',
              //   element: (
              //     <Suspense>
              //       <ECPConfigurationEdit />
              //     </Suspense>
              //   ),
              // },
              // {
              //   path: 'configuration',
              //   element: (
              //     <Suspense>
              //       <ECPConfiguration />
              //     </Suspense>

              //   ),
              // },

              // { path: 'configuration/detail/:id', element: <ExternalCenterProgramConfigurationDetail /> },
              // { path: 'configuration/edit/:id', element: <ExternalCenterProgramConfigurationEdit /> },
              // { path: 'schedule', element: <ExternalCenterProgramSchedule /> },
              // { path: 'schedule/edit/:id', element: <ExternalCenterProgramScheduleEdit /> },
              // { path: 'creation', element: <ExternalCenterProgramCreation /> },
              // { path: 'creation/edit/:id', element: <ExternalCenterProgramCreationEdit /> },
            ],
          },
          {
            path: menuPathMap.AC004,
            children: [
              {
                path: 'cp',
                children: [
                  {
                    index: true,
                    element: (
                      <SuspenseWrapper>
                        <ContentsCP />
                      </SuspenseWrapper>
                    ),
                    loader: tableLoader,
                  },
                  {
                    path: ':id',
                    element: (
                      <SuspenseWrapper>
                        <ContentsCPDetail />
                      </SuspenseWrapper>
                    ),
                    loader: tableLoader,
                  },
                  {
                    path: 'edit',
                    element: (
                      <SuspenseWrapper>
                        <ContentsFormCP />
                      </SuspenseWrapper>
                    ),
                  },
                  {
                    path: 'edit/:id',
                    element: (
                      <SuspenseWrapper>
                        <ContentsFormCP />
                      </SuspenseWrapper>
                    ),
                  },
                  // { path: 'edit/:id', element: <ContentsForm /> },
                ],
              },
              {
                path: 'lg',
                children: [
                  {
                    index: true,
                    element: (
                      <SuspenseWrapper>
                        <ContentsLG />
                      </SuspenseWrapper>
                    ),
                    loader: contentsLgTableSubFilterLoader,
                  },
                  {
                    path: ':id',
                    element: (
                      <SuspenseWrapper>
                        <ContentsCPDetail />
                      </SuspenseWrapper>
                    ),
                  },
                  {
                    path: 'edit',
                    element: (
                      <SuspenseWrapper>
                        <ContentsFormCP />
                      </SuspenseWrapper>
                    ),
                  },
                  {
                    path: 'edit/:id',
                    element: (
                      <SuspenseWrapper>
                        <ContentsFormCP />
                      </SuspenseWrapper>
                    ),
                  },
                  {
                    path: 'write',
                    element: (
                      <SuspenseWrapper>
                        <ContentsFormLG />
                      </SuspenseWrapper>
                    ),
                  },
                ],
              },
            ],
          },
          {
            path: menuPathMap.AC005,
            children: [
              {
                index: true,
                element: (
                  <SuspenseWrapper>
                    <AccountList />
                  </SuspenseWrapper>
                ),
                loader: tableLoader,
              },
              {
                path: ':id',
                element: (
                  <SuspenseWrapper>
                    <AccountDetail />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'edit/:id',
                element: (
                  <SuspenseWrapper>
                    <AccountForm />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'role',
                element: (
                  <SuspenseWrapper>
                    <AccountRoleList />
                  </SuspenseWrapper>
                ),
                // FIXME: tableLoader 수정되면 적용
                // loader: tableLoader,
              },
              {
                path: 'role/:id',
                element: (
                  <SuspenseWrapper>
                    <AccountRoleDetail />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'role/edit/:id',
                element: (
                  <SuspenseWrapper>
                    <AccountRoleForm />
                  </SuspenseWrapper>
                ),
              },
            ],
          },
          {
            path: menuPathMap.AC006,
            children: [
              {
                path: 'notice',
                children: [
                  {
                    index: true,
                    element: (
                      <SuspenseWrapper>
                        <Notice />
                      </SuspenseWrapper>
                    ),
                    loader: tableLoader,
                  },
                  {
                    path: ':id',
                    element: (
                      <SuspenseWrapper>
                        <NoticeDetail />
                      </SuspenseWrapper>
                    ),
                  },
                  {
                    path: 'edit',
                    element: (
                      <SuspenseWrapper>
                        <NoticeForm />
                      </SuspenseWrapper>
                    ),
                  },
                  {
                    path: 'edit/:id',
                    element: (
                      <SuspenseWrapper>
                        <NoticeForm />
                      </SuspenseWrapper>
                    ),
                  },
                ],
              },
              {
                path: 'healthcaredb',
                children: [
                  {
                    index: true,
                    element: (
                      <SuspenseWrapper>
                        <HealthCareDB />
                      </SuspenseWrapper>
                    ),
                    loader: tableLoader,
                  },
                  {
                    path: ':id',
                    element: (
                      <SuspenseWrapper>
                        <HealthCareDBDetail />
                      </SuspenseWrapper>
                    ),
                  },
                  {
                    path: 'edit',
                    element: (
                      <SuspenseWrapper>
                        <HealthCareDBForm />
                      </SuspenseWrapper>
                    ),
                  },
                  {
                    path: 'edit/:id',
                    element: (
                      <SuspenseWrapper>
                        <HealthCareDBForm />
                      </SuspenseWrapper>
                    ),
                  },
                  // { path: 'detail/:id', element: <HealthCareDBDetail /> },
                  // { path: 'write', element: <HealthCareDBEdit /> },
                  // { path: 'edit/:id', element: <HealthCareDBEdit /> },
                ],
              },
              {
                path: 'csresponse',
                children: [
                  {
                    index: true,
                    element: (
                      <SuspenseWrapper>
                        <CsResponse />
                      </SuspenseWrapper>
                    ),
                    loader: tableLoader,
                  },
                  {
                    path: ':id',
                    element: (
                      <SuspenseWrapper>
                        <CsResponseDetail />
                      </SuspenseWrapper>
                    ),
                  },
                  {
                    path: 'edit',
                    element: (
                      <SuspenseWrapper>
                        <CsResponseForm />
                      </SuspenseWrapper>
                    ),
                  },
                  {
                    path: 'edit/:id',
                    element: (
                      <SuspenseWrapper>
                        <CsResponseForm />
                      </SuspenseWrapper>
                    ),
                  },
                  // { path: 'detail/:id', element: <CsResponseDetail /> },
                  // { path: 'write', element: <CsResponseEdit /> },
                  // { path: 'edit/:id', element: <CsResponseEdit /> },
                ],
              },
              {
                path: 'faq',
                children: [
                  {
                    index: true,
                    element: (
                      <SuspenseWrapper>
                        <Faq />
                      </SuspenseWrapper>
                    ),
                    loader: tableLoader,
                  },
                  {
                    path: ':id',
                    element: (
                      <SuspenseWrapper>
                        <FaqDetail />
                      </SuspenseWrapper>
                    ),
                  },
                  {
                    path: 'edit',
                    element: (
                      <SuspenseWrapper>
                        <FaqForm />
                      </SuspenseWrapper>
                    ),
                  },
                  {
                    path: 'edit/:id',
                    element: (
                      <SuspenseWrapper>
                        <FaqForm />
                      </SuspenseWrapper>
                    ),
                  },
                  // { path: 'detail/:id', element: <FaqDetail /> },
                  // { path: 'write', element: <FaqEdit /> },
                  // { path: 'edit/:id', element: <FaqEdit /> },
                ],
              },
              {
                path: 'survey',
                children: [
                  {
                    index: true,
                    element: (
                      <SuspenseWrapper>
                        <Survey />
                      </SuspenseWrapper>
                    ),
                  },
                  // { path: 'detail/:id', element: <SurveyDetail /> },
                  // { path: 'write', element: <SurveyEdit /> },
                  // { path: 'edit/:id', element: <SurveyEdit /> },
                ],
              },
            ],
          },
          {
            path: menuPathMap.AC007,
            children: [
              {
                index: true,
                element: (
                  <SuspenseWrapper>
                    <ReportApp />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'cp',
                element: (
                  <SuspenseWrapper>
                    <ReportCp />
                  </SuspenseWrapper>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: PATHS.ROOT,
    element: <LayoutCenter />,
    children: [
      // 로그인 화면 App 진입점
      {
        path: PATHS.LOGIN,
        element: (
          <SuspenseWrapper>
            <Login />
          </SuspenseWrapper>
        ),
      },
      {
        path: PATHS.UNAUTH,
        element: (
          <SuspenseWrapper>
            <UnAuth />
          </SuspenseWrapper>
        ),
      },
      // {
      //   path: PATHS.REGISTER,
      //   element: <Register />,
      // },
      // {
      //   path: PATHS.PASSWORD,
      //   element: <PasswordFind />,
      // },
      // {
      //   path: PATHS.PASSWORD_RESET,
      //   element: <PasswordReset />,
      // },
      // {
      //   path: PATHS.MYINFO,
      //   element: <MyInfo />,
      // },
    ],
  },
];

export default Router;
