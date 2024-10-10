import PATH from '@router/path';

interface SubItem {
  subTitle: string;
  path: string;
}

interface MenuItem {
  mainTitle: string;
  path?: string;
  subItem?: SubItem[];
}

interface PathMenuItem {
  mainTitle: string;
  path: string;
  subItem?: never;
}

const MENU_MAP: (MenuItem | PathMenuItem)[] = [
  { mainTitle: '승인 관리', path: PATH.APPROVAL },
  {
    mainTitle: 'CP 관리',
    subItem: [{ subTitle: 'CP 정보', path: PATH.CP_INFO }],
  },
  {
    mainTitle: '외부 센터프로그램 관리',
    subItem: [{ subTitle: '프로그램 구성', path: PATH.ECP_CONFIGURATION }],
  },
  {
    mainTitle: '컨텐츠 관리',
    subItem: [
      { subTitle: 'CP 컨텐츠 관리', path: PATH.CONTENTS_CP },
      { subTitle: '자사 컨텐츠 관리', path: PATH.CONTENTS_LG },
    ],
  },
  {
    mainTitle: '관리자 계정 관리',
    subItem: [
      { subTitle: '관리자 계정', path: PATH.ACCOUNT },
      { subTitle: '관리자 등급설정', path: PATH.ACCOUNT_ROLE },
    ],
  },
  {
    mainTitle: '기타 관리',
    subItem: [
      { subTitle: '공지사항', path: PATH.NOTICE },
      { subTitle: '헬스케어 DB', path: PATH.HEALTHCAREDB },
      { subTitle: 'CS 대응', path: PATH.CS_RESPONSE },
      { subTitle: 'FAQ', path: PATH.FAQ },
      { subTitle: '설문', path: PATH.SURVEY },
    ],
  },
  {
    mainTitle: '통계 리포트',
    subItem: [
      { subTitle: '앱 통계', path: PATH.REPORT },
      { subTitle: 'CP 통계', path: PATH.REPORT_CP },
    ],
  },
];

export default MENU_MAP;
