import path from 'node:path';
import process from 'node:process';
import { escapeYaml, makeSlug } from './monitoring/lib/shared.mjs';
import { writeValidatedMarkdown } from './monitoring/lib/markdown-validation.mjs';

const root = process.cwd();
const mode = process.env.DRAFT_MODE || 'post';
const title = String(process.env.INPUT_TITLE || '').trim();
const description = String(process.env.INPUT_DESCRIPTION || '').trim();
const slugInput = String(process.env.INPUT_SLUG || '').trim();
const draft = String(process.env.INPUT_DRAFT || 'true').trim().toLowerCase() === 'true';
const tags = String(process.env.INPUT_TAGS || '')
  .split(',')
  .map((tag) => tag.trim().toLowerCase())
  .filter(Boolean)
  .filter((tag, index, array) => array.indexOf(tag) === index);

if (!title) throw new Error('INPUT_TITLE is required');
if (!description) throw new Error('INPUT_DESCRIPTION is required');
if (tags.length === 0) throw new Error('At least one tag is required');

const date = new Date().toISOString().slice(0, 10);
const year = date.slice(0, 4);
const month = date.slice(5, 7);
const slug = makeSlug(slugInput || title);
if (!slug) throw new Error('A valid slug could not be generated');

const filePath = path.join(root, 'src/content/blog', year, month, `${slug}.md`);
const canonical = `https://zerodaydiary.com/blog/${year}/${month}/${slug}/`;

const sections = mode === 'event'
  ? [
      ['What happened', process.env.INPUT_OVERVIEW || 'Add the initial event summary here.'],
      ['Why it matters', process.env.INPUT_WHY_IT_MATTERS || 'Explain the operational, regulatory, or public-interest significance.'],
      ['Assessment', process.env.INPUT_ANALYSIS || 'Capture the sharper editorial assessment and what changes in practice.'],
      ['Further reading', process.env.INPUT_FURTHER_READING || '- Add primary-source links here.'],
    ]
  : [
      ['What happened', 'Add the initial article draft here.'],
      ['Why it matters', 'Explain the operational, regulatory, or public-interest significance.'],
      ['Assessment', 'Capture the sharper editorial assessment and why this is signal rather than noise.'],
      ['Further reading', '- Add primary-source links here.'],
    ];

const markdown = `---
title: "${escapeYaml(title)}"
description: "${escapeYaml(description)}"
pubDate: ${date}
draft: ${draft}
tags:\n${tags.map((tag) => `  - ${tag}`).join('\n')}
canonical: "${canonical}"
---

${sections.map(([heading, content]) => `## ${heading}\n${String(content).trim()}`).join('\n\n')}
`;

await writeValidatedMarkdown(filePath, markdown, {
  expectedSlug: slug,
  expectedCanonical: canonical,
  requireSections: sections.map(([heading]) => heading),
});

console.log(`Created validated ${mode} draft: ${path.relative(root, filePath).replace(/\\/g, '/')}`);
