import fs from 'node:fs/promises';
import path from 'node:path';
import { writeCanonicalPost } from './lib/content-writer.mjs';

const [,, inputPath] = process.argv;
if (!inputPath) {
  console.error('Usage: node scripts/monitoring/create-draft-from-candidate.mjs <candidate.json>');
  process.exit(1);
}

const root = process.cwd();
const candidate = JSON.parse(await fs.readFile(path.resolve(root, inputPath), 'utf8'));
const sourceLinks = (candidate.sources || [])
  .map((src) => `- [${src.label || src.url}](${src.url})`)
  .join('\n');

const sections = {
  'What happened': candidate.summary || candidate.overview || 'Two to three sentences summarising the event, what changed, and why it matters.',
  'Why it matters': candidate.why_it_matters || 'Explain the operational, regulatory, or strategic significance.',
  Assessment: candidate.analysis || candidate.key_details || 'Provide disciplined interpretation, implications, and uncertainty where relevant.',
  'Recommended actions': candidate.practical_takeaway || '- Verify exposure or relevance\n- Patch, harden, or monitor as appropriate\n- Track follow-on guidance from the primary source',
  'Further reading': sourceLinks || '- Add primary and supporting sources.',
};

const { filePath } = await writeCanonicalPost({
  root,
  title: candidate.title,
  description: candidate.description,
  slugInput: candidate.slug || candidate.title,
  dateInput: candidate.pubDate || new Date(),
  draft: candidate.draft ?? true,
  tags: candidate.tags || [],
  sections,
});

console.log(`Draft created: ${path.relative(root, filePath).replace(/\\/g, '/')}`);
