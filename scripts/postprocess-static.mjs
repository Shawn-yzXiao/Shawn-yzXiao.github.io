import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const chineseOutputDirectory = fileURLToPath(
  new URL("../out/zh/", import.meta.url),
);

async function findHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map((entry) => {
      const path = `${directory}/${entry.name}`;
      return entry.isDirectory()
        ? findHtmlFiles(path)
        : Promise.resolve(entry.name.endsWith(".html") ? [path] : []);
    }),
  );

  return nestedFiles.flat();
}

const htmlFiles = await findHtmlFiles(chineseOutputDirectory);

for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, "utf8");
  const localizedHtml = html
    .replace('<html lang="en">', '<html lang="zh-Hans">')
    .replaceAll("hrefLang=", "hreflang=");

  if (!localizedHtml.includes('<html lang="zh-Hans">')) {
    throw new Error(`Could not set the document language for ${htmlFile}`);
  }

  await writeFile(htmlFile, localizedHtml);
}

console.log(`Localized ${htmlFiles.length} Chinese HTML pages.`);
