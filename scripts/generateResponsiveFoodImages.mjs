import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const SOURCE_DIRECTORY = path.resolve("public/food");
const OUTPUT_DIRECTORY = path.join(SOURCE_DIRECTORY, "responsive");
const RESPONSIVE_WIDTHS = [640, 1280];
const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);
const force = process.argv.includes("--force");

const outputIsCurrent = async (sourcePath, outputPath) => {
  if (force) return false;

  try {
    const [sourceStats, outputStats] = await Promise.all([
      stat(sourcePath),
      stat(outputPath),
    ]);
    return outputStats.mtimeMs >= sourceStats.mtimeMs;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
};

await mkdir(OUTPUT_DIRECTORY, { recursive: true });

const entries = await readdir(SOURCE_DIRECTORY, { withFileTypes: true });
const images = entries
  .filter(
    (entry) =>
      entry.isFile() &&
      SUPPORTED_EXTENSIONS.has(path.extname(entry.name).toLowerCase()),
  )
  .sort((a, b) => a.name.localeCompare(b.name));

let generated = 0;
let skipped = 0;

for (const image of images) {
  const sourcePath = path.join(SOURCE_DIRECTORY, image.name);
  const extension = path.extname(image.name);
  const stem = image.name.slice(0, -extension.length);

  for (const width of RESPONSIVE_WIDTHS) {
    const outputName = `${stem}-${width}.webp`;
    const outputPath = path.join(OUTPUT_DIRECTORY, outputName);

    if (await outputIsCurrent(sourcePath, outputPath)) {
      skipped += 1;
      continue;
    }

    await sharp(sourcePath)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(outputPath);

    generated += 1;
    console.log(`Generated ${path.relative(process.cwd(), outputPath)}`);
  }
}
console.log(
  `Responsive food images complete: ${generated} generated, ${skipped} unchanged.`,
);

