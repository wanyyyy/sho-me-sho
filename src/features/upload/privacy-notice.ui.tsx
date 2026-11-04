/** 개인정보 안내. 실제 동작과 어긋나지 않게 유지한다 (모델이 정해지면 전달처를 함께 적는다) */
export function PrivacyNotice() {
  return (
    <section
      aria-label="개인정보 안내"
      className="border-paper-200 bg-paper-50 text-ink-600 rounded-lg border px-4 py-3 text-xs leading-relaxed"
    >
      <p className="text-ink-900 mb-1 font-medium">개인정보 안내</p>
      <ul className="list-disc space-y-0.5 pl-4">
        <li>
          올린 증명서 이미지는 읽기·번역을 위해 서버로 보내지지만 서버나
          데이터베이스에 저장하지 않습니다. 서버에는 접속 IP·시각·사용량만
          남습니다.
        </li>
        <li>
          탭을 닫거나 새로고침하면 올린 파일과 수정한 내용은 모두 사라집니다.
          필요한 결과는 인쇄 또는 PDF 저장으로 직접 보관해 주세요.
        </li>
      </ul>
    </section>
  );
}
