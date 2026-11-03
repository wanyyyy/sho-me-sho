import { useState } from "react";
import { Button, PrintPreviewDialog } from "@/shared/ui";
import {
  CertificateSheet,
  FIELD_KEYS,
  fieldValue,
  TranslatorBlock,
  useCertificateDocument,
  useTranslatorInfo,
} from "@/entities/certificate";

/** 인쇄 미리보기를 열고, 브라우저 인쇄창에서 PDF 로 저장하게 한다 */
export function ExportButton() {
  const doc = useCertificateDocument();
  const translator = useTranslatorInfo();
  const [open, setOpen] = useState(false);
  if (!doc) return null;

  const title = `수리증명서_번역_${fieldValue(doc, FIELD_KEYS.issueNumber) || doc.id.slice(0, 8)}`;

  return (
    <>
      <Button onClick={() => setOpen(true)}>인쇄 · PDF 저장</Button>
      {/* 닫혀 있을 때는 아예 그리지 않아 칸 수정마다 시트를 다시 만들지 않는다 */}
      {open && (
        <PrintPreviewDialog
          open
          onClose={() => setOpen(false)}
          documentTitle={title}
          orientation="landscape"
        >
          <CertificateSheet
            doc={doc}
            cell={(field) => (
              <span className="whitespace-pre-wrap">
                {fieldValue(doc, field.key)}
              </span>
            )}
            footer={<TranslatorBlock info={translator} />}
          />
        </PrintPreviewDialog>
      )}
    </>
  );
}
