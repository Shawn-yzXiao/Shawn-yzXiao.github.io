import fs from "node:fs";
import path from "node:path";
import home from "@/content/home.json";

export type Essay = {
  key: "persona" | "creativity" | "interaction";
  slug: string;
  lang: "en" | "zh";
  title: string;
  shortTitle: string;
  description: string;
  dateISO: string;
  dateLabel: string;
  revisedISO: string;
  readingTime: string;
  file: string;
};

export const essays: Essay[] = [
  {
    key: "interaction",
    slug: "beyond-turn-taking",
    lang: "en",
    title: "Beyond Turn-Taking: Toward Models That Listen, Speak, and Act",
    shortTitle: "Beyond Turn-Taking",
    description: "Full-duplex models, asynchronous reasoning, tools, and the two clocks of interactive intelligence.",
    dateISO: "2026-05-14",
    dateLabel: "May 14, 2026",
    revisedISO: "2026-08-24",
    readingTime: "17 min",
    file: "interaction_en.md",
  },
  {
    key: "persona",
    slug: "training-the-assistant",
    lang: "en",
    title: "Training the Assistant: How Post-Training Shapes an LLM’s Character",
    shortTitle: "Training the Assistant",
    description: "Post-training as behavioral specification: what SFT and reinforcement learning may shape beyond local response quality.",
    dateISO: "2026-04-18",
    dateLabel: "April 18, 2026",
    revisedISO: "2026-08-24",
    readingTime: "18 min",
    file: "persona_en.md",
  },
  {
    key: "creativity",
    slug: "what-is-creativity",
    lang: "en",
    title: "What Is Creativity When AI Can Generate Anything?",
    shortTitle: "What Is Creativity?",
    description: "What remains scarce when generation becomes cheap: problem choice, distant connections, and judgment.",
    dateISO: "2026-04-17",
    dateLabel: "April 17, 2026",
    revisedISO: "2026-08-24",
    readingTime: "16 min",
    file: "creativity_en.md",
  },
  {
    key: "interaction",
    slug: "beyond-turn-taking",
    lang: "zh",
    title: "超越轮次：走向能边听、边说、边行动的模型",
    shortTitle: "超越轮次",
    description: "关于全双工模型、异步推理、工具，以及交互智能的两个时钟。",
    dateISO: "2026-05-14",
    dateLabel: "2026 年 5 月 14 日",
    revisedISO: "2026-08-24",
    readingTime: "17 分钟",
    file: "interaction_zh.md",
  },
  {
    key: "persona",
    slug: "training-the-assistant",
    lang: "zh",
    title: "训练 Assistant：后训练如何塑造 LLM 的“角色”",
    shortTitle: "训练 Assistant",
    description: "把后训练视为行为规范：SFT 与强化学习塑造的不只是局部回答质量。",
    dateISO: "2026-04-18",
    dateLabel: "2026 年 4 月 18 日",
    revisedISO: "2026-08-24",
    readingTime: "18 分钟",
    file: "persona_zh.md",
  },
  {
    key: "creativity",
    slug: "what-is-creativity",
    lang: "zh",
    title: "AI 让执行变得廉价，那创造力到底是什么？",
    shortTitle: "创造力到底是什么？",
    description: "当生成变得廉价，真正稀缺的是问题选择、远距离连接和判断力。",
    dateISO: "2026-04-17",
    dateLabel: "2026 年 4 月 17 日",
    revisedISO: "2026-08-24",
    readingTime: "16 分钟",
    file: "creativity_zh.md",
  },
];

export const profile = home;
export const research = home.research;

export function getEssay(slug: string, lang: "en" | "zh") {
  return essays.find((essay) => essay.slug === slug && essay.lang === lang);
}

export function getEssayBody(essay: Essay) {
  const filePath = path.join(process.cwd(), "content", essay.file);
  const source = fs.readFileSync(filePath, "utf8");
  const localLanguageUrl = essay.lang === "en"
    ? `/zh/writing/${essay.slug}/`
    : `/writing/${essay.slug}/`;

  return source
    .replace(/^# .*\n+/, "")
    .replace(/^\*Originally written.*\n+/m, "")
    .replace(/^\*初稿写于.*\n+/m, "")
    .replace(/^\*本文记录的是.*\n+/m, "")
    .replace(/^\*原作于.*\n+/m, "")
    .replace(/^\*\*\[Read[^\n]+\n+/m, "")
    .replace(/^\[Read[^\n]+\n+/m, "")
    .replaceAll(/https:\/\/app\.notion\.com\/p\/[a-f0-9]+/g, localLanguageUrl)
    .trim();
}

export function getHeadings(markdown: string) {
  return markdown
    .split("\n")
    .filter((line) => /^##\s+/.test(line))
    .map((line) => {
      const label = line.replace(/^##\s+/, "").replace(/[*_`]/g, "").trim();
      return { label, id: slugify(label) };
    });
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[“”‘’'"():,.!?]/g, "")
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-|-$/g, "");
}
