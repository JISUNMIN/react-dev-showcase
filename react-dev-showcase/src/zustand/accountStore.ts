import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type ClassName = 'SUPER' | 'ADMIN' | 'CP_SUPER' | 'CP_ADMIN';

export interface AdminImageFile {
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

export interface Accounts {
  adminInfoId: number;
  adminId: string;
  adminName: string;
  adminNickname: string;
  adminCountry: string;
  adminLevelId: number;
  className: ClassName;
  adminApproveStatus: string;
  adminUseStatus: string;
  registDate: string;
}

export interface AccountsDetail extends Omit<Accounts, 'adminApproveStatus' | 'registDate'> {
  adminClassInfoId: number;
  approvalStatus: string;
  approvalAuthority: boolean;
  adminImageFile?: AdminImageFile;
}

export interface AccountsState {
  accounts: Accounts | null;
  setAccounts: (accounts: Accounts) => void;
}

export interface AccountsSetting {
  adminClassInfoId: number;
  className: string;
  approvalAuthority: boolean;
  registDate: string;
}

export interface AccountsSettingDetail {
  className: string;
  approvalAuthority: boolean;
  accessibleMenuList: [{ code: string; value: string }];
}

const accountStore = create<AccountsState>()(
  devtools(
    persist(
      (set) => ({
        accounts: null,
        setAccounts: (accounts) => set({ accounts }),
      }),
      {
        name: 'account',
      }
    )
  )
);

export { accountStore };
