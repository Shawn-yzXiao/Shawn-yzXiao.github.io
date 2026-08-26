import { Client } from "@notionhq/client";
import { createHash } from "node:crypto";
import { copyFile, mkdir, mkdtemp, readFile, rename, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { notionPages, routeByPageId } from "./notion-pages.mjs";

const token = process.env.NOTION_TOKEN;
const root = process.cwd();
const contentDirectory = path.join(root, "content");
const publicDirectory = path.join(root, "public");

if (!token) {
  console.warn("NOTION_TOKEN is not configured; building the checked-in content snapshot.");
  process.exit(0);
}

const notion = new Client({
  auth: token,
  notionVersion: "2026-03-11",
  timeoutMs: 30_000,
  retry: { maxRetries: 5, initialRetryDelayMs: 1_000, maxRetryDelayMs: 30_000 },
});

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function compactId(value) {
  return value.toLowerCase().replaceAll("-", "");
}

function plainText(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeNotionMarkup(markdown) {
  let output = markdown
    .replace(/<table_of_contents[^>]*\/>/g, "")
    .replace(/<empty-block\s*\/>/g, "")
    .replace(/<mention-page\s+url="([^"]+)"\s*\/>/g, "[$1]($1)")
    .replace(/<\/?(?:page|columns?|callout|synced_block|details|summary)[^>]*>/g, "")
    .replace(/\n{3,}/g, "\n\n");

  output = output.replace(
    /https:\/\/(?:www\.)?(?:notion\.so|app\.notion\.com)\/(?:[^\s)]+-)?([a-f0-9-]{32,36})(?:\?[^\s)]*)?/gi,
    (url, rawId) => routeByPageId.get(compactId(rawId)) ?? url,
  );
  output = output.replace(
    /https:\/\/app\.notion\.com\/p\/([a-f0-9-]{32,36})(?:\?[^\s)]*)?/gi,
    (url, rawId) => routeByPageId.get(compactId(rawId)) ?? url,
  );
  return output.trim();
}

function extensionFor(contentType, sourceUrl) {
  const normalized = contentType.split(";")[0].trim();
  const known = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/avif": ".avif",
    "image/svg+xml": ".svg",
  };
  if (known[normalized]) return known[normalized];
  const pathnameExtension = path.extname(new URL(sourceUrl).pathname).toLowerCase();
  return /^\.[a-z0-9]{2,5}$/.test(pathnameExtension) ? pathnameExtension : ".bin";
}

async function downloadAsset(url, temporaryAssetDirectory) {
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) throw new Error(`Asset download failed (${response.status})`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 24);
  const extension = extensionFor(response.headers.get("content-type") ?? "", url);
  const filename = `${hash}${extension}`;
  await writeFile(path.join(temporaryAssetDirectory, filename), bytes);
  return { filename, bytes, contentType: response.headers.get("content-type") ?? "" };
}

async function mirrorMarkdownImages(markdown, temporaryAssetDirectory) {
  const matches = [...markdown.matchAll(/!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g)];
  let output = markdown;
  for (const match of matches) {
    const mirrored = await downloadAsset(match[2], temporaryAssetDirectory);
    output = output.replace(match[0], `![${match[1]}](/notion-assets/${mirrored.filename})`);
  }
  return output;
}

function extractHomeData(markdown, fallback) {
  const lines = markdown.split("\n").map((line) => line.trim()).filter(Boolean);
  const introLine = lines.find((line) => plainText(line).startsWith("I work across the full stack"));
  const missionLine = lines.find((line) => plainText(line).startsWith("My mission is to"));
  const agenda = [];
  const agendaMatches = markdown.matchAll(/###\s+(\d{2})\s*·\s*([^\n]+)\n([\s\S]*?)(?=\n\s*(?:###\s+\d{2}\s*·|<\/column>|#\s))/g);
  for (const match of agendaMatches) {
    const text = plainText(match[3]);
    if (text) agenda.push({ number: match[1], title: plainText(match[2]), text });
  }

  const researchSection = markdown.split(/#\s+Selected Research\s*/i)[1]?.split(/\n#\s+/)[0] ?? "";
  const research = [];
  const researchMatches = researchSection.matchAll(/###\s+\[([^\]]+)\]\((https?:\/\/[^)]+)\)\n([\s\S]*?)(?=\n---|\n###\s+|$)/g);
  for (const match of researchMatches) {
    const blockLines = match[3].split("\n").map(plainText).filter(Boolean);
    const metadata = blockLines[0] ?? "";
    const venue = metadata.match(/\b(NeurIPS|AAAI|arXiv)\b/i)?.[1] ?? "Research";
    const year = metadata.match(/\b(20\d{2})\b/)?.[1] ?? "";
    const summary = blockLines.at(-1) ?? "";
    research.push({ title: plainText(match[1]), href: match[2], summary, venue, year });
  }

  const missionText = missionLine ? plainText(missionLine).replace(/^My mission is to\s+/i, "") : fallback.mission;
  const mission = missionText ? `${missionText.charAt(0).toUpperCase()}${missionText.slice(1)}` : fallback.mission;
  return {
    ...fallback,
    mission,
    intro: introLine ? plainText(introLine) : fallback.intro,
    agenda: agenda.length === 3 ? agenda : fallback.agenda,
    research: research.length >= 3 ? research : fallback.research,
  };
}

async function retrieveSnapshot() {
  const before = new Map();
  const pages = new Map();
  for (const entry of notionPages) {
    const page = await notion.pages.retrieve({ page_id: entry.pageId });
    before.set(entry.key, page.last_edited_time);
    await delay(420);
  }
  for (const entry of notionPages) {
    const body = await notion.pages.retrieveMarkdown({ page_id: entry.pageId });
    if (body.truncated) throw new Error(`${entry.key}: Notion returned truncated Markdown.`);
    if (body.unknown_block_ids.length > 0) {
      throw new Error(`${entry.key}: unsupported blocks ${body.unknown_block_ids.join(", ")}`);
    }
    pages.set(entry.key, body.markdown);
    await delay(420);
  }
  for (const entry of notionPages) {
    const page = await notion.pages.retrieve({ page_id: entry.pageId });
    if (before.get(entry.key) !== page.last_edited_time) return null;
    await delay(420);
  }
  return pages;
}

async function main() {
  let pages = await retrieveSnapshot();
  if (!pages) {
    console.warn("Notion changed during sync; retrying once.");
    pages = await retrieveSnapshot();
  }
  if (!pages) throw new Error("Notion changed during both sync attempts; no files were updated.");

  const temporaryDirectory = await mkdtemp(path.join(tmpdir(), "shawn-notion-sync-"));
  const temporaryAssets = path.join(temporaryDirectory, "assets");
  await mkdir(temporaryAssets, { recursive: true });

  try {
    const normalizedPages = new Map();
    for (const entry of notionPages) {
      const normalized = normalizeNotionMarkup(pages.get(entry.key));
      normalizedPages.set(entry.key, await mirrorMarkdownImages(normalized, temporaryAssets));
    }

    const fallbackHome = JSON.parse(await readFile(path.join(contentDirectory, "home.json"), "utf8"));
    const homeMarkdown = normalizedPages.get("home");
    const homeData = extractHomeData(homeMarkdown, fallbackHome);
    await writeFile(path.join(temporaryDirectory, "home.json"), `${JSON.stringify(homeData, null, 2)}\n`);
    await writeFile(path.join(temporaryDirectory, "notion-home.md"), `${homeMarkdown}\n`);

    for (const entry of notionPages.filter((page) => page.kind === "essay")) {
      await writeFile(path.join(temporaryDirectory, entry.file), `${normalizedPages.get(entry.key)}\n`);
    }

    await mkdir(contentDirectory, { recursive: true });
    await mkdir(path.join(publicDirectory, "notion-assets"), { recursive: true });
    for (const entry of notionPages.filter((page) => page.kind === "essay")) {
      await rename(path.join(temporaryDirectory, entry.file), path.join(contentDirectory, entry.file));
    }
    await rename(path.join(temporaryDirectory, "home.json"), path.join(contentDirectory, "home.json"));
    await rename(path.join(temporaryDirectory, "notion-home.md"), path.join(contentDirectory, "notion-home.md"));

    const assetFiles = await import("node:fs/promises").then(({ readdir }) => readdir(temporaryAssets));
    for (const filename of assetFiles) {
      await copyFile(path.join(temporaryAssets, filename), path.join(publicDirectory, "notion-assets", filename));
    }

    const profileMatch = pages.get("home").match(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/);
    if (profileMatch) {
      const profile = await downloadAsset(profileMatch[1], temporaryAssets);
      await writeFile(path.join(publicDirectory, "shawn-profile.jpg"), profile.bytes);
    }
    console.log(`Synced ${notionPages.length} Notion pages and ${assetFiles.length} mirrored assets.`);
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
