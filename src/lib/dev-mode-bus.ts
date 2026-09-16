// Minimal coordination bus so dev edit modes are mutually exclusive:
// activating one deactivates the other.

type Listener = (source: string) => void;

const listeners = new Set<Listener>();

export function activateDevMode(source: string) {
  listeners.forEach((fn) => fn(source));
}

export function onDevModeActivate(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
