export const CATEGORY_META = {
  security: {
    title: 'Security',
    description: 'Cybersecurity briefings on breaches, exploited vulnerabilities, ransomware, incident response, and systemic security failures.',
    color: '#22d3ee',
    chipBackground: 'rgba(34, 211, 238, 0.18)',
  },
  privacy: {
    title: 'Privacy',
    description: 'Privacy briefings on data misuse, tracking changes, surveillance harms, regulator action, and data rights enforcement.',
    color: '#a78bfa',
    chipBackground: 'rgba(167, 139, 250, 0.18)',
  },
  'ai-risk': {
    title: 'AI Risk',
    description: 'AI risk briefings on model misuse, deployment failures, safety regressions, governance gaps, and synthetic-media harms.',
    color: '#f59e0b',
    chipBackground: 'rgba(245, 158, 11, 0.18)',
  },
  governance: {
    title: 'Governance',
    description: 'Governance briefings on enforcement, standards, court action, regulator opinions, institutional accountability, and policy shifts.',
    color: '#94a3b8',
    chipBackground: 'rgba(148, 163, 184, 0.18)',
  },
  infrastructure: {
    title: 'Infrastructure',
    description: 'Infrastructure briefings on cloud, telecoms, public systems, network edge, and critical infrastructure risk developments.',
    color: '#38bdf8',
    chipBackground: 'rgba(56, 189, 248, 0.18)',
  },
  surveillance: {
    title: 'Surveillance',
    description: 'Surveillance briefings on biometrics, monitoring systems, identity correlation, tracking technology, and public or private observation systems.',
    color: '#cbd5e1',
    chipBackground: 'rgba(203, 213, 225, 0.18)',
  },
} as const;

export const CATEGORY_LIST = Object.entries(CATEGORY_META).map(([slug, meta]) => ({ slug, ...meta }));

const CATEGORY_PRIORITY = ['security', 'privacy', 'ai-risk', 'governance', 'surveillance', 'infrastructure'] as const;

export function getPrimaryCategory(tags: string[]) {
  const slug = CATEGORY_PRIORITY.find((item) => tags.includes(item)) ?? 'governance';
  return { slug, ...CATEGORY_META[slug] };
}

export function getTagTheme(tag: string) {
  if (tag in CATEGORY_META) {
    const key = tag as keyof typeof CATEGORY_META;
    return CATEGORY_META[key];
  }

  return {
    title: tag,
    color: '#67e8f9',
    chipBackground: 'rgba(34, 211, 238, 0.16)',
  };
}
