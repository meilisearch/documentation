import type { CodeHighlighterPlugin, HighlightResult } from "streamdown";
import { createHighlighterCoreSync, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import githubLightDefault from "@shikijs/themes/github-light-default";
import darkPlus from "@shikijs/themes/dark-plus";
import bash from "@shikijs/langs/bash";
import csharp from "@shikijs/langs/csharp";
import css from "@shikijs/langs/css";
import dart from "@shikijs/langs/dart";
import go from "@shikijs/langs/go";
import html from "@shikijs/langs/html";
import java from "@shikijs/langs/java";
import javascript from "@shikijs/langs/javascript";
import json from "@shikijs/langs/json";
import jsx from "@shikijs/langs/jsx";
import markdown from "@shikijs/langs/markdown";
import php from "@shikijs/langs/php";
import python from "@shikijs/langs/python";
import ruby from "@shikijs/langs/ruby";
import rust from "@shikijs/langs/rust";
import sql from "@shikijs/langs/sql";
import swift from "@shikijs/langs/swift";
import tsx from "@shikijs/langs/tsx";
import typescript from "@shikijs/langs/typescript";
import yaml from "@shikijs/langs/yaml";

const LIGHT = "github-light-default";
const DARK = "dark-plus";

type Grammar = { name?: string; aliases?: string[] };

const GRAMMARS = [
  bash,
  csharp,
  css,
  dart,
  go,
  html,
  java,
  javascript,
  json,
  jsx,
  markdown,
  php,
  python,
  ruby,
  rust,
  sql,
  swift,
  tsx,
  typescript,
  yaml,
] as Grammar[][];

const langs = new Map<string, Grammar>();
const aliases = new Map<string, string>();

for (const bundle of GRAMMARS) {
  for (const grammar of bundle) {
    if (!grammar.name || langs.has(grammar.name)) continue;
    langs.set(grammar.name, grammar);
    aliases.set(grammar.name, grammar.name);
    for (const alias of grammar.aliases ?? []) aliases.set(alias, grammar.name);
  }
}

let highlighter: HighlighterCore | undefined;

function getHighlighter(): HighlighterCore {
  highlighter ??= createHighlighterCoreSync({
    themes: [githubLightDefault, darkPlus],
    langs: [...langs.values()] as never[],
    engine: createJavaScriptRegexEngine(),
  });
  return highlighter;
}

function resolveLanguage(language: string): string | undefined {
  return aliases.get(language.trim().toLowerCase());
}

/** Same themes as Mintlify's code blocks, without shipping every Shiki grammar. */
export const code: CodeHighlighterPlugin = {
  name: "shiki",
  type: "code-highlighter",
  supportsLanguage: (language) => resolveLanguage(language) !== undefined,
  getSupportedLanguages: () => [...aliases.keys()],
  getThemes: () => [LIGHT, DARK],
  highlight({ code: source, language }): HighlightResult | null {
    const lang = resolveLanguage(language);
    if (!lang) return null;
    return getHighlighter().codeToTokens(source, {
      lang,
      themes: { light: LIGHT, dark: DARK },
    });
  },
};
