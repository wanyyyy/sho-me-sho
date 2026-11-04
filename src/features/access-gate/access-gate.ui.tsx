import { type FormEvent, type ReactNode, useId, useState } from "react";
import { Button } from "@/shared/ui";
import { GATE_ENABLED, verifyAccessCode } from "./access.lib";
import { useAccessStore } from "./access.store";

/** 접근 코드를 통과해야 children 을 보여 준다. 해시가 설정돼 있지 않으면 그냥 통과 */
export function AccessGate({ children }: { children: ReactNode }) {
  const unlocked = useAccessStore((s) => s.unlocked);
  if (!GATE_ENABLED || unlocked) return children;
  return <AccessForm />;
}

function AccessForm() {
  const unlock = useAccessStore((s) => s.unlock);
  const inputId = useId();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setChecking(true);
    const ok = await verifyAccessCode(code);
    setChecking(false);
    if (ok) unlock(code);
    else setError(true);
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 py-12">
      <header className="flex flex-col gap-2">
        <p className="text-accent-500 text-xs tracking-[0.3em]">
          受理証明書 TRANSLATOR
        </p>
        <h1 className="text-2xl font-semibold">접근 코드</h1>
        <p className="text-ink-600 text-sm">
          안내받은 코드를 입력하면 들어갈 수 있습니다.
        </p>
      </header>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <label htmlFor={inputId} className="sr-only">
          접근 코드
        </label>
        <input
          id={inputId}
          type="password"
          autoComplete="off"
          autoFocus
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(false);
          }}
          className="border-paper-200 bg-paper-50 text-ink-900 focus:border-accent-500 h-12 w-full rounded-lg border px-4 text-base outline-none"
        />
        {error && (
          <p role="alert" className="text-danger-500 text-sm">
            코드가 맞지 않습니다.
          </p>
        )}
        <Button type="submit" disabled={checking || code.trim() === ""} full>
          들어가기
        </Button>
      </form>
    </main>
  );
}
