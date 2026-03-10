import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const blogDir = path.join(root, 'src/content/blog/2026/03');

const targets = new Set([
  'last-48-hours-watchlist-three-signals-worth-tracking.md',
  'privacy-guardrails-are-becoming-an-ai-competitiveness-question.md',
  'student-cyber-safety-is-becoming-a-global-policy-issue.md',
  'why-the-next-wave-of-ai-security-stories-will-be-about-interfaces.md',
  'cisa-updates-play-ransomware-guidance-as-victim-count-nears-900.md',
  'edpb-llm-privacy-report-signals-a-more-operational-phase-of-ai-governance.md',
  'ico-fines-reddit-over-childrens-privacy-failures-and-age-assurance-gaps.md',
  'edpb-links-cross-border-data-transfer-rules-with-ai-skills-and-governance-capacity.md',
  'ico-investigations-show-child-data-enforcement-is-moving-upstream-into-platform-design.md',
  'joint-advisory-flags-interlock-ransomware-as-an-active-cross-sector-threat.md',
  'akira-advisory-update-shows-ransomware-crews-are-still-winning-through-edge-and-remote-access-weaknesses.md',
  'edpb-blockchain-guidance-is-really-about-design-stage-privacy-governance.md',
  'imgur-fine-reinforces-that-child-safety-cases-are-also-design-and-data-governance-cases.md',
  'cisa-issues-urgent-guidance-on-ongoing-global-exploitation-of-cisco-sd-wan-systems.md',
  'edpb-backs-global-privacy-statement-on-ai-generated-imagery-and-harm-to-identifiable-people.md'
]);

function normalize(text) { return text.replace(/\r\n/g, '\n'); }
function sec(body, name) {
  const m = body.match(new RegExp(`## ${name}\\n([\\s\\S]*?)(?=\\n## |$)`, 'i'));
  return m ? m[1].trim() : '';
}
function splitParaBullets(text) {
  const idx = text.indexOf('\n- ');
  if (idx === -1) return { para: text.trim(), bullets: '' };
  return { para: text.slice(0, idx).trim(), bullets: text.slice(idx).trim() };
}
function bulletsToSentenceList(bullets) {
  const items = bullets.split('\n').map(s => s.trim()).filter(Boolean).map(s => s.replace(/^-\s*/, ''));
  if (!items.length) return '';
  return items.map(i => `- ${i}`).join('\n');
}

for (const file of await fs.readdir(blogDir)) {
  if (!targets.has(file)) continue;
  const full = path.join(blogDir, file);
  const raw = normalize(await fs.readFile(full, 'utf8'));
  const parts = raw.split('---\n');
  const front = `---\n${parts[1]}---\n\n`;
  const body = parts.slice(2).join('---\n').trim();
  const summary = sec(body, 'Summary');
  const happened = sec(body, 'What happened');
  const why = sec(body, 'Why it matters');
  const assess = sec(body, 'Assessment');
  const actions = sec(body, 'Recommended actions');
  const reading = sec(body, 'Further reading');

  const happenedParts = splitParaBullets(happened);
  const assessClean = assess
    .replace(/\n\nThis signal is worth continued attention because\s*/i, '\n\nKey follow-on points to watch include:\n')
    .replace(/because\s*- /i, 'Key follow-on points to watch include:\n- ');
  const actionLines = actions.split('\n').filter(Boolean).map(s => s.trim());
  const cleanedActions = actionLines.map((line) => line.replace(/^[-]\s*monitor follow-on developments, especially\s*[-]?\s*/i, '- monitor follow-on developments, especially: ')).join('\n');
  const polishedActions = cleanedActions.replace(/especially:\s*(.+)$/im, (m, rest) => {
    if (rest.startsWith('-')) return m;
    return `especially ${rest}`;
  });

  const rebuilt = `${front}## Summary\n${summary}\n\n## What happened\n${happenedParts.para}${happenedParts.bullets ? `\n\n### Who is affected\n${bulletsToSentenceList(happenedParts.bullets)}` : ''}\n\n## Why it matters\n${why}\n\n## Assessment\n${assessClean}\n\n## Recommended actions\n${polishedActions}\n\n## Further reading\n${reading}\n`;
  await fs.writeFile(full, rebuilt, 'utf8');
}

console.log(`Polished ${targets.size} migrated post(s).`);
