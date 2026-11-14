const FRAME_ATTRIBUTE = "data-print-frame";

function waitForStylesheets(doc: Document): Promise<void[]> {
  return Promise.all(
    [...doc.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].map(
      (link) =>
        new Promise<void>((resolve) => {
          link.onload = () => resolve();
          link.onerror = () => resolve();
        }),
    ),
  );
}

/**
 * 지금 화면에 적용된 스타일을 iframe 으로 옮긴다. 같은 출처 스타일시트는 규칙을 <style> 로 그대로 복사한다.
 * <link> 를 복제해 다시 받으면, 탭을 연 뒤 새로 배포된 경우 해시가 바뀐 옛 CSS 파일이 없어
 * (SPA rewrite 로 index.html 을 받아) 스타일 없이 인쇄된다. 규칙을 읽을 수 없는 외부 시트(글꼴 CDN)만 link 로 복제한다
 */
function copyStyles(doc: Document) {
  for (const sheet of document.styleSheets) {
    let css: string | null = null;
    try {
      css = [...sheet.cssRules].map((rule) => rule.cssText).join("\n");
    } catch {
      css = null;
    }
    if (css !== null) {
      const style = doc.createElement("style");
      if (sheet.media.mediaText) style.media = sheet.media.mediaText;
      style.textContent = css;
      doc.head.appendChild(style);
    } else if (sheet.ownerNode instanceof HTMLLinkElement) {
      doc.head.appendChild(sheet.ownerNode.cloneNode(true));
    }
  }
}

/**
 * 요소 하나만 숨은 iframe 에 복제해 인쇄한다 (화면의 나머지는 제외).
 * 브라우저 인쇄창에서 "PDF로 저장" 하면 title 이 파일명이 된다
 */
export async function printElement(content: HTMLElement, title: string) {
  document.querySelector(`iframe[${FRAME_ATTRIBUTE}]`)?.remove();

  const frame = document.createElement("iframe");
  frame.setAttribute(FRAME_ATTRIBUTE, "");
  frame.setAttribute("aria-hidden", "true");
  frame.style.cssText =
    "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;";
  document.body.appendChild(frame);

  const doc = frame.contentDocument;
  const win = frame.contentWindow;
  if (!doc || !win) return;

  doc.open();
  doc.write("<!doctype html><html><head></head><body></body></html>");
  doc.close();
  doc.title = title;
  copyStyles(doc);
  doc.body.appendChild(content.cloneNode(true));

  await waitForStylesheets(doc);
  await doc.fonts?.ready;

  win.addEventListener("afterprint", () => frame.remove(), { once: true });
  win.focus();
  win.print();
}
