import type { TemplateField } from "@/shared/lib/template";
import { cn } from "@/shared/lib/utils";
import { sheetInputClassName } from "@/shared/ui";
import { FIELD_STATUS_LABELS, FieldStatus } from "@/entities/certificate";
import { STATUS_TONE_CLASS } from "./status-chip.ui";

type EditableCellProps = {
  field: TemplateField;
  value: string;
  /** 일본어 원문 (툴팁) */
  source?: string;
  status: FieldStatus;
  onChange: (key: string, value: string) => void;
  className?: string;
};

/** 양식 칸 하나 = input. 테두리 색이 상태, title 에 원문 */
export function EditableCell({
  field,
  value,
  source,
  status,
  onChange,
  className,
}: EditableCellProps) {
  return (
    <input
      aria-label={field.labelKo}
      title={[
        `${field.labelKo} · ${FIELD_STATUS_LABELS[status]}`,
        source && `원문: ${source}`,
      ]
        .filter(Boolean)
        .join("\n")}
      value={value}
      onChange={(e) => onChange(field.key, e.target.value)}
      className={cn(
        sheetInputClassName,
        "w-full min-w-0",
        STATUS_TONE_CLASS[status].cell,
        className,
      )}
    />
  );
}
