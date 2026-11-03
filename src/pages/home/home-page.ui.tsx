import { PrivacyNotice, UploadSection } from "@/features/upload";

export function HomePage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 py-8 sm:gap-8 sm:py-14">
      <header className="flex flex-col gap-3">
        <p className="text-accent-500 text-xs tracking-[0.3em]">
          受理証明書 TRANSLATOR
        </p>
        <h1 className="text-2xl font-semibold sm:text-3xl">수리증명서 번역</h1>
        <p className="text-ink-600 text-sm">
          일본 관공서에서 받은 수리증명서 사진이나 PDF 를 올리면 내용을 읽어
          한국어 양식에 채워 줍니다. 틀린 곳은 칸을 클릭해 바로 고칠 수
          있습니다.
        </p>
      </header>
      <UploadSection />
      <PrivacyNotice />
    </main>
  );
}
