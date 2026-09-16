import { pageOverrides, type PageOverrides, type StructuralOp } from "@/lib/page-overrides";
import { savePageOverrides } from "@/lib/page-overrides.functions";

// In-memory mirror of the committed overrides file, plus a debounced writer
// that persists every visual edit back into the project source.

const state: PageOverrides = {
  text: { ...pageOverrides.text },
  ops: [...pageOverrides.ops],
};

let timer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<(ok: boolean) => void>();

function flush() {
  timer = null;
  void savePageOverrides({ data: { text: state.text, ops: state.ops } })
    .then((res) => listeners.forEach((fn) => fn(!!res?.saved)))
    .catch(() => listeners.forEach((fn) => fn(false)));
}

function schedule() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(flush, 400);
}

export function onOverridesSaved(fn: (ok: boolean) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getTextOverrides() {
  return state.text;
}

export function setTextOverride(key: string, value: string) {
  state.text[key] = value;
  schedule();
}

export function getOps() {
  return state.ops;
}

export function recordOp(op: StructuralOp) {
  state.ops.push(op);
  schedule();
}
