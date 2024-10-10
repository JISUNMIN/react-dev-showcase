import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface AccessibleMenu {
  code: string;
  value: string;
}

export interface CpManageDetail {
  cpManageInfoId: number;
  cpManageDetailId: number;
  cpName: string;
  introduction: string;
  features: string[];
  languageType: string;
}

export interface CpManagement {
  cpManagementInfoId: number;
  mainCategory: string;
  subCategory: string[];
  cpManageDetailList: CpManageDetail[];
}

export interface ProfileImageFile {
  fileId: number;
  fileType: string;
  fileLocation: string;
  fileUrl: string;
  originalFileName: string;
  realFileName: string;
  playTime: number;
  fileSize: number;
  useYn: boolean;
  registDate: string;
  registUser: string;
  registUtc: string;
}

export interface UserInfo {
  adminInfoId: number;
  adminId: string;
  adminName: string;
  adminNickname: string;
  adminCountry: string;
  token: string;
  refreshToken: string;
  className: string;
  accessibleMenuList: AccessibleMenu[];
  cpManagementList: CpManagement[];
  approvalAuthority: boolean;
  profileImageFile: ProfileImageFile;
  adminProfileImageFileId: number;
  cpManagementInfoId: number;
  adminType: string;
  phoneNumber: string;
}

export interface UserState {
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo) => void;
  clearUser: () => void;
}

const userInfoStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        userInfo: null,
        setUserInfo: (userInfo) => set({ userInfo }),
        clearUser: () => set({ userInfo: null }),
      }),
      {
        name: 'userInfo',
      }
    )
  )
);

export { userInfoStore };
