import type { ReactNode } from "react";

/** 원본/양식 패널 위 작은 제목줄 */
export function PanelHeader({
  title,
  aside,
}: {
  title: string;
  aside?: ReactNode;
}) {
  return (
    <header className="text-ink-400 flex flex-wrap items-center justify-between gap-2 text-[11px] tracking-widest uppercase">
      <span>{title}</span>
      <span className="min-w-0 normal-case">{aside}</span>
    </header>
  );
}
