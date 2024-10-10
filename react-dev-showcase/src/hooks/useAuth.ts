import { userInfoStore } from '@src/zustand';

const useAuth = () => {
  const { userInfo } = userInfoStore((state) => state);

  const adminName = userInfo?.adminName ?? '';
  const adminType = userInfo?.adminType ?? '';
  const className = userInfo?.className ?? '';
  const accessibleMenuList = userInfo?.accessibleMenuList ?? [];
  const approvalAuthority = userInfo?.approvalAuthority;

  return {
    isAuthenticated: !!adminName, // NOTE: 이 친구는 세션 시간이 되어야하지 않을까... 일단  name으로 뒀는데 조치가 필요함
    adminType,
    className,
    accessibleMenuList,
    approvalAuthority,
  };
};

export default useAuth;
