import { Link, Navigate, useParams } from "react-router-dom";
import { routePaths } from "@/shared/lib/react-router";
import { PrivacyNotice, UploadSection } from "@/features/upload";
import { documentOf, parseDocumentType } from "@/widgets/documents";

const LANG_LABEL = { ja: "日本語", ko: "한국어" } as const;

/** 서류 종류별 업로드 화면. URL 의 서류 종류가 틀리면 홈으로 */
export function UploadPage() {
  const { documentType: param } = useParams();
  const documentType = parseDocumentType(param);
  if (!documentType) return <Navigate to={routePaths.home()} replace />;
  const { template: t, sample } = documentOf(documentType);

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 py-8 sm:gap-8 sm:py-14">
      <header className="flex flex-col gap-3">
        <Link
          to={routePaths.home()}
          className="text-ink-600 hover:text-ink-900 w-fit text-sm"
        >
          ← 다른 서류 고르기
        </Link>
        <p className="text-accent-500 text-xs tracking-[0.3em]">
          {LANG_LABEL[t.source]} → {LANG_LABEL[t.target]}
        </p>
        <h1 className="text-2xl font-semibold sm:text-3xl">
          {t.title.ko} 번역
          <span className="text-ink-400 ml-2 text-base font-normal">
            {t.title.ja}
          </span>
        </h1>
        <p className="text-ink-600 text-sm">{t.description}</p>
      </header>
      <UploadSection template={t} sample={sample} />
      <PrivacyNotice />
    </main>
  );
}
