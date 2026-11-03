import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PrintPreviewDialog } from "./print-preview-dialog.ui";

function stubFramePrint() {
  const printSpy = vi.fn();
  const contentWindow = Object.getOwnPropertyDescriptor(
    HTMLIFrameElement.prototype,
    "contentWindow",
  )!.get!;
  vi.spyOn(
    HTMLIFrameElement.prototype,
    "contentWindow",
    "get",
  ).mockImplementation(function (this: HTMLIFrameElement) {
    const frameWindow = contentWindow.call(this) as Window | null;
    if (frameWindow) Object.assign(frameWindow, { print: printSpy });
    return frameWindow;
  });
  return printSpy;
}

const sheetOf = (heading: string) =>
  screen
    .getByRole("heading", { name: heading })
    // eslint-disable-next-line testing-library/no-node-access
    .closest("[data-orientation]");

describe("PrintPreviewDialog", () => {
  it("내용을 용지 방향이 지정된 시트에 담고, 기본은 세로다", () => {
    const { rerender } = render(
      <PrintPreviewDialog open onClose={() => {}} documentTitle="문서">
        <h1>수리증명서</h1>
      </PrintPreviewDialog>,
    );
    expect(sheetOf("수리증명서")).toHaveAttribute(
      "data-orientation",
      "portrait",
    );

    rerender(
      <PrintPreviewDialog
        open
        onClose={() => {}}
        documentTitle="문서"
        orientation="landscape"
      >
        <h1>수리증명서</h1>
      </PrintPreviewDialog>,
    );
    expect(sheetOf("수리증명서")).toHaveAttribute(
      "data-orientation",
      "landscape",
    );
  });

  it("출력은 시트만 복제한 iframe 을 문서 제목으로 인쇄한다", async () => {
    const printSpy = stubFramePrint();
    const user = userEvent.setup();
    render(
      <PrintPreviewDialog
        open
        onClose={() => {}}
        documentTitle="수리증명서_0001"
      >
        <h1>수리증명서</h1>
        <p>본문</p>
      </PrintPreviewDialog>,
    );

    const dialog = screen.getByRole("dialog", { name: "인쇄 미리보기" });
    await user.click(
      within(dialog).getByRole("button", { name: "인쇄 · PDF 저장" }),
    );

    await waitFor(() => expect(printSpy).toHaveBeenCalledTimes(1));
    // eslint-disable-next-line testing-library/no-node-access
    const frame = document.querySelector<HTMLIFrameElement>(
      "iframe[data-print-frame]",
    );
    expect(frame?.contentDocument?.title).toBe("수리증명서_0001");
    expect(frame?.contentDocument?.body.textContent).toContain("본문");
    expect(frame?.contentDocument?.body.textContent).not.toContain(
      "인쇄 · PDF 저장",
    );
  });

  it("닫기를 누르면 onClose 를 부른다", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <PrintPreviewDialog open onClose={onClose} documentTitle="문서">
        <h1>수리증명서</h1>
      </PrintPreviewDialog>,
    );
    await user.click(screen.getByRole("button", { name: "닫기" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
