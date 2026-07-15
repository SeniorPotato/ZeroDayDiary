import path from 'node:path';
import process from 'node:process';
import { writeCanonicalPost } from './monitoring/lib/content-writer.mjs';

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

const sections = mode === 'event'
  ? {
      'What happened': process.env.INPUT_OVERVIEW || 'Add the initial event summary here.',
      'Why it matters': process.env.INPUT_WHY_IT_MATTERS || 'Explain the operational, regulatory, or public-interest significance.',
      Assessment: process.env.INPUT_ANALYSIS || 'Capture the sharper editorial assessment and what changes in practice.',
      'Recommended actions': process.env.INPUT_RECOMMENDED_ACTIONS || '- Add initial response, monitoring, or follow-up actions here.',
      'Further reading': process.env.INPUT_FURTHER_READING || '- Add primary-source links here.',
    }
  : {
      'What happened': 'Add the initial article draft here.',
      'Why it matters': 'Explain the operational, regulatory, or public-interest significance.',
      Assessment: 'Capture the sharper editorial assessment and why this is signal rather than noise.',
      'Recommended actions': '- Add initial response, monitoring, or follow-up actions here.',
      'Further reading': '- Add primary-source links here.',
    };

const { filePath } = await writeCanonicalPost({ root, title, description, slugInput, draft, tags, sections });
console.log(`Created validated ${mode} draft: ${path.relative(root, filePath).replace(/\\/g, '/')}`);
