import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const blogDir = path.join(root, 'src/content/blog/2026/03');

function normalize(text) {
  return text.replace(/\r\n/g, '\n');
}

function extractSection(body, heading) {
  const pattern = new RegExp(`## ${heading}\\n([\\s\\S]*?)(?=\\n## |$)`, 'i');
  const match = body.match(pattern);
  return match ? match[1].trim() : '';
}

function hasNewTemplate(body) {
  return /## Summary\n/i.test(body) && /## Assessment\n/i.test(body) && /## Recommended actions\n/i.test(body);
}

function firstParagraph(text) {
  return text.split(/\n\n+/).map((s) => s.trim()).find(Boolean) || text.trim();
}

function makeSummary(description, whatHappened) {
  const paragraph = firstParagraph(whatHappened);
  if (!paragraph) return description;
  const summary = `${description} ${paragraph}`.trim();
  return summary;
}

function makeAssessment(whyItMatters, whatToWatch, title) {
  const first = firstParagraph(whyItMatters);
  const watch = firstParagraph(whatToWatch);
  if (watch) return `${first}\n\nThis signal is worth continued attention because ${watch.charAt(0).toLowerCase()}${watch.slice(1)}`;
  return `${first}\n\nThis is a development worth tracking closely as the operational picture around “${title}” continues to harden.`;
}

function makeActions(tags, whatToWatch) {
  const base = [];
  if (tags.includes('security') || tags.includes('infrastructure')) {
    base.push('- review whether the issue is relevant to your environment, suppliers, or exposed systems');
    base.push('- patch, harden, or validate logging and monitoring coverage where applicable');
  }
  if (tags.includes('privacy') || tags.includes('governance')) {
    base.push('- check whether internal policies, rights handling, or governance workflows would withstand regulator scrutiny');
  }
  if (tags.includes('ai-risk')) {
    base.push('- review where AI deployment or generated content workflows create new exposure or oversight gaps');
  }
  const watch = firstParagraph(whatToWatch);
  if (watch) base.push(`- monitor follow-on developments, especially ${watch.charAt(0).toLowerCase()}${watch.slice(1)}`);
  if (base.length === 0) {
    base.push('- review the primary sources and decide whether any immediate operational or policy response is needed');
    base.push('- monitor follow-on official guidance or disclosures');
  }
  return base.join('\n');
}

function extractSourcesSection(body) {
  const sources = extractSection(body, 'Sources and links') || extractSection(body, 'Sources and verification status');
  return sources || '- Add primary and supporting sources.';
}

const files = await fs.readdir(blogDir);
let changed = 0;
for (const file of files) {
  if (!file.endsWith('.md')) continue;
  const fullPath = path.join(blogDir, file);
  const raw = normalize(await fs.readFile(fullPath, 'utf8'));
  const parts = raw.split('---\n');
  if (parts.length < 3) continue;
  const frontmatter = `---\n${parts[1]}---\n\n`;
  const body = parts.slice(2).join('---\n').trim();
  if (hasNewTemplate(body)) continue;

  const descriptionMatch = frontmatter.match(/description: "([\s\S]*?)"/);
  const description = descriptionMatch ? descriptionMatch[1] : '';
  const tagsMatch = frontmatter.match(/tags:\n([\s\S]*?)canonical:/);
  const tags = tagsMatch ? [...tagsMatch[1].matchAll(/-\s+([^\n]+)/g)].map((m) => m[1].trim()) : [];
  const titleMatch = frontmatter.match(/title: "([\s\S]*?)"/);
  const title = titleMatch ? titleMatch[1] : file;

  const whatHappened = extractSection(body, 'What happened');
  const whyItMatters = extractSection(body, 'Why it matters');
  const whoAffected = extractSection(body, 'Who is affected');
  const whatToWatch = extractSection(body, 'What to watch next');
  const sources = extractSourcesSection(body);

  const summary = makeSummary(description, whatHappened);
  const assessment = makeAssessment(whyItMatters, whatToWatch, title);
  const actions = makeActions(tags, whatToWatch);
  const happenedBlock = [whatHappened, whoAffected ? `\n${whoAffected}` : ''].join('\n').trim();

  const rebuilt = `${frontmatter}## Summary\n${summary}\n\n## What happened\n${happenedBlock}\n\n## Why it matters\n${whyItMatters}\n\n## Assessment\n${assessment}\n\n## Recommended actions\n${actions}\n\n## Further reading\n${sources}\n`;

  await fs.writeFile(fullPath, rebuilt, 'utf8');
  changed += 1;
}

console.log(`Migrated ${changed} post(s).`);
