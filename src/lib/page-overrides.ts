import overrides from "@/content/page-overrides.json";

export type StructuralOp =
  | { type: "duplicate"; path: number[] }
  | { type: "remove"; path: number[] }
  | { type: "move"; path: number[]; targetPath: number[]; after: boolean };

export type PageOverrides = {
  text: Record<string, string>;
  ops: StructuralOp[];
};

// Source-of-truth overrides, committed to the repo so the published build
// renders exactly what was edited visually.
export const pageOverrides: PageOverrides = {
  text: (overrides.text ?? {}) as Record<string, string>,
  ops: (overrides.ops ?? []) as StructuralOp[],
};
