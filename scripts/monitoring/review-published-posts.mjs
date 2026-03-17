import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { validateGeneratedMarkdown, writeValidatedMarkdown } from './lib/markdown-validation.mjs';

const execFileAsync = promisify(execFile);
const root = process.cwd();

const apiKey = process.env.ANTHROPIC_API_KEY || '';
const model = process.env.ANTHROPIC_REVIEW_MODEL || process.env.REVIEW_MODEL || '';
const baseUrl = 'https://api.anthropic.com/v1/messages';

function extractTitle(markdown = '') {
  return markdown.match(/^title:\s*"([^"]+)"/m)?.[1] || markdown.match(/^title:\s*(.+)$/m)?.[1] || 'Untitled';
}

function expectedCanonicalForPath(filePath) {
  const normalised = filePath.replace(/\\/g, '/');
  const match = normalised.match(/^src\/content\/blog\/(\d{4})\/(\d{2})\/([^/]+)\.mdx?$/i);
  if (!match) return null;
  const [, year, month, slug] = match;
  return `https://zerodaydiary.com/blog/${year}/${month}/${slug}/`;
}

async function getChangedPosts() {
  const { stdout } = await execFileAsync('git', ['diff', '--name-only', '--', 'src/content/blog'], { cwd: root });
  return stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).filter((line) => /src\/content\/blog\/.+\.mdx?$/i.test(line));
}

async function reviewPost(filePath, markdown) {
  const prompt = `You are reviewing a draft cybersecurity/privacy/governance publication for ZeroDayDiary. Be tough, concise, and editorially sharp.

Review goals:
1. Check whether this post is strong enough to publish on a signal-over-noise editorial site.
2. Check factual framing, specificity, tone, category/tag fit, and whether it reads like a mechanical placeholder.
3. If it needs improvement but is salvageable, produce a revised full markdown file preserving valid frontmatter structure.
4. If it is too weak to publish, say so clearly.

Return STRICT JSON only with this schema:
{
  "approved": true|false,
  "needs_changes": true|false,
  "should_skip": true|false,
  "summary": "short verdict",
  "issues": ["..."],
  "revised_markdown": "full revised markdown or empty string"
}

Rules:
- Keep the post aligned with ZeroDayDiary's tone: specific, analytical, publication-quality.
- Preserve canonical URL unless a better title slug would be impossible to avoid. Prefer not to change canonical.
- If the draft is already good, return approved=true and empty revised_markdown.
- If the draft can be fixed, return revised_markdown as the full corrected markdown.
- If it should not be published, return should_skip=true and revised_markdown empty.

File: ${filePath}

Markdown draft:
${markdown}`;

  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1600,
      temperature: 0,
      system: 'Return strict JSON only.',
      messages: [
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!res.ok) throw new Error(`Reviewer API HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const content = data?.content?.find?.((item) => item?.type === 'text')?.text || '';
  if (!content) throw new Error('Reviewer API returned no content');

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Reviewer JSON parse failed: ${String(error.message || error)} :: ${content.slice(0, 300)}`);
  }
}

async function main() {
  const changedPosts = await getChangedPosts();
  if (changedPosts.length === 0) {
    console.log('Reviewer: no changed blog posts to inspect.');
    return;
  }

  if (process.env.OPENROUTER_API_KEY || process.env.REVIEW_BASE_URL || process.env.FALLBACK_REVIEW_MODEL) {
    throw new Error('Legacy reviewer config detected. Remove OPENROUTER_API_KEY, REVIEW_BASE_URL, and FALLBACK_REVIEW_MODEL from the scheduled environment.');
  }

  if (!apiKey || !model) {
    throw new Error(`Anthropic reviewer required but not configured. Missing ${!apiKey ? 'ANTHROPIC_API_KEY' : 'ANTHROPIC_REVIEW_MODEL'} for posts: ${changedPosts.join(', ')}`);
  }

  if (!/^claude|^anthropic\//i.test(model)) {
    throw new Error(`ANTHROPIC_REVIEW_MODEL must reference a Claude/Anthropic model. Received: ${model}`);
  }

  for (const relativePath of changedPosts) {
    const fullPath = path.join(root, relativePath);
    const original = await fs.readFile(fullPath, 'utf8');
    const title = extractTitle(original);
    const canonical = expectedCanonicalForPath(relativePath);
    validateGeneratedMarkdown(original, {
      expectedSlug: canonical ? canonical.split('/').filter(Boolean).at(-1) : undefined,
      expectedCanonical: canonical || undefined,
      requireSections: ['What happened', 'Why it matters', 'Assessment', 'Further reading'],
    });
    console.log(`Reviewer: inspecting ${relativePath} (${title})`);

    const result = await reviewPost(relativePath, original);
    const summary = result.summary || 'no summary';
    console.log(`Reviewer verdict: ${summary}`);

    if (Array.isArray(result.issues) && result.issues.length) {
      for (const issue of result.issues) console.log(`- ${issue}`);
    }

    if (result.should_skip) throw new Error(`Reviewer rejected ${relativePath}: ${summary}`);

    const revised = String(result.revised_markdown || '').trim();
    if (result.needs_changes && revised) {
      await writeValidatedMarkdown(fullPath, revised, {
        expectedSlug: canonical ? canonical.split('/').filter(Boolean).at(-1) : undefined,
        expectedCanonical: canonical || undefined,
        requireSections: ['What happened', 'Why it matters', 'Assessment', 'Further reading'],
      });
      console.log(`Reviewer: applied validated revisions to ${relativePath}`);
    }
  }
}

await main();
