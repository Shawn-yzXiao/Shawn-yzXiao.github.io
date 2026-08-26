# Yunzhong “Shawn” Xiao — research portfolio

The public website for [shawn-yzxiao.github.io](https://shawn-yzxiao.github.io/). It is an English-first, bilingual static portfolio built with Next.js and published free through GitHub Pages.

## Content workflow

Notion remains the editing source. The GitHub Actions workflow retrieves an explicit allowlist of the homepage and six English/Chinese essay pages, mirrors expiring Notion media, builds crawlable static HTML, and publishes the result. The checked-in Markdown is the fallback snapshot for local builds and first deployment.

To publish a new Notion edit immediately, open **Actions → Publish portfolio → Run workflow**. Otherwise, the workflow checks Notion at minute 17 of each hour.

## One-time Notion connection

1. Create an internal Notion integration with read-only content capability.
2. Share the portfolio homepage and any non-child essay pages with that integration.
3. In this repository, open **Settings → Secrets and variables → Actions**.
4. Add a repository secret named `NOTION_TOKEN` containing the integration token.
5. Run the **Publish portfolio** workflow once.

Page IDs and routes live in `scripts/notion-pages.mjs`. The allowlist prevents private drafts from being published accidentally.

## Local development

```bash
npm install
npm run dev
```

To test a live Notion sync, copy `.env.example` to `.env.local`, set the token, and run `npm run sync:notion` with `NOTION_TOKEN` available in the shell. Never commit the token.
