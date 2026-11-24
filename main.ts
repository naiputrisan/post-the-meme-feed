// Entry for make.fun's "Post the Meme, Win the Feed" (Node 22, stdlib only).
// The entry itself is an X post: a meme picture about make.fun, posted from a
// public X account with the sponsor mention and a play code in its text.
// This program only carries the post's address to the grader: it reads
// POST.json from the repository root and writes an identical copy to
// /output/POST.json, where the house's gate scorer reads it. The house
// then reads the post's own counts from X; nothing this program writes
// about the post is scored.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Fail loudly instead of copying a placeholder: POST.json must parse and
// name a real post URL, or the house's gate refuses the entry as invalid.
const raw = readFileSync(join(botDir, "POST.json"), "utf8");
const parsed: unknown = JSON.parse(raw);
if (
  typeof parsed !== "object" ||
  parsed === null ||
  typeof (parsed as { url?: unknown }).url !== "string" ||
  !(parsed as { url: string }).url.startsWith("https://") ||
  (parsed as { url: string }).url.includes("<handle>")
) {
  console.error("POST.json does not name a real post URL yet");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(join(botDir, "POST.json"), join(outDir, "POST.json"));
