const PATHS = {
  ROOT: '/',
  HOME: '',
  // auth
  LOGIN: 'login',
  REGISTER: 'register',
  PASSWORD: 'password/find',
  PASSWORD_RESET: 'password/reset',
  MYINFO: 'myinfo',
  // unAuthorized
  UNAUTH: 'unauthorized',
  // sidebar
  APPROVAL: 'approval',
  CP_INFO: 'cpinfo',
  CP_INFO_DETAIL: 'cpinfo/detail',
  CP_INFO_EDIT: 'cpinfo/edit',
  ECP_MANAGEMENT: 'ecp/management',
  ECP_CONFIGURATION: 'ecp/configuration',
  ECP_CONFIGURATION_DETAIL: 'ecp/configuration/detail',
  ECP_PROGRAM_EDIT: 'ecp/configuration/edit',
  ECP_SCHEDULE: 'ecp/schedule',
  ECP_SCHEDULE_EDIT: 'ecp/schedule/edit',
  ECP_CREATION: 'ecp/creation',
  ECP_CREATION_EDIT: 'ecp/creation/edit',
  CONTENTS_CP: 'contents/cp',
  CONTENTS_CP_DETAIL: 'contents/cp/detail',
  CONTENTS_CP_WRITE: 'contents/cp/write',
  CONTENTS_CP_EDIT: 'contents/cp/edit',
  CONTENTS_LG: 'contents/lg',
  CONTENTS_LG_DETAIL: 'contents/lg/detail',
  CONTENTS_LG_WRITE: 'contents/lg/write',
  CONTENTS_LG_EDIT: 'contents/lg/edit',
  ACCOUNT: 'account',
  ACCOUNT_DETAIL: 'account/detail',
  ACCOUNT_EDIT: 'account/edit',
  ACCOUNT_ROLE: 'account/role',
  ACCOUNT_ROLE_DETAIL: 'account/role/detail',
  ACCOUNT_ROLE_EDIT: 'account/role/edit',
  NOTICE: 'common/notice',
  NOTICE_DETAIL: 'common/notice/detail',
  NOTICE_EDIT: 'common/notice/edit',
  NOTICE_WRITE: 'common/notice/write',
  HEALTHCAREDB: 'common/healthcaredb',
  HEALTHCAREDB_DETAIL: 'common/healthcaredb/detail',
  HEALTHCAREDB_EDIT: 'common/healthcaredb/edit',
  HEALTHCAREDB_WRITE: 'common/healthcaredb/write',
  CS_RESPONSE: 'common/csresponse',
  CS_RESPONSE_DETAIL: 'common/csresponse/detail',
  CS_RESPONSE_EDIT: 'common/csresponse/edit',
  CS_RESPONSE_WRITE: 'common/csresponse/write',
  FAQ: 'common/faq',
  FAQ_DETAIL: 'common/faq/detail',
  FAQ_EDIT: 'common/faq/edit',
  FAQ_WRITE: 'common/faq/write',
  SURVEY: 'common/survey',
  SURVEY_DETAIL: 'common/survey/detail',
  SURVEY_EDIT: 'common/survey/edit',
  SURVEY_WRITE: 'common/survey/write',
  REPORT: 'report',
  REPORT_CP: 'report/cp',
};

export default Object.freeze(PATHS);
