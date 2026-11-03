import { create } from "zustand";

const KEY = "access-unlocked";

/** 탭 단위로만 기억 (sessionStorage). 개인정보가 아니라 "이 탭에서 코드를 통과했다"는 표시 */
function readUnlocked(): boolean {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

type AccessState = {
  unlocked: boolean;
  unlock: () => void;
};

export const useAccessStore = create<AccessState>()((set) => ({
  unlocked: readUnlocked(),
  unlock: () => {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      // 저장 못 해도 이 탭 안에서는 열린 상태 유지
    }
    set({ unlocked: true });
  },
}));
