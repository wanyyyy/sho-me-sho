import { cn } from "@/shared/lib/utils";

type SealMarkProps = {
  /** 안에 들어갈 글자 ("직인" / "職印") */
  label: string;
  className?: string;
};

/** 원본의 공인(公印) 자리. 붉은 정사각 테두리 안에 글자 — 번역본임을 나타내는 표시이며 실제 도장을 대신하지 않는다 */
export function SealMark({ label, className }: SealMarkProps) {
  return (
    <span
      aria-label={label}
      className={cn(
        "border-danger-500 text-danger-500 inline-flex aspect-square h-11 shrink-0 items-center justify-center border-[2.5px] text-[13px] leading-none font-bold tracking-[0.2em] [print-color-adjust:exact]",
        className,
      )}
    >
      {label}
    </span>
  );
}
