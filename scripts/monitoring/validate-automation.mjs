import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { extractHtmlLinks, extractParagraphs } from './lib/html-utils.mjs';

const execFileAsync = promisify(execFile);
const sourceFixture = 'test/fixtures/monitoring/source-list.html';
const articleFixture = 'test/fixtures/monitoring/article.html';

const sourceHtml = await readFile(sourceFixture, 'utf8');
const links = extractHtmlLinks(sourceHtml, 'https://www.cisa.gov/news-events/cybersecurity-advisories', ['/news-events/cybersecurity-advisories/']);
assert.equal(links.length, 1, 'source fixture should expose one CISA advisory candidate');
assert.match(links[0].title, /Critical cloud boundary flaw/i);

const articleHtml = await readFile(articleFixture, 'utf8');
const paragraphs = extractParagraphs(articleHtml, { limit: 4 });
assert.equal(paragraphs.length, 3, 'article fixture should expose usable article paragraphs');
assert.match(paragraphs.join(' '), /trust-boundary problem/i);

await execFileAsync('node', ['scripts/monitoring/review-sources.mjs', '--dry-run', '--fixture', sourceFixture], { maxBuffer: 1024 * 1024 * 10 });
await execFileAsync('node', ['scripts/monitoring/publish-candidates.mjs', '--dry-run', '--fixture', articleFixture], { maxBuffer: 1024 * 1024 * 10 });
await execFileAsync('node', ['scripts/monitoring/lib/publish-priority-check.mjs'], { maxBuffer: 1024 * 1024 * 10 });

console.log('Automation validation passed.');
