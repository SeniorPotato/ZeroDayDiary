import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const root = process.cwd();

const apiKey = process.env.OPENROUTER_API_KEY || process.env.REVIEW_API_KEY || '';
const model = process.env.FALLBACK_REVIEW_MODEL || process.env.REVIEW_MODEL || '';
const baseUrl = process.env.REVIEW_BASE_URL || 'https://openrouter.ai/api/v1/chat/completions';

function extractTitle(markdown = '') {
  return markdown.match(/^title:\s*"([^"]+)"/m)?.[1] || markdown.match(/^title:\s*(.+)$/m)?.[1] || 'Untitled';
}

async function getChangedPosts() {
  const { stdout } = await execFileAsync('git', ['diff', '--name-only', '--', 'src/content/blog'], { cwd: root });
  return stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => /src\/content\/blog\/.+\.mdx?$/i.test(line));
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
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://zerodaydiary.com',
      'X-Title': 'ZeroDayDiary reviewer',
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Return strict JSON only.' },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Reviewer API HTTP ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('Reviewer API returned no content');

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    throw new Error(`Reviewer JSON parse failed: ${String(error.message || error)} :: ${content.slice(0, 300)}`);
  }

  return parsed;
}

async function main() {
  const changedPosts = await getChangedPosts();

  if (changedPosts.length === 0) {
    console.log('Reviewer: no changed blog posts to inspect.');
    return;
  }

  if (!apiKey || !model) {
    console.log('Reviewer: fallback review model not configured; skipping AI review.');
    console.log(`Reviewer: pending posts would have been reviewed: ${changedPosts.join(', ')}`);
    return;
  }

  for (const relativePath of changedPosts) {
    const fullPath = path.join(root, relativePath);
    const original = await fs.readFile(fullPath, 'utf8');
    const title = extractTitle(original);
    console.log(`Reviewer: inspecting ${relativePath} (${title})`);

    const result = await reviewPost(relativePath, original);
    const summary = result.summary || 'no summary';
    console.log(`Reviewer verdict: ${summary}`);

    if (Array.isArray(result.issues) && result.issues.length) {
      for (const issue of result.issues) console.log(`- ${issue}`);
    }

    if (result.should_skip) {
      throw new Error(`Reviewer rejected ${relativePath}: ${summary}`);
    }

    const revised = String(result.revised_markdown || '').trim();
    if (result.needs_changes && revised) {
      await fs.writeFile(fullPath, `${revised}\n`, 'utf8');
      console.log(`Reviewer: applied revisions to ${relativePath}`);
    }
  }
}

await main();
