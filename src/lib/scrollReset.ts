/** Reset window and all scrollable containers under `root` to the top. */
export function resetPageScroll(root?: HTMLElement | null) {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  if (!root) return;

  root.scrollTop = 0;
  root.querySelectorAll<HTMLElement>("*").forEach((el) => {
    const { overflowY } = window.getComputedStyle(el);
    if ((overflowY === "auto" || overflowY === "scroll") && el.scrollTop !== 0) {
      el.scrollTop = 0;
    }
  });
}

/** Run scroll reset immediately and again after layout settles. */
export function resetPageScrollAfterPaint(root?: HTMLElement | null) {
  resetPageScroll(root);
  window.requestAnimationFrame(() => {
    resetPageScroll(root);
    window.setTimeout(() => resetPageScroll(root), 0);
  });
}
