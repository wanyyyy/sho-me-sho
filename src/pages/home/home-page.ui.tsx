import { PrivacyNotice } from "@/features/upload";
import { DocumentMenu } from "@/widgets/documents";

export function HomePage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 py-8 sm:gap-8 sm:py-14">
      <header className="flex flex-col gap-3">
        <p className="text-accent-500 text-xs tracking-[0.3em]">
          証明書 TRANSLATOR
        </p>
        <h1 className="text-2xl font-semibold sm:text-3xl">증명서 번역</h1>
        <p className="text-ink-600 text-sm">
          한일 혼인신고에 쓰는 증명서 사진이나 PDF 를 올리면 내용을 읽어 제출용
          양식에 채워 줍니다. 번역할 서류를 고르세요.
        </p>
      </header>
      <DocumentMenu />
      <PrivacyNotice />
    </main>
  );
}
