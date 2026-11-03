/** 개인정보 안내. 실제 동작과 어긋나지 않게 유지한다 (엔진·서버가 붙으면 함께 고친다) */
export function PrivacyNotice() {
  return (
    <section
      aria-label="개인정보 안내"
      className="border-paper-200 bg-paper-50 text-ink-600 rounded-lg border px-4 py-3 text-xs leading-relaxed"
    >
      <p className="text-ink-900 mb-1 font-medium">개인정보 안내</p>
      <ul className="list-disc space-y-0.5 pl-4">
        <li>
          올린 증명서 파일과 번역 내용은 서버나 데이터베이스에 저장하지
          않습니다. 모든 처리는 지금 쓰고 있는 브라우저 안에서만 이루어집니다.
        </li>
        <li>
          탭을 닫거나 새로고침하면 올린 파일과 수정한 내용은 모두 사라집니다.
          필요한 결과는 인쇄 또는 PDF 저장으로 직접 보관해 주세요.
        </li>
      </ul>
    </section>
  );
}
