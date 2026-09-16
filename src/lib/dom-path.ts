// Stable-ish addressing of page elements by child index, ignoring dev-tool UI
// so the overlays/menus of the edit tools never shift recorded paths.

const UI_SELECTOR = "[data-dup-ui],[data-inspect-ui]";

function isUi(el: Element) {
  return !!el.closest(UI_SELECTOR);
}

function realChildren(parent: Element): Element[] {
  return Array.from(parent.children).filter((c) => !isUi(c));
}

export function pathOf(el: Element): number[] | null {
  const path: number[] = [];
  let node: Element | null = el;
  while (node && node !== document.body) {
    const parent: Element | null = node.parentElement;
    if (!parent) return null;
    const index = realChildren(parent).indexOf(node);
    if (index < 0) return null;
    path.unshift(index);
    node = parent;
  }
  return node === document.body ? path : null;
}

export function resolvePath(path: number[]): HTMLElement | null {
  let node: Element = document.body;
  for (const index of path) {
    const next = realChildren(node)[index];
    if (!next) return null;
    node = next;
  }
  return node === document.body ? null : (node as HTMLElement);
}
