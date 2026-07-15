import fs from 'node:fs/promises';
import path from 'node:path';
import { appendFile, ensureDir, makeSlug, readJson } from './lib/shared.mjs';
import { extractHtmlLinks } from './lib/html-utils.mjs';

const root = process.cwd();
const sourcesPath = path.join(root, 'data/monitoring/sources.json');
const statePath = path.join(root, 'data/monitoring/state/source-review-state.json');
const reviewLogPath = path.join(root, 'data/monitoring/review-log.md');
const packetDir = path.join(root, 'data/monitoring/review-packets');
const intakePath = path.join(root, 'data/monitoring/intake.md');
const latestReviewStatePath = path.join(root, 'data/monitoring/state/latest-source-review.json');

const now = new Date();
const iso = now.toISOString();
const packetStamp = iso.replace(/[:]/g, '').replace(/\.\d{3}Z$/, 'Z');
const packetPath = path.join(packetDir, `${packetStamp}.md`);

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const fixtureIndex = args.indexOf('--fixture');
const fixturePath = fixtureIndex >= 0 ? args[fixtureIndex + 1] : '';

if (fixtureIndex >= 0 && !fixturePath) {
  throw new Error('--fixture requires a path to a local HTML file');
}

const sources = await readJson(sourcesPath, []);
const state = await readJson(statePath, { seen: {} });
const fixtureHtml = fixturePath ? await fs.readFile(path.resolve(root, fixturePath), 'utf8') : '';
if (!dryRun) {
  await ensureDir(packetDir);
  await ensureDir(path.dirname(statePath));
}

const reviewLines = ['# Review Packet', '', `- **Generated:** ${iso}`, ''];
const newCandidates = [];

for (const source of sources) {
  let html = '';
  try {
    if (fixtureHtml) {
      html = fixtureHtml;
    } else {
      const res = await fetch(source.url, { headers: { 'user-agent': 'ZeroDayDiary/1.0 review bot' } });
      html = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    }
  } catch (error) {
    reviewLines.push(`## ${source.name}`, '', '- Status: fetch failed', `- Error: ${String(error.message || error)}`, '');
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

if (!dryRun) {
  await fs.writeFile(packetPath, reviewLines.join('\n'), 'utf8');
  await fs.writeFile(statePath, JSON.stringify(state, null, 2) + '\n', 'utf8');
  await fs.writeFile(latestReviewStatePath, JSON.stringify({ generatedAt: iso, packetPath: path.relative(root, packetPath).replace(/\\/g, '/'), candidates: newCandidates }, null, 2) + '\n', 'utf8');
}

if (!dryRun && newCandidates.length > 0) {
  const intakeLines = newCandidates.map((item) => `\n- **Date discovered:** ${item.discovered}\n- **Headline / event:** ${item.title}\n- **Source URL:** ${item.link}\n- **Source tier:** ${item.tier}\n- **Initial category guess:** ${item.category}\n- **Why it may matter:** newly detected through scheduled source review from ${item.source.toLowerCase()}\n- **Status:** DISCOVERED\n`).join('');
  await appendFile(intakePath, intakeLines);
}

const reviewSummary = `\n- **Timestamp:** ${iso.replace('T', ' ').replace('Z', ' UTC')}\n- **Reviewer:** scheduled workflow\n- **Sources checked:** ${sources.map((s) => s.name).join(', ')}\n- **Result:** ${newCandidates.length > 0 ? `${newCandidates.length} new candidate(s)` : 'no publishable change'}\n- **Notes:** Review packet generated at \`${path.relative(root, packetPath).replace(/\\/g, '/')}\`.\n`;
if (!dryRun) {
  await appendFile(reviewLogPath, reviewSummary);
}

console.log(`${dryRun ? 'Dry run review packet' : 'Generated review packet'}: ${path.relative(root, packetPath)}`);
console.log(`New candidates: ${newCandidates.length}`);
if (fixtureHtml) console.log(`Fixture: ${path.relative(root, path.resolve(root, fixturePath))}`);
if (dryRun) console.log('Dry run: no monitoring state, packet, intake, or review log files were written.');
