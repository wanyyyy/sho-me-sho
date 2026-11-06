import { type ComponentType, useState } from "react";
import { Button, PrintPreviewDialog, type SheetProps } from "@/shared/ui";
import {
  CertificateDocument,
  fieldValue,
  TranslatorBlock,
  useCertificateDocument,
  useTranslatorInfo,
} from "@/entities/certificate";

type ExportButtonProps = {
  /** 문서 종류에 맞는 양식 시트 (widgets/documents 가 고른다) */
  Sheet: ComponentType<SheetProps<CertificateDocument>>;
};

/** 인쇄 미리보기를 열고, 브라우저 인쇄창에서 PDF 로 저장하게 한다 */
export function ExportButton({ Sheet }: ExportButtonProps) {
  const doc = useCertificateDocument();
  const translator = useTranslatorInfo();
  const [open, setOpen] = useState(false);
  if (!doc) return null;

  const { template } = doc;
  const value = (key: string) => fieldValue(doc, key);

  return (
    <>
      <Button onClick={() => setOpen(true)}>인쇄 · PDF 저장</Button>
      {/* 닫혀 있을 때는 아예 그리지 않아 칸 수정마다 시트를 다시 만들지 않는다 */}
      {open && (
        <PrintPreviewDialog
          open
          onClose={() => setOpen(false)}
          documentTitle={template.fileName({ id: doc.id, value })}
          orientation={template.orientation}
        >
          <Sheet
            doc={doc}
            cell={(field) => (
              <span className="whitespace-pre-wrap">{value(field.key)}</span>
            )}
            value={value}
            footer={
              <TranslatorBlock info={translator} lang={template.target} />
            }
          />
        </PrintPreviewDialog>
      )}
    </>
  );
}
