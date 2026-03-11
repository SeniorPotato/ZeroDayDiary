import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourcesPath = path.join(root, 'data/monitoring/sources.json');
const statePath = path.join(root, 'data/monitoring/state/source-review-state.json');
const reviewLogPath = path.join(root, 'data/monitoring/review-log.md');
const packetDir = path.join(root, 'data/monitoring/review-packets');
const intakePath = path.join(root, 'data/monitoring/intake.md');

const now = new Date();
const iso = now.toISOString();
const packetStamp = iso.replace(/[:]/g, '').replace(/\.\d{3}Z$/, 'Z');
const packetPath = path.join(packetDir, `${packetStamp}.md`);

const ensureDir = async (dir) => fs.mkdir(dir, { recursive: true });
const exists = async (p) => !!(await fs.stat(p).catch(() => null));

function absolutize(base, href) {
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

function stripTags(text) {
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractHtmlLinks(html, baseUrl, includePatterns = [], excludePatterns = [], titleRejectPatterns = []) {
  const matches = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  const items = [];

  for (const match of matches) {
    const rawHref = match[1] || '';
    if (rawHref.startsWith('#')) continue;
    const href = absolutize(baseUrl, rawHref);
    if (!href) continue;
    const url = new URL(href);
    if (url.hash) continue;
    if (includePatterns.length && !includePatterns.some((p) => href.includes(p))) continue;
    if (excludePatterns.length && excludePatterns.some((p) => href.includes(p))) continue;

    let title = stripTags(match[2]);
    if (!title || title.length < 8) continue;
    title = title.replace(/&#\d+;/g, ' ').replace(/\s+/g, ' ').trim();
    title = title.split(/\s+Mar\s+\d{1,2},\s+20\d{2}\b/i)[0].trim();
    title = title.split(/\s+(Artificial Intelligence|Threat Detection|Malware|Network Security|Cloud Security|API Security|Developer Security)\b/i)[0].trim();
    if (!title || title.length < 8) continue;
    if (/^(read more|learn more|more|next|previous|skip to main content|back to top|question)$/i.test(title)) continue;
    if (/^posted on /i.test(title)) continue;
    if (/^\d+ comments?$/i.test(title)) continue;
    if (title.split(/\s+/).length < 4) continue;
    if (titleRejectPatterns.length && titleRejectPatterns.some((pattern) => new RegExp(pattern, 'i').test(title))) continue;

    items.push({ title, link: href });
  }

  const deduped = [];
  const seen = new Set();
  for (const item of items) {
    const key = `${item.link}::${item.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  return deduped.slice(0, 12);
}

function makeSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

async function readJson(p, fallback) {
  if (!(await exists(p))) return fallback;
  return JSON.parse(await fs.readFile(p, 'utf8'));
}

async function appendFile(p, text) {
  await fs.appendFile(p, text, 'utf8');
}

const sources = await readJson(sourcesPath, []);
const state = await readJson(statePath, { seen: {} });
await ensureDir(packetDir);
await ensureDir(path.dirname(statePath));

const reviewLines = [`# Review Packet`, '', `- **Generated:** ${iso}`, ''];
const newCandidates = [];

for (const source of sources) {
  let html = '';
  try {
    const res = await fetch(source.url, { headers: { 'user-agent': 'ZeroDayDiary/1.0 review bot' } });
    html = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (error) {
    reviewLines.push(`## ${source.name}`, '', `- Status: fetch failed`, `- Error: ${String(error.message || error)}`, '');
    continue;
  }

  const links = extractHtmlLinks(
    html,
    source.url,
    source.includePatterns || [],
    source.excludePatterns || [],
    source.titleRejectPatterns || []
  );
  const seenForSource = new Set(state.seen[source.id] || []);
  const unseen = links.filter((item) => !seenForSource.has(item.link));
  const publishable = unseen.filter((item) => !/agenda available now|programme available now/i.test(item.title));

  reviewLines.push(`## ${source.name}`, '');
  reviewLines.push(`- Source URL: ${source.url}`);
  reviewLines.push(`- Items scanned: ${links.length}`);
  reviewLines.push(`- New candidates: ${publishable.length}`, '');

  for (const item of publishable.slice(0, 5)) {
    reviewLines.push(`- [ ] ${item.title}`);
    reviewLines.push(`  - Link: ${item.link}`);
    reviewLines.push(`  - Tier: ${source.tier}`);
    reviewLines.push(`  - Initial category: ${source.category}`);
    reviewLines.push('');

    newCandidates.push({
      discovered: iso.slice(0, 10),
      title: item.title,
      link: item.link,
      tier: source.tier,
      category: source.category,
      slug: makeSlug(item.title),
      source: source.name,
    });

    seenForSource.add(item.link);
  }

  state.seen[source.id] = [...seenForSource, ...publishable.map((item) => item.link)];
}

await fs.writeFile(packetPath, reviewLines.join('\n'), 'utf8');
await fs.writeFile(statePath, JSON.stringify(state, null, 2) + '\n', 'utf8');

if (newCandidates.length > 0) {
  const intakeLines = newCandidates.map((item) => `\n- **Date discovered:** ${item.discovered}\n- **Headline / event:** ${item.title}\n- **Source URL:** ${item.link}\n- **Source tier:** ${item.tier}\n- **Initial category guess:** ${item.category}\n- **Why it may matter:** newly detected through scheduled source review from ${item.source.toLowerCase()}\n- **Status:** DISCOVERED\n`).join('');
  await appendFile(intakePath, intakeLines);
}

const reviewSummary = `\n- **Timestamp:** ${iso.replace('T', ' ').replace('Z', ' UTC')}\n- **Reviewer:** scheduled workflow\n- **Sources checked:** ${sources.map((s) => s.name).join(', ')}\n- **Result:** ${newCandidates.length > 0 ? `${newCandidates.length} new candidate(s)` : 'no publishable change'}\n- **Notes:** Review packet generated at \`${path.relative(root, packetPath).replace(/\\/g, '/')}\`.\n`;
await appendFile(reviewLogPath, reviewSummary);

console.log(`Generated review packet: ${path.relative(root, packetPath)}`);
console.log(`New candidates: ${newCandidates.length}`);
