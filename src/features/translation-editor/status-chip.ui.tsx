import { cn } from "@/shared/lib/utils";
import { FIELD_STATUS_LABELS, FieldStatus } from "@/entities/certificate";

/** 상태별 색. 칸 테두리와 범례 칩이 같은 표를 쓴다 */
export const STATUS_TONE_CLASS: Record<
  FieldStatus,
  { chip: string; cell: string }
> = {
  ok: {
    chip: "bg-success-100 text-success-500",
    cell: "border-success-500/40 bg-success-100/40",
  },
  review: {
    chip: "bg-warning-100 text-warning-500",
    cell: "border-warning-500 bg-warning-100",
  },
  edited: {
    chip: "bg-accent-100 text-accent-600",
    cell: "border-accent-500 bg-accent-100",
  },
  missing: {
    chip: "bg-danger-100 text-danger-500",
    cell: "border-paper-200 bg-white",
  },
};

export function StatusChip({
  status,
  count,
}: {
  status: FieldStatus;
  count?: number;
}) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
        STATUS_TONE_CLASS[status].chip,
      )}
    >
      {FIELD_STATUS_LABELS[status]}
      {count !== undefined && ` ${count}`}
    </span>
  );
}
