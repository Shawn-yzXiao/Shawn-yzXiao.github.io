export const notionPages = [
  { key: "home", pageId: "54a7bc231a828384a04c81ea14b9eea1", kind: "home", route: "/" },
  { key: "persona-en", pageId: "3c57bc231a8281d99c42d27f947a83bb", kind: "essay", lang: "en", route: "/writing/beyond-behavior/", file: "persona_en.md" },
  { key: "creativity-en", pageId: "3c57bc231a828120847cc67ea6cc1bc0", kind: "essay", lang: "en", route: "/writing/what-is-creativity/", file: "creativity_en.md" },
  { key: "interaction-en", pageId: "3c57bc231a8281288c72f5909e2a669d", kind: "essay", lang: "en", route: "/writing/beyond-turn-taking/", file: "interaction_en.md" },
  { key: "persona-zh", pageId: "3c57bc231a828158b9f2ccdc51739995", kind: "essay", lang: "zh", route: "/zh/writing/beyond-behavior/", file: "persona_zh.md" },
  { key: "creativity-zh", pageId: "3c57bc231a8281ab93f9df80e84acf66", kind: "essay", lang: "zh", route: "/zh/writing/what-is-creativity/", file: "creativity_zh.md" },
  { key: "interaction-zh", pageId: "3c57bc231a8281cf8d2dc6d209f67002", kind: "essay", lang: "zh", route: "/zh/writing/beyond-turn-taking/", file: "interaction_zh.md" },
];

export const routeByPageId = new Map(
  notionPages.map((page) => [page.pageId.toLowerCase().replaceAll("-", ""), page.route]),
);
