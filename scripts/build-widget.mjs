import { build } from "esbuild";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(root, "..");

mkdirSync(path.join(projectRoot, "public"), { recursive: true });

// Bundle the embeddable widget into a single self-contained IIFE.
// html2canvas is bundled inline so embedding sites need no extra requests.
await build({
  entryPoints: [path.join(projectRoot, "widget/src/index.ts")],
  outfile: path.join(projectRoot, "public/widget.bundle.js"),
  bundle: true,
  minify: true,
  format: "iife",
  target: ["es2018"],
  legalComments: "none",
  logLevel: "info",
});

console.log("Widget bundle written to public/widget.bundle.js");
