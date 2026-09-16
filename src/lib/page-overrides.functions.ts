import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const opSchema = z.union([
  z.object({ type: z.literal("duplicate"), path: z.array(z.number()) }),
  z.object({ type: z.literal("remove"), path: z.array(z.number()) }),
  z.object({
    type: z.literal("move"),
    path: z.array(z.number()),
    targetPath: z.array(z.number()),
    after: z.boolean(),
  }),
]);

const schema = z.object({
  text: z.record(z.string(), z.string()).optional(),
  ops: z.array(opSchema).optional(),
});

type Payload = z.infer<typeof schema>;

/**
 * Writes the visual edits into the project source file
 * `src/content/page-overrides.json`, so they survive reloads and publishing.
 *
 * The write is MERGE-only: existing text keys and structural ops on disk are
 * never dropped by an incoming payload. This protects the saved edits from a
 * stale browser tab (or a freshly reloaded page) sending an empty state.
 */
export const savePageOverrides = createServerFn({ method: "POST" })
  .inputValidator((data) => schema.parse(data))
  .handler(async ({ data }) => {
    try {
      const { readFile, writeFile } = await import("node:fs/promises");
      const { resolve } = await import("node:path");
      const file = resolve(process.cwd(), "src/content/page-overrides.json");

      let current: Payload = { text: {}, ops: [] };
      try {
        current = schema.parse(JSON.parse(await readFile(file, "utf8")));
      } catch {
        current = { text: {}, ops: [] };
      }

      const incomingOps = data.ops ?? [];
      const currentOps = current.ops ?? [];
      const key = (op: unknown) => JSON.stringify(op);
      const seen = new Set(currentOps.map(key));
      const mergedOps = [...currentOps];
      for (const op of incomingOps) {
        if (seen.has(key(op))) continue;
        seen.add(key(op));
        mergedOps.push(op);
      }

      const payload = {
        text: { ...(current.text ?? {}), ...(data.text ?? {}) },
        ops: mergedOps,
      };

      await writeFile(file, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
      return { saved: true as const };
    } catch (error) {
      return { saved: false as const, reason: String(error) };
    }
  });
