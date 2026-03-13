import fs from 'node:fs/promises';
import path from 'node:path';

function parseFrontmatter(markdown = '') {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error('Missing or malformed frontmatter block');
  }

  const [, frontmatter, body] = match;
  const title = frontmatter.match(/^title:\s*"([\s\S]*?)"\s*$/m)?.[1]?.trim();
  const description = frontmatter.match(/^description:\s*"([\s\S]*?)"\s*$/m)?.[1]?.trim();
  const pubDate = frontmatter.match(/^pubDate:\s*(.+)\s*$/m)?.[1]?.trim();
  const draft = frontmatter.match(/^draft:\s*(true|false)\s*$/m)?.[1]?.trim();
  const canonical = frontmatter.match(/^canonical:\s*"([\s\S]*?)"\s*$/m)?.[1]?.trim();
  const tagsBlock = frontmatter.match(/^tags:\s*\r?\n((?:\s+-\s+.+\r?\n?)*)/m)?.[1] || '';
  const tags = tagsBlock
    .split(/\r?\n/)
    .map((line) => line.match(/^\s+-\s+(.+)$/)?.[1]?.trim())
    .filter(Boolean);

  return { frontmatter, body, data: { title, description, pubDate, draft, canonical, tags } };
}

export function validateGeneratedMarkdown(markdown, { expectedSlug, expectedCanonical, requireSections = [] } = {}) {
  const { body, data } = parseFrontmatter(markdown);

  if (!data.title) throw new Error('Frontmatter title is required');
  if (!data.description) throw new Error('Frontmatter description is required');
  if (!data.pubDate || Number.isNaN(Date.parse(data.pubDate))) throw new Error('Frontmatter pubDate must be a valid date');
  if (!['true', 'false'].includes(data.draft || '')) throw new Error('Frontmatter draft must be boolean');
  if (!data.canonical) throw new Error('Frontmatter canonical is required');
  try {
    new URL(data.canonical);
  } catch {
    throw new Error('Frontmatter canonical must be a valid URL');
  }
  if (expectedCanonical && data.canonical !== expectedCanonical) {
    throw new Error(`Canonical mismatch: expected ${expectedCanonical}, received ${data.canonical}`);
  }
  if (expectedSlug && !data.canonical.includes(`/${expectedSlug}/`)) {
    throw new Error(`Canonical does not include expected slug: ${expectedSlug}`);
  }
  if (!Array.isArray(data.tags) || data.tags.length === 0) throw new Error('At least one tag is required');

  for (const heading of requireSections) {
    const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!new RegExp(`^##\\s+${escaped}\\s*$`, 'm').test(body)) {
      throw new Error(`Missing required section: ${heading}`);
    }
  }

  return data;
}

export async function writeValidatedMarkdown(filePath, markdown, options = {}) {
  validateGeneratedMarkdown(markdown, options);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, markdown.endsWith('\n') ? markdown : `${markdown}\n`, 'utf8');
}
