import { create } from "zustand";
import { readAccessCode, writeAccessCode } from "@/shared/lib/access-code";

type AccessState = {
  unlocked: boolean;
  /** 검증을 통과한 코드를 탭에 둔다. 서버 호출 때 같은 코드를 보낸다 */
  unlock: (code: string) => void;
};

export const useAccessStore = create<AccessState>()((set) => ({
  unlocked: readAccessCode() !== "",
  unlock: (code) => {
    writeAccessCode(code.trim());
    set({ unlocked: true });
  },
}));
