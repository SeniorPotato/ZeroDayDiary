import path from 'node:path';
import { escapeYaml, makeSlug } from './shared.mjs';
import { writeValidatedMarkdown } from './markdown-validation.mjs';

export const CANONICAL_SECTION_HEADINGS = [
  'What happened',
  'Why it matters',
  'Assessment',
  'Recommended actions',
  'Further reading',
];

export function resolvePostDate(input = new Date()) {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid publication date: ${input}`);
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return { date, year, month, day, pubDate: `${year}-${month}-${day}` };
}

export function buildCanonical({ year, month, slug }) {
  return `https://zerodaydiary.com/blog/${year}/${month}/${slug}/`;
}

export function normalizeTags(tags = []) {
  return [...new Set(tags.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean))];
}

export function normalizeSections(sections = {}) {
  return CANONICAL_SECTION_HEADINGS.map((heading) => {
    const value = sections[heading] ?? '';
    return [heading, String(value).trim()];
  });
}

export function buildPostMarkdown({ title, description, pubDate, draft = true, tags, canonical, sections }) {
  const normalizedTags = normalizeTags(tags);
  const normalizedSections = normalizeSections(sections);
  return `---
title: "${escapeYaml(String(title || '').trim())}"
description: "${escapeYaml(String(description || '').trim())}"
pubDate: ${pubDate}
draft: ${Boolean(draft)}
tags:\n${normalizedTags.map((tag) => `  - ${tag}`).join('\n')}
canonical: "${canonical}"
---

${normalizedSections.map(([heading, content]) => `## ${heading}\n${content}`).join('\n\n')}
`;
}

export async function writeCanonicalPost({ root = process.cwd(), blogRoot = path.join(root, 'src/content/blog'), title, description, slugInput, dateInput, draft, tags, sections }) {
  const slug = makeSlug(slugInput || title);
  if (!slug) throw new Error('A valid slug could not be generated');
  const { year, month, pubDate } = resolvePostDate(dateInput || new Date());
  const canonical = buildCanonical({ year, month, slug });
  const filePath = path.join(blogRoot, year, month, `${slug}.md`);
  const markdown = buildPostMarkdown({ title, description, pubDate, draft, tags, canonical, sections });
  await writeValidatedMarkdown(filePath, markdown, {
    expectedSlug: slug,
    expectedCanonical: canonical,
    requireSections: CANONICAL_SECTION_HEADINGS,
  });
  return { filePath, slug, canonical, pubDate };
}
