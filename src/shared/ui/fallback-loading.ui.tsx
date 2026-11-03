export function FallbackLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="text-ink-400 flex min-h-dvh items-center justify-center text-sm"
    >
      로딩 중…
    </div>
  );
}
