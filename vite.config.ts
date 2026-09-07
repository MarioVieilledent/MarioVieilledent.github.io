import { readFile, writeFile } from "node:fs/promises";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";

const minifyPublicJson = (files: string[]) => ({
  name: "minify-public-json",
  apply: "build" as const,
  async closeBundle() {
    await Promise.all(
      files.map(async (filename) => {
        const path = new URL(`./dist/${filename}`, import.meta.url);
        const contents = await readFile(path, "utf8");
        await writeFile(path, JSON.stringify(JSON.parse(contents)));
      }),
    );
  },
});

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    minifyPublicJson(["recipes.json", "feasts.json"]),
  ],
  base: "/",
  server: {
    port: 3664,
    host: true,
  },
});
