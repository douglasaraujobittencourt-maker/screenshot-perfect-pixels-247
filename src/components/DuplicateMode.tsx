import { useCallback, useEffect, useRef, useState } from "react";
import { ClipboardPaste, Copy, CopyPlus, GripVertical, Plus, Trash2, X } from "lucide-react";
import { activateDevMode, onDevModeActivate } from "@/lib/dev-mode-bus";
import { pathOf } from "@/lib/dom-path";
import { onOverridesSaved, recordOp } from "@/lib/overrides-store";

type Rect = { top: number; left: number; width: number; height: number };
type Menu = { x: number; y: number } | null;
type Guide = { top: number; left: number; width: number } | null;

const IGNORE_ATTR = "data-dup-ui";
const IGNORE_SELECTOR = "[data-dup-ui],[data-inspect-ui]";

function labelOf(el: HTMLElement) {
  const tag = el.tagName.toLowerCase();
  const id = el.id ? `#${el.id}` : "";
  const first = (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean)[0];
  return `${tag}${id}${first ? `.${first}` : ""}`;
}

function codeOf(el: HTMLElement) {
  const jsx = el.outerHTML
    .replace(/\sclass=/g, " className=")
    .replace(/\sfor=/g, " htmlFor=");
  return [
    `/* ${labelOf(el)} */`,
    "",
    "/* classes */",
    el.getAttribute("class") || "(sem classes)",
    "",
    "/* JSX */",
    jsx,
  ].join("\n");
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
}

export function DuplicateMode() {
  const [active, setActive] = useState(false);
  const [rect, setRect] = useState<Rect | null>(null);
  const [label, setLabel] = useState("");
  const [menu, setMenu] = useState<Menu>(null);
  const [toast, setToast] = useState<string | null>(null);
  const hoverRef = useRef<HTMLElement | null>(null);
  const selectedRef = useRef<HTMLElement | null>(null);
  const clipboardRef = useRef<HTMLElement | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<HTMLElement | null>(null);
  const dropRef = useRef<{ target: HTMLElement; after: boolean } | null>(null);
  const [guide, setGuide] = useState<Guide>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const duplicate = useCallback(
    (source: HTMLElement | null, anchor: HTMLElement | null) => {
      if (!source || !anchor?.parentElement) return;
      const sourcePath = pathOf(source);
      const anchorPath = pathOf(anchor);
      const clone = source.cloneNode(true) as HTMLElement;
      clone.removeAttribute("id");
      anchor.parentElement.insertBefore(clone, anchor.nextSibling);
      if (sourcePath) {
        recordOp({ type: "duplicate", path: sourcePath });
        if (anchor !== source && anchorPath) {
          const clonePath = pathOf(clone);
          if (clonePath) {
            recordOp({ type: "move", path: clonePath, targetPath: anchorPath, after: true });
          }
        }
      }
      showToast("Elemento duplicado — salvando no código...");
    },
    [showToast],
  );

  const remove = useCallback(
    (target: HTMLElement | null) => {
      if (!target || !target.parentElement) return;
      const path = pathOf(target);
      target.remove();
      if (path) recordOp({ type: "remove", path });
      showToast("Elemento excluído — salvando no código...");
    },
    [showToast],
  );

  // Confirm persistence into the project source files.
  useEffect(
    () => {
      const off = onOverridesSaved((ok) =>
        showToast(
          ok
            ? "Alterações salvas no código-fonte do projeto."
            : "Não foi possível salvar no código-fonte (somente leitura no site publicado).",
        ),
      );
      return () => {
        off();
      };
    },
    [showToast],
  );

  // Exit this mode when another dev mode activates.
  useEffect(() => onDevModeActivate((source) => {
    if (source !== "duplicate") setActive(false);
  }), []);

  useEffect(() => {
    if (!active) {
      setRect(null);
      setMenu(null);
      hoverRef.current = null;
      selectedRef.current = null;
      return;
    }

    const isUi = (el: HTMLElement | null) =>
      !!el?.closest?.(IGNORE_SELECTOR) || el === document.body || el === document.documentElement;

    const track = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      setLabel(`${labelOf(el)} · ${r.width | 0}×${r.height | 0}`);
    };

    const onMove = (e: MouseEvent) => {
      if (menu || dragging) return;
      const el = e.target as HTMLElement | null;
      if (el?.closest?.(IGNORE_SELECTOR)) return; // sobre a UI do modo: mantém o destaque atual
      if (!el || el === document.body || el === document.documentElement) {
        setRect(null);
        hoverRef.current = null;
        return;
      }
      hoverRef.current = el;
      track(el);
    };

    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el || isUi(el)) return;
      e.preventDefault();
      e.stopPropagation();
      selectedRef.current = el;
      track(el);
      setMenu({ x: e.clientX, y: e.clientY });
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (menu) setMenu(null);
        else setActive(false);
        return;
      }
      const target = selectedRef.current ?? hoverRef.current;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "c" && target) {
        e.preventDefault();
        clipboardRef.current = target;
        void copyText(codeOf(target));
        showToast("Elemento/Código copiado com sucesso!");
      }
      if (mod && e.key.toLowerCase() === "v" && clipboardRef.current) {
        e.preventDefault();
        duplicate(clipboardRef.current, target ?? clipboardRef.current);
      }
    };

    const onScroll = () => {
      const el = selectedRef.current ?? hoverRef.current;
      if (el) track(el);
    };

    document.addEventListener("mousemove", onMove, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey, true);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey, true);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [active, menu, dragging, showToast, duplicate]);

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: MouseEvent) => {
      const dragged = dragRef.current;
      if (!dragged) return;
      const under = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (
        !under ||
        under.closest(IGNORE_SELECTOR) ||
        under === document.body ||
        under === document.documentElement ||
        under === dragged ||
        dragged.contains(under)
      ) {
        dropRef.current = null;
        setGuide(null);
        return;
      }
      const r = under.getBoundingClientRect();
      const after = e.clientY > r.top + r.height / 2;
      dropRef.current = { target: under, after };
      setGuide({ top: after ? r.bottom : r.top, left: r.left, width: r.width });
    };

    const finish = () => {
      const dragged = dragRef.current;
      const drop = dropRef.current;
      if (dragged && drop?.target.parentElement) {
        const draggedPath = pathOf(dragged);
        const targetPath = pathOf(drop.target);
        drop.target.parentElement.insertBefore(
          dragged,
          drop.after ? drop.target.nextSibling : drop.target,
        );
        if (draggedPath && targetPath) {
          recordOp({ type: "move", path: draggedPath, targetPath, after: drop.after });
        }
        showToast("Elemento reposicionado — salvando no código...");
      }
      dragRef.current = null;
      dropRef.current = null;
      setGuide(null);
      setDragging(false);
      const swallow = (ev: MouseEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
      };
      document.addEventListener("click", swallow, { capture: true, once: true });
      setTimeout(() => document.removeEventListener("click", swallow, true), 300);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      dragRef.current = null;
      dropRef.current = null;
      setGuide(null);
      setDragging(false);
    };

    document.addEventListener("mousemove", onMove, true);
    document.addEventListener("mouseup", finish, true);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("mouseup", finish, true);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [dragging, showToast]);


  return (
    <>
      {active && guide && (
        <div
          {...{ [IGNORE_ATTR]: "" }}
          className="pointer-events-none fixed z-[88] h-0.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]"
          style={{ top: guide.top, left: guide.left, width: guide.width }}
        />
      )}

      {active && rect && (
        <div
          {...{ [IGNORE_ATTR]: "" }}
          className="pointer-events-none fixed z-[70] rounded-sm border-2 border-dashed border-primary bg-primary/10"
          style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
        >
          <span className="absolute -top-6 left-0 whitespace-nowrap rounded bg-primary px-1.5 py-0.5 font-mono text-[10px] text-primary-foreground">
            {label}
          </span>
          <button
            title="Arrastar elemento"
            aria-label="Arrastar elemento"
            className="pointer-events-auto absolute -top-3 right-14 flex size-6 cursor-grab items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-md transition-transform hover:scale-110 active:cursor-grabbing"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const el = selectedRef.current ?? hoverRef.current;
              if (!el) return;
              dragRef.current = el;
              dropRef.current = null;
              setMenu(null);
              setGuide(null);
              setDragging(true);
            }}
          >
            <GripVertical className="size-4" />
          </button>
          <button
            title="Duplicar elemento"
            aria-label="Duplicar elemento"
            className="pointer-events-auto absolute -top-3 right-7 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const el = hoverRef.current;
              clipboardRef.current = el;
              duplicate(el, el);
            }}
          >
            <Plus className="size-4" />
          </button>
          <button
            title="Excluir elemento"
            aria-label="Excluir elemento"
            className="pointer-events-auto absolute -top-3 right-0 flex size-6 items-center justify-center rounded-full bg-destructive text-white shadow-md transition-transform hover:scale-110"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              remove(hoverRef.current);
            }}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      )}

      {active && menu && (
        <div
          {...{ [IGNORE_ATTR]: "" }}
          className="fixed z-[85] w-56 overflow-hidden rounded-lg border border-border bg-background/95 py-1 text-sm shadow-xl backdrop-blur-md"
          style={{
            top: Math.min(menu.y + 8, window.innerHeight - 120),
            left: Math.min(menu.x + 8, window.innerWidth - 240),
          }}
        >
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-foreground transition-colors hover:bg-muted"
            onClick={() => {
              const el = selectedRef.current;
              clipboardRef.current = el;
              duplicate(el, el);
              setMenu(null);
            }}
          >
            <CopyPlus className="size-4 text-primary" />
            Copiar / Duplicar aqui
          </button>
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-foreground transition-colors hover:bg-muted"
            onClick={async () => {
              const el = selectedRef.current;
              if (!el) return;
              clipboardRef.current = el;
              await copyText(codeOf(el));
              showToast("Elemento/Código copiado com sucesso!");
              setMenu(null);
            }}
          >
            <Copy className="size-4 text-primary" />
            Copiar código (JSX/Tailwind)
          </button>
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-destructive transition-colors hover:bg-destructive/10"
            onClick={() => {
              remove(selectedRef.current);
              setMenu(null);
            }}
          >
            <Trash2 className="size-4 text-destructive" />
            Excluir elemento
          </button>
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-muted-foreground transition-colors hover:bg-muted"
            onClick={() => setMenu(null)}
          >
            <X className="size-4" />
            Fechar
          </button>
        </div>
      )}

      {toast && (
        <div
          {...{ [IGNORE_ATTR]: "" }}
          className="fixed left-1/2 top-5 z-[90] flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-background/95 px-4 py-2 text-sm font-medium text-foreground shadow-lg backdrop-blur-md"
        >
          <ClipboardPaste className="size-4 text-primary" />
          {toast}
        </div>
      )}

      <button
        {...{ [IGNORE_ATTR]: "" }}
        onClick={() => setActive((v) => {
          if (!v) activateDevMode("duplicate");
          return !v;
        })}
        className="fixed bottom-28 right-4 z-[80] flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-2 font-mono text-xs text-muted-foreground backdrop-blur-md transition-colors hover:text-foreground"
      >
        {active ? <X className="size-3.5" /> : <CopyPlus className="size-3.5" />}
        {active ? "sair do copiar/colar" : "modo copiar e colar"}
      </button>

      {active && (
        <div
          {...{ [IGNORE_ATTR]: "" }}
          className="pointer-events-none fixed bottom-12 left-4 z-[80] rounded-md border border-border bg-background/80 px-3 py-1.5 font-mono text-[11px] text-muted-foreground backdrop-blur-md"
        >
          clique para o menu · ⋮⋮ arrasta · Ctrl+C copia · Ctrl+V duplica · ESC sai
        </div>
      )}
    </>
  );
}
