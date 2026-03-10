import fs from 'node:fs/promises';
import path from 'node:path';

const [,, inputPath] = process.argv;
if (!inputPath) {
  console.error('Usage: node scripts/monitoring/create-draft-from-candidate.mjs <candidate.json>');
  process.exit(1);
}

const root = process.cwd();
const candidate = JSON.parse(await fs.readFile(path.resolve(root, inputPath), 'utf8'));
const date = new Date(candidate.pubDate || new Date().toISOString());
const year = String(date.getUTCFullYear());
const month = String(date.getUTCMonth() + 1).padStart(2, '0');
const slug = candidate.slug;
const outDir = path.join(root, 'src/content/blog', year, month);
const outPath = path.join(outDir, `${slug}.md`);

await fs.mkdir(outDir, { recursive: true });

const tagsYaml = (candidate.tags || []).map((tag) => `  - ${tag}`).join('\n');
const body = `---
title: "${candidate.title}"
description: "${candidate.description}"
pubDate: ${year}-${month}-${String(date.getUTCDate()).padStart(2, '0')}
draft: ${candidate.draft ?? true}
tags:\n${tagsYaml}
canonical: "https://zerodaydiary.com/blog/${year}/${month}/${slug}/"
---

## Summary
${candidate.summary || 'Two to three sentences summarising the event, what changed, and why it matters.'}

## Overview
${candidate.overview || 'Describe the development clearly and factually.'}

## Key Details
${candidate.key_details || 'Add the most important technical, operational, legal, or policy details.'}

## Why It Matters
${candidate.why_it_matters || 'Explain the operational, regulatory, or strategic significance.'}

## Analysis
${candidate.analysis || 'Provide disciplined interpretation, implications, and uncertainty where relevant.'}

## Practical Takeaway
${candidate.practical_takeaway || '- verify exposure or relevance\n- patch, harden, or monitor as appropriate\n- track follow-on guidance from the primary source'}

## Further Reading
${(candidate.sources || []).map((src) => `- [${src.label || src.url}](${src.url})`).join('\n') || '- Add primary and supporting sources.'}
`;

await fs.writeFile(outPath, body, 'utf8');
console.log(`Draft created: ${path.relative(root, outPath)}`);
