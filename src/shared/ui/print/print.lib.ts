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
  for (const node of document.head.querySelectorAll(
    'link[rel="stylesheet"], style',
  )) {
    doc.head.appendChild(node.cloneNode(true));
  }
  doc.body.appendChild(content.cloneNode(true));

  await waitForStylesheets(doc);
  await doc.fonts?.ready;

  win.addEventListener("afterprint", () => frame.remove(), { once: true });
  win.focus();
  win.print();
}
