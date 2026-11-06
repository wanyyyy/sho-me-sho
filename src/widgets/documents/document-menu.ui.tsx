import { Link } from "react-router-dom";
import { routePaths } from "@/shared/lib/react-router";
import { DOCUMENT_TYPES, documentOf } from "./documents.model";

const LANG_LABEL = { ja: "日本語", ko: "한국어" } as const;

/** 홈: 번역할 서류를 고르는 버튼 메뉴. 등록된 서류에서 자동으로 만든다 */
export function DocumentMenu() {
  return (
    <nav aria-label="서류 선택" className="grid gap-3 sm:grid-cols-2">
      {DOCUMENT_TYPES.map((type) => {
        const t = documentOf(type).template;
        return (
          <Link
            key={type}
            to={routePaths.upload(type)}
            className="border-paper-200 bg-paper-50 hover:border-accent-500 focus-visible:border-accent-500 flex flex-col gap-2 rounded-2xl border-2 p-5 no-underline transition-colors outline-none"
          >
            <span className="text-accent-500 text-xs tracking-wider">
              {LANG_LABEL[t.source]} → {LANG_LABEL[t.target]}
            </span>
            <span className="text-ink-900 text-lg font-semibold">
              {t.title.ko}
              <span className="text-ink-400 ml-2 text-sm font-normal">
                {t.title.ja}
              </span>
            </span>
            <span className="text-ink-600 text-sm">{t.description}</span>
          </Link>
        );
      })}
    </nav>
  );
}
