import { Navigate } from "react-router-dom";
import { routePaths } from "@/shared/lib/react-router";
import { useCertificateDocument } from "@/entities/certificate";
import { ExportButton } from "@/features/export";
import {
  EditorToolbar,
  SourcePanel,
  TemplatePanel,
} from "@/features/translation-editor";

export function EditorPage() {
  const doc = useCertificateDocument();
  if (!doc) return <Navigate to={routePaths.home()} replace />;

  return (
    <main className="flex flex-col gap-4 pb-6 sm:gap-5 sm:pb-8">
      <EditorToolbar actions={<ExportButton />} />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.2fr] lg:gap-6">
        <SourcePanel />
        <TemplatePanel />
      </div>
    </main>
  );
}
