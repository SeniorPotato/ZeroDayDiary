import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const latestReviewPath = path.join(root, 'data/monitoring/state/latest-source-review.json');
const blogRoot = path.join(root, 'src/content/blog');

const exists = async (p) => !!(await fs.stat(p).catch(() => null));

const AUTO_PUBLISH_SOURCES = new Set([
  'CISA Cybersecurity Advisories',
  'CISA Known Exploited Vulnerabilities Catalog',
  'ICO News and Blogs',
  'EDPB News',
  'ENISA News',
  'NCSC UK News',
  'FTC Press Releases',
  'ISO Insights and Updates',
]);

const SOURCE_PROFILES = {
  'CISA Cybersecurity Advisories': {
    voice: 'advisory',
    sourceNoun: 'CISA and partner-agency guidance',
  },
  'CISA Known Exploited Vulnerabilities Catalog': {
    voice: 'advisory',
    sourceNoun: 'CISA KEV update',
  },
  'ICO News and Blogs': {
    voice: 'enforcement',
    sourceNoun: 'ICO announcement',
  },
  'EDPB News': {
    voice: 'governance',
    sourceNoun: 'EDPB publication',
  },
  'ENISA News': {
    voice: 'governance',
    sourceNoun: 'ENISA publication',
  },
  'NCSC UK News': {
    voice: 'advisory',
    sourceNoun: 'NCSC announcement',
  },
  'FTC Press Releases': {
    voice: 'enforcement',
    sourceNoun: 'FTC announcement',
  },
  'ISO Insights and Updates': {
    voice: 'governance',
    sourceNoun: 'ISO publication',
  },
  'Krebs on Security': {
    voice: 'reporting',
    sourceNoun: 'reported investigation',
  },
  'Schneier on Security': {
    voice: 'analysis',
    sourceNoun: 'analysis post',
  },
  'The Hacker News': {
    voice: 'reporting',
    sourceNoun: 'security reporting',
  },
};

function stripTags(text = '') {
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#8220;|&#8221;|&#x201c;|&#x201d;/g, '"')
    .replace(/&#8216;|&#8217;|&#x2018;|&#x2019;/g, "'")
    .replace(/&#8230;|&#x2026;/g, '…')
    .replace(/&#8211;|&#8212;|&#x2013;|&#x2014;/g, '—')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeYaml(value = '') {
  return String(value).replace(/"/g, '\\"');
}

function normaliseSentence(text = '') {
  const cleaned = stripTags(text).replace(/\s+/g, ' ').trim();
  if (!cleaned) return '';
  return /[.!?]$/.test(cleaned) ? cleaned : `${cleaned}.`;
}

function sentenceCase(text = '') {
  const cleaned = stripTags(text).trim();
  if (!cleaned) return '';
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function makeSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
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

function isBoilerplateText(text = '') {
  return /the \.gov means it'?s official|the site is secure|an official website of the united states government|here'?s how you know|skip to main content|report fraud|get consumer alerts|search the legal library|federal government websites often end in \.gov|https:\/\//i.test(text);
}

function extractArticleBody(html) {
  const articleMatch = html.match(/<article[\s\S]*?<\/article>/i)
    || html.match(/<main[\s\S]*?<\/main>/i)
    || html.match(/<div[^>]+class=["'][^"']*(?:node__content|field--name-body|page__content|l-content)[^"']*["'][\s\S]*?<\/div>/i);
  return articleMatch?.[0] || html;
}

function extractParagraphs(html, limit = 8) {
  const articleHtml = extractArticleBody(html);
  const matches = [...articleHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => normaliseSentence(match[1]))
    .filter((text) => text.length > 70)
    .filter((text) => !/cookie|subscribe|newsletter|sign up|all rights reserved|javascript|advertisement|related articles/i.test(text))
    .filter((text) => !isBoilerplateText(text));

  const deduped = [];
  const seen = new Set();
  for (const text of matches) {
    const key = text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(text);
  }

  return deduped.slice(0, limit);
}

function titleCaseTag(tag) {
  return tag
    .split('-')
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ');
}

function firstUsefulSentence(text = '') {
  const cleaned = stripTags(text).replace(/\s+/g, ' ').trim();
  if (!cleaned) return '';
  const sentence = cleaned.match(/(.+?[.!?])(?:\s|$)/)?.[1] || cleaned;
  return normaliseSentence(sentence);
}

function trimClause(text = '') {
  return stripTags(text)
    .replace(/^according to[^,]+,\s*/i, '')
    .replace(/^in [A-Z][a-z]+ \d{4},\s*/i, '')
    .replace(/^on \d{1,2} [A-Z][a-z]+ \d{4},\s*/i, '')
    .trim();
}

function cleanDescription(text = '') {
  return trimClause(text)
    .replace(/the \.gov means it'?s official\.?/gi, '')
    .replace(/the site is secure\.?/gi, '')
    .replace(/here'?s how you know\.?/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildStandfirst(candidate, description, paragraphs, profile) {
  const desc = cleanDescription(description);
  const first = trimClause(firstUsefulSentence(paragraphs[0] || ''));
  const second = trimClause(firstUsefulSentence(paragraphs[1] || ''));

  const pieces = [];
  if (desc) pieces.push(desc);
  if (first && !pieces.join(' ').toLowerCase().includes(first.toLowerCase())) pieces.push(first);
  if (profile.voice === 'enforcement' && second && /fine|penalt|enforcement|investigation|order|breach/i.test(second)) {
    pieces.push(second);
  }

  const text = pieces.join(' ').replace(/\s+/g, ' ').trim();
  if (!text) return `A new ${candidate.category} development surfaced through the scheduled source-review pipeline.`;
  return text.length > 240 ? `${text.slice(0, 237).trimEnd()}…` : normaliseSentence(text);
}

function inferCategory(candidate, combinedText) {
  if (/\bai\b|artificial intelligence|model|compute strategy/i.test(combinedText)) return 'ai-risk';
  if (/privacy|gdpr|data protection|children's data|childrens data|age assurance/i.test(combinedText)) return 'privacy';
  if (/guidance|opinion|work programme|compliance|framework|directive/i.test(combinedText) && candidate.category !== 'security') return 'governance';
  return candidate.category;
}

function inferTags(candidate, combinedText, resolvedCategory) {
  const tags = [resolvedCategory];
  const checks = [
    ['cloud', /\bcloud|aws|azure|gcp|google cloud|bigquery|storage|saas|tenant\b/i],
    ['data-security', /\bdata breach|data security|exfiltrat|database|records|sensitive data|tenant boundar/i],
    ['vulnerabilities', /\bcve-|vulnerab|flaw|zero-day|exploit|patched|patch\b/i],
    ['devops', /\bci\/cd|kubernetes|container|devops|pipeline|deployment\b/i],
    ['crypto', /\bcrypto|cryptocurrency|digital assets|wallet|blockchain\b/i],
    ['kev', /known exploited vulnerabilities|\bkev\b/i],
    ['network-edge', /sd-wan|router|firewall|vpn|edge|network appliance|gateway/i],
    ['compliance', /\bcompliance|gdpr|nis2|dpa|obligation|regulatory requirements\b/i],
    ['regulation', /\bregulat|directive|law|policy|framework|guidance|opinion\b/i],
    ['children', /\bchildren|child|kids|minors|young people\b/i],
    ['data-rights', /right to erasure|data rights|access request|subject rights/i],
    ['public-sector', /government|public sector|federal|agency|commission|authority|ministry/i],
    ['threat-intelligence', /apt\d+|threat actor|espionage|campaign|malware|ransomware|intrusion/i],
    ['espionage', /espionage|surveillance|state-backed|state-linked|intelligence/i],
    ['enforcement', /fine|penalt|enforcement|investigation|ordered|violat/i],
  ];

  for (const [tag, regex] of checks) {
    if (regex.test(combinedText) && !tags.includes(tag)) tags.push(tag);
  }

  return tags.slice(0, 4);
}

function summariseKeyDetails(candidate, paragraphs, tags, profile) {
  const lines = [];
  const sourceSentence = firstUsefulSentence(paragraphs[0] || '');
  const detailSentence = firstUsefulSentence(paragraphs[1] || '');
  const thirdSentence = firstUsefulSentence(paragraphs[2] || '');

  if (sourceSentence) lines.push(trimClause(sourceSentence));
  if (detailSentence && !lines.join(' ').toLowerCase().includes(detailSentence.toLowerCase())) lines.push(trimClause(detailSentence));
  if (thirdSentence && lines.length < 2) lines.push(trimClause(thirdSentence));

  if (tags.includes('vulnerabilities') && !lines.some((line) => /patch|exploit|cve|flaw/i.test(line))) {
    lines.push('The item is relevant because it touches vulnerability management, exploitation risk, or defensive hardening.');
  }
  if ((profile.voice === 'governance' || tags.includes('compliance')) && !lines.some((line) => /guidance|regulation|compliance|obligation/i.test(line))) {
    lines.push('The development has direct compliance or governance relevance rather than being only background policy commentary.');
  }
  if (profile.voice === 'enforcement' && !lines.some((line) => /fine|investigation|penalt|lawful basis|age assurance/i.test(line))) {
    lines.push('The item is framed as regulator action with practical consequences for organisations handling similar risks.');
  }

  lines.push(`Primary source: ${candidate.link}`);
  return [...new Set(lines)].slice(0, 4);
}

function buildWhatHappened(candidate, standfirst, paragraphs, profile) {
  const first = trimClause(firstUsefulSentence(paragraphs[0] || ''));
  const second = trimClause(firstUsefulSentence(paragraphs[1] || ''));

  const intro = profile.voice === 'reporting'
    ? `Recent reporting highlighted ${candidate.title.toLowerCase()}.`
    : profile.voice === 'enforcement'
      ? `The latest ${profile.sourceNoun.toLowerCase()} sets out the regulator's position on ${candidate.title.toLowerCase()}.`
      : `The latest ${profile.sourceNoun.toLowerCase()} sets out a development that is directly relevant to ${candidate.category} operators.`;

  const standfirstSentence = firstUsefulSentence(standfirst);
  const sentences = [intro];
  if (first && (!standfirstSentence || first.toLowerCase() !== standfirstSentence.toLowerCase()) && !sentences.join(' ').toLowerCase().includes(first.toLowerCase())) {
    sentences.push(first);
  }
  if (second && !sentences.join(' ').toLowerCase().includes(second.toLowerCase()) && (!standfirstSentence || second.toLowerCase() !== standfirstSentence.toLowerCase())) {
    sentences.push(second);
  }
  return sentences.map(normaliseSentence).join(' ');
}

function buildWhyItMatters(candidate, tags, profile) {
  const categoryMap = {
    security: 'This matters because it has practical implications for defensive prioritisation, exposure management, or incident response rather than sitting as abstract security commentary.',
    privacy: 'This matters because it changes what privacy teams, platform owners, or product leaders should treat as a real operating constraint.',
    governance: 'This matters because it shows where governance expectations are becoming more operational and easier to enforce in practice.',
    infrastructure: 'This matters because infrastructure-layer issues tend to create wider blast radius and more durable operational consequences than isolated product bugs.',
    surveillance: 'This matters because surveillance-related developments often normalise harm well before institutions respond with clear controls.',
    'ai-risk': 'This matters because AI-related risk increasingly shows up through deployment choices, interfaces, and governance gaps rather than model headlines alone.',
  };

  let extra = '';
  if (tags.includes('kev')) extra = ' KEV-style urgency also pushes the item closer to immediate operational response than routine tracking.';
  else if (profile.voice === 'enforcement') extra = ' It also signals where regulators expect design, governance, and assurance controls to exist before harm occurs.';
  else if (tags.includes('compliance') || tags.includes('regulation')) extra = ' It is a direct signal about how compliance and policy expectations are being translated into implementation work.';
  else if (tags.includes('threat-intelligence')) extra = ' It also helps frame how defenders should think about attacker adaptation and recurring tradecraft rather than single incidents in isolation.';

  return `${categoryMap[candidate.category] || categoryMap.governance}${extra}`.trim();
}

function buildAssessment(candidate, tags, profile) {
  let opening = 'The strongest signal here is not just the headline event, but the wider pattern it points to.';

  if (profile.voice === 'governance') {
    opening = 'The strongest signal here is operational direction: this is about turning guidance or policy into concrete expectations.';
  } else if (profile.voice === 'enforcement') {
    opening = 'The strongest signal here is that regulator expectations are being expressed through enforceable outcomes rather than soft signalling alone.';
  } else if (tags.includes('threat-intelligence')) {
    opening = 'The strongest signal here is the tradecraft pattern and what it says about attacker adaptation, not just the single campaign or disclosure.';
  } else if (tags.includes('vulnerabilities')) {
    opening = 'The strongest signal here is that a vulnerability class or attack path is being treated as operationally relevant rather than background technical debt.';
  }

  const followOn = tags.includes('cloud')
    ? ' In practice, that means cloud-adjacent control planes, shared services, and inherited trust assumptions deserve more scrutiny than many organisations currently give them.'
    : tags.includes('children')
      ? ' In practice, that means child-safety issues should be treated as design and governance questions, not just legal review items.'
      : tags.includes('compliance')
        ? ' In practice, that means teams should expect a higher bar for evidence, ownership, and implementation quality.'
        : ' In practice, that means operators should read this as a broader signal over noise item rather than a narrow one-off.';

  return `${opening}${followOn}`.trim();
}

function buildRecommendedActions(tags, category, profile) {
  const bullets = [];

  if (category === 'security' || tags.includes('vulnerabilities')) {
    bullets.push('review whether the issue, advisory, or attack pattern is relevant to your environment, suppliers, or exposed systems');
    bullets.push('patch, harden, or validate logging and monitoring coverage where applicable');
  }
  if (tags.includes('cloud')) bullets.push('check whether cloud services, connectors, or shared administrative paths create avoidable trust-boundary risk');
  if (tags.includes('compliance') || tags.includes('regulation') || profile.voice === 'governance') bullets.push('translate the development into specific ownership, policy, and evidence requirements instead of leaving it as background policy tracking');
  if (profile.voice === 'enforcement') bullets.push('test whether current controls, age checks, notices, or governance workflows would withstand regulator scrutiny in a similar case');
  if (tags.includes('children')) bullets.push('treat child-safety and youth-risk themes as product, data, and governance questions rather than communications-only concerns');
  if (tags.includes('threat-intelligence')) bullets.push('map the observed activity to existing detections and threat-hunting hypotheses instead of tracking it only as narrative reporting');

  bullets.push('monitor follow-on reporting or primary-source updates for scope expansion, implementation guidance, or stronger enforcement signals');
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

function shouldSkipCandidate(candidate) {
  if (candidate.tier !== 'Tier 1') return true;
  if (!AUTO_PUBLISH_SOURCES.has(candidate.source)) return true;
  if (/^cisa adds \w+ known exploited vulnerabilities to catalog$/i.test(candidate.title)) return true;
  if (/agenda available now|programme available now/i.test(candidate.title)) return true;
  if (/webinar|podcast|newsletter|speaking/i.test(candidate.title)) return true;
  if (/\?|\bmust\b|\bneeds\b|\bwhy\b|\bopinion\b/i.test(candidate.title)) return true;
  if (/negative option marketing practices/i.test(candidate.title)) return true;
  if (/invitation homes[’']? undisclosed fees/i.test(candidate.title)) return true;
  return false;
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
    if (shouldSkipCandidate(candidate)) continue;

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

    const profile = SOURCE_PROFILES[candidate.source] || {
      voice: candidate.category === 'governance' ? 'governance' : 'reporting',
      sourceNoun: `${candidate.source} item`,
    };

    const sourceTitle = extractTitle(html) || candidate.title;
    const description = cleanDescription(extractDescription(html) || `New ${candidate.category} development detected from ${candidate.source}.`);
    const paragraphs = extractParagraphs(html, 6);
    const combinedText = `${sourceTitle} ${description} ${paragraphs.join(' ')}`;

    if (paragraphs.length === 0) {
      console.log(`Skip ${candidate.link}: no usable article paragraphs after boilerplate filtering`);
      continue;
    }

    if (isBoilerplateText(description) || /the \.gov means it'?s official|the site is secure/i.test(combinedText)) {
      console.log(`Skip ${candidate.link}: extracted copy still looks like site boilerplate`);
      continue;
    }
    const resolvedCategory = inferCategory(candidate, combinedText);
    const resolvedCandidate = { ...candidate, category: resolvedCategory };
    const tags = inferTags(resolvedCandidate, combinedText, resolvedCategory);
    const standfirst = buildStandfirst(resolvedCandidate, description, paragraphs, profile);
    const whatHappened = buildWhatHappened(resolvedCandidate, standfirst, paragraphs, profile);
    const keyDetails = summariseKeyDetails(resolvedCandidate, paragraphs, tags, profile);
    const whyItMatters = buildWhyItMatters(resolvedCandidate, tags, profile);
    const assessment = buildAssessment(resolvedCandidate, tags, profile);

    const pubDate = new Date(review.generatedAt || new Date().toISOString());
    const year = String(pubDate.getUTCFullYear());
    const month = String(pubDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(pubDate.getUTCDate()).padStart(2, '0');
    const outDir = path.join(blogRoot, year, month);
    const outPath = path.join(outDir, `${slug}.md`);
    await fs.mkdir(outDir, { recursive: true });

    const body = `---
title: "${escapeYaml(candidate.title)}"
description: "${escapeYaml(standfirst)}"
pubDate: ${year}-${month}-${day}
draft: false
tags:
${tags.map((tag) => `  - ${tag}`).join('\n')}
canonical: "https://zerodaydiary.com/blog/${year}/${month}/${slug}/"
---

## What happened
${whatHappened}

## Key details
${keyDetails.map((item) => `- ${sentenceCase(item)}`).join('\n')}

## Why it matters
${whyItMatters}

## Assessment
${assessment}

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
