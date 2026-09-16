import { useEffect } from "react";
import { resolvePath } from "@/lib/dom-path";
import { getOps } from "@/lib/overrides-store";

/**
 * Replays the persisted structural edits (duplicate / remove / move) recorded
 * by the copy & paste mode, so the published page matches what was edited.
 */
export function OverridesApplier() {
  useEffect(() => {
    const apply = () => {
      for (const op of getOps()) {
        const el = resolvePath(op.path);
        if (!el) continue;
        if (op.type === "remove") {
          el.remove();
          continue;
        }
        if (op.type === "duplicate") {
          const clone = el.cloneNode(true) as HTMLElement;
          clone.removeAttribute("id");
          el.parentElement?.insertBefore(clone, el.nextSibling);
          continue;
        }
        const target = resolvePath(op.targetPath);
        if (!target?.parentElement) continue;
        target.parentElement.insertBefore(el, op.after ? target.nextSibling : target);
      }
    };
    const id = requestAnimationFrame(apply);
    return () => cancelAnimationFrame(id);
  }, []);

  return null;
}
