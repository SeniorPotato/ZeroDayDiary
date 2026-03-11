import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const latestReviewPath = path.join(root, 'data/monitoring/state/latest-source-review.json');
const blogRoot = path.join(root, 'src/content/blog');

const exists = async (p) => !!(await fs.stat(p).catch(() => null));

function stripTags(text = '') {
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function makeSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function escapeYaml(value = '') {
  return String(value).replace(/"/g, '\\"');
}

function normaliseSentence(text = '') {
  const cleaned = stripTags(text).replace(/\s+/g, ' ').trim();
  if (!cleaned) return '';
  return /[.!?]$/.test(cleaned) ? cleaned : `${cleaned}.`;
}

function titleCaseTag(tag) {
  return tag
    .split('-')
    .map((part) => part ? part[0].toUpperCase() + part.slice(1) : part)
    .join(' ');
}

function extractMeta(html, name, attr = 'name') {
  const regex = new RegExp(`<meta[^>]+${attr}=["']${name}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i');
  const reverseRegex = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+${attr}=["']${name}["'][^>]*>`, 'i');
  return stripTags(html.match(regex)?.[1] || html.match(reverseRegex)?.[1] || '');
}

function extractTitle(html) {
  return stripTags(
    extractMeta(html, 'og:title', 'property') ||
    html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ||
    html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ||
    ''
  );
}

function extractDescription(html) {
  return stripTags(
    extractMeta(html, 'og:description', 'property') ||
    extractMeta(html, 'description') ||
    ''
  );
}

function extractParagraphs(html, limit = 3) {
  const matches = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => normaliseSentence(match[1]))
    .filter((text) => text.length > 80)
    .filter((text) => !/cookie|subscribe|newsletter|sign up|all rights reserved/i.test(text));
  return matches.slice(0, limit);
}

function inferTags(candidate, combinedText) {
  const tags = [candidate.category];
  const checks = [
    ['cloud', /\bcloud|aws|azure|gcp|google cloud|bigquery|storage|saas\b/i],
    ['data-security', /\bdata breach|data security|exfiltrat|tenant|database|records|sensitive data\b/i],
    ['vulnerabilities', /\bcve-|vulnerab|flaw|zero-day|exploit|patched|patch\b/i],
    ['devops', /\bci\/cd|kubernetes|container|devops|pipeline|deployment\b/i],
    ['crypto', /\bcrypto|cryptocurrency|digital assets|wallet|blockchain\b/i],
    ['kev', /known exploited vulnerabilities|\bkev\b/i],
    ['network-edge', /sd-wan|router|firewall|vpn|edge|network appliance|gateway/i],
    ['compliance', /\bcompliance|gdpr|nis2|dpa|obligation|regulatory requirements\b/i],
    ['regulation', /\bregulat|directive|law|policy|framework|guidance\b/i],
    ['children', /\bchildren|child|kids|minors|young people\b/i],
    ['data-rights', /right to erasure|data rights|access request|subject rights/i],
    ['public-sector', /government|public sector|federal|agency|commission|authority/i],
    ['threat-intelligence', /apt\d+|threat actor|espionage|campaign|malware|ransomware|intrusion/i],
    ['espionage', /espionage|surveillance|state-backed|state-linked|intelligence/i],
  ];

  for (const [tag, regex] of checks) {
    if (regex.test(combinedText) && !tags.includes(tag)) tags.push(tag);
  }

  return tags.slice(0, 4);
}

function buildWhyItMatters(candidate, description, tags) {
  const categoryMap = {
    security: 'This matters because it affects active cyber defence, attack surface management, or incident response priorities rather than sitting as a purely theoretical issue.',
    privacy: 'This matters because it changes how organisations should think about data protection, user harm, and regulator expectations in practice.',
    governance: 'This matters because it signals where policy, enforcement, and institutional expectations are becoming more operational and less abstract.',
    infrastructure: 'This matters because infrastructure-layer developments often have wider blast radius, longer tail risk, and more systemic operational consequences.',
    surveillance: 'This matters because surveillance capabilities and monitoring practices can normalise harms long before institutions treat them as governance failures.',
    'ai-risk': 'This matters because AI-related risks increasingly show up through deployment choices, interface design, and governance gaps rather than model headlines alone.',
  };

  const extra = tags.includes('kev')
    ? ' The fact that exploitation or KEV-style urgency is involved makes it more likely that defenders should treat it as an immediate operational priority.'
    : tags.includes('regulation') || tags.includes('compliance')
      ? ' It is also a signal about where compliance and governance work is becoming more concrete for operators and programme owners.'
      : '';

  return `${normaliseSentence(description) || ''} ${categoryMap[candidate.category] || categoryMap.governance}${extra}`.trim();
}

function buildAssessment(candidate, sourceTitle, tags) {
  const angle = tags.includes('threat-intelligence')
    ? 'The strongest signal is the tradecraft pattern and what it says about attacker adaptation, not just the single event itself.'
    : tags.includes('regulation') || tags.includes('compliance')
      ? 'The strongest signal is operational direction: this points to where governance expectations are turning into concrete implementation work.'
      : tags.includes('vulnerabilities')
        ? 'The strongest signal is that a specific weakness or class of weakness is being treated as operationally relevant rather than background technical debt.'
        : 'The strongest signal is that this is part of a broader pattern worth tracking, not just a one-off headline.';

  return `${angle} In ZeroDayDiary terms, ${normaliseSentence(sourceTitle)} should be read as a signal-over-noise item with practical downstream implications.`;
}

function buildRecommendedActions(tags, category) {
  const bullets = [];

  if (category === 'security' || tags.includes('vulnerabilities')) {
    bullets.push('review whether the issue, advisory, or attack pattern is relevant to your environment, suppliers, or exposed systems');
    bullets.push('patch, harden, or validate logging and monitoring coverage where applicable');
  }
  if (tags.includes('cloud')) bullets.push('check whether cloud services, connectors, or shared administrative paths introduce avoidable trust-boundary risk');
  if (tags.includes('compliance') || tags.includes('regulation')) bullets.push('translate the development into specific ownership, policy, and evidence requirements rather than leaving it as background policy tracking');
  if (tags.includes('children')) bullets.push('treat child-safety and youth-risk themes as product, data, and governance questions rather than communications-only concerns');
  if (tags.includes('threat-intelligence')) bullets.push('map the observed activity to existing detections and threat-hunting hypotheses instead of tracking it only as narrative reporting');

  if (bullets.length < 3) {
    bullets.push('monitor follow-on reporting or primary-source updates for scope expansion, attribution changes, or implementation guidance');
  }

  return [...new Set(bullets)].slice(0, 4);
}

async function listExistingSlugs(dir) {
  const entries = await fs.readdir(dir, { recursive: true, withFileTypes: true }).catch(() => []);
  const slugs = new Set();
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!/\.mdx?$/i.test(entry.name)) continue;
    slugs.add(entry.name.replace(/\.(md|mdx)$/i, ''));
  }
  return slugs;
}

async function main() {
  if (!(await exists(latestReviewPath))) {
    console.log('No latest-source-review.json found; nothing to publish.');
    return;
  }

  const review = JSON.parse(await fs.readFile(latestReviewPath, 'utf8'));
  const candidates = review.candidates || [];
  const existingSlugs = await listExistingSlugs(blogRoot);
  const published = [];

  for (const candidate of candidates) {
    if (published.length >= 3) break;
    if (candidate.tier !== 'Tier 1') continue;
    if (/^cisa adds \w+ known exploited vulnerabilities to catalog$/i.test(candidate.title)) continue;
    if (/agenda available now|programme available now/i.test(candidate.title)) continue;

    const slug = makeSlug(candidate.slug || candidate.title);
    if (!slug || existingSlugs.has(slug)) continue;

    let html = '';
    try {
      const res = await fetch(candidate.link, { headers: { 'user-agent': 'ZeroDayDiary/1.0 publisher bot' } });
      html = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (error) {
      console.log(`Skip ${candidate.link}: ${String(error.message || error)}`);
      continue;
    }

    const sourceTitle = extractTitle(html) || candidate.title;
    const description = extractDescription(html) || `New ${candidate.category} development detected from ${candidate.source}.`;
    const paragraphs = extractParagraphs(html, 2);
    const combinedText = `${sourceTitle} ${description} ${paragraphs.join(' ')}`;
    const tags = inferTags(candidate, combinedText);
    const recommendedActions = buildRecommendedActions(tags, candidate.category);

    const pubDate = new Date(review.generatedAt || new Date().toISOString());
    const year = String(pubDate.getUTCFullYear());
    const month = String(pubDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(pubDate.getUTCDate()).padStart(2, '0');
    const outDir = path.join(blogRoot, year, month);
    const outPath = path.join(outDir, `${slug}.md`);
    await fs.mkdir(outDir, { recursive: true });

    const summary = normaliseSentence(description);
    const whatHappened = paragraphs[0]
      ? `${summary} ${paragraphs[0]}`.trim()
      : `${summary} According to ${candidate.source}, this item was surfaced through the scheduled review pipeline as a source-led development worth tracking.`;
    const keyDetails = paragraphs[1]
      ? [paragraphs[1], `Primary source: ${candidate.link}`]
      : [`Primary source: ${candidate.link}`, `Source tier: ${candidate.tier}`, `Initial category: ${titleCaseTag(candidate.category)}`];

    const body = `---
title: "${escapeYaml(candidate.title)}"
description: "${escapeYaml(description)}"
pubDate: ${year}-${month}-${day}
draft: false
tags:
${tags.map((tag) => `  - ${tag}`).join('\n')}
canonical: "https://zerodaydiary.com/blog/${year}/${month}/${slug}/"
---

## Summary
${summary}

## What happened
${whatHappened}

## Key details
${keyDetails.map((item) => `- ${item}`).join('\n')}

## Why it matters
${buildWhyItMatters(candidate, description, tags)}

## Assessment
${buildAssessment(candidate, sourceTitle, tags)}

## Recommended actions
${recommendedActions.map((item) => `- ${item}`).join('\n')}

## Further reading
- [Primary source](${candidate.link})
`;

    await fs.writeFile(outPath, body, 'utf8');
    published.push(path.relative(root, outPath).replace(/\\/g, '/'));
    existingSlugs.add(slug);
  }

  console.log(`Published posts: ${published.length}`);
  for (const item of published) console.log(`- ${item}`);
}

await main();
