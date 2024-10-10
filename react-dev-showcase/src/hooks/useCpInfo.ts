import { userInfoStore } from '@src/zustand';

const useCpInfo = () => {
  const { cpManagementList, cpManageDetailList } = userInfoStore((state) => ({
    cpManagementList: state?.userInfo?.cpManagementList[0],
    cpManageDetailList: state?.userInfo?.cpManagementList[0].cpManageDetailList[0],
  })); // NOTE: list로 주는 이유를 잘모르겠군요.
  return {
    cpManagement: cpManagementList,
    cpManageDetail: cpManageDetailList,
  };
};

export default useCpInfo;
