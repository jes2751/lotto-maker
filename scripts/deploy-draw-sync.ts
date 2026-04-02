import path from "node:path";
import { spawn } from "node:child_process";

function runWrangler(command: "deploy" | "dev") {
  const root = process.cwd();
  const workerDir = path.join(root, "workers", "draw-sync");
  const wranglerEntry = path.join(root, "node_modules", "wrangler", "bin", "wrangler.js");

  const child = spawn(process.execPath, [wranglerEntry, command, "-c", "wrangler.jsonc"], {
    cwd: workerDir,
    stdio: "inherit",
    env: process.env
  });

  child.on("exit", (code) => {
    process.exit(code ?? 1);
  });

  child.on("error", (error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}

runWrangler(process.argv.includes("--preview") ? "dev" : "deploy");
