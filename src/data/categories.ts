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

export const TAG_META = {
  cloud: {
    title: 'Cloud',
    color: '#60a5fa',
    chipBackground: 'rgba(96, 165, 250, 0.18)',
  },
  'data-security': {
    title: 'Data Security',
    color: '#2dd4bf',
    chipBackground: 'rgba(45, 212, 191, 0.18)',
  },
  vulnerabilities: {
    title: 'Vulnerabilities',
    color: '#f87171',
    chipBackground: 'rgba(248, 113, 113, 0.18)',
  },
  devops: {
    title: 'DevOps',
    color: '#818cf8',
    chipBackground: 'rgba(129, 140, 248, 0.18)',
  },
  crypto: {
    title: 'Crypto',
    color: '#fbbf24',
    chipBackground: 'rgba(251, 191, 36, 0.18)',
  },
  kev: {
    title: 'KEV',
    color: '#fb7185',
    chipBackground: 'rgba(251, 113, 133, 0.18)',
  },
  'network-edge': {
    title: 'Network Edge',
    color: '#0ea5e9',
    chipBackground: 'rgba(14, 165, 233, 0.18)',
  },
  compliance: {
    title: 'Compliance',
    color: '#c084fc',
    chipBackground: 'rgba(192, 132, 252, 0.18)',
  },
  regulation: {
    title: 'Regulation',
    color: '#eab308',
    chipBackground: 'rgba(234, 179, 8, 0.18)',
  },
  enforcement: {
    title: 'Enforcement',
    color: '#14b8a6',
    chipBackground: 'rgba(20, 184, 166, 0.18)',
  },
  children: {
    title: 'Children',
    color: '#f472b6',
    chipBackground: 'rgba(244, 114, 182, 0.18)',
  },
  'data-rights': {
    title: 'Data Rights',
    color: '#8b5cf6',
    chipBackground: 'rgba(139, 92, 246, 0.18)',
  },
  'public-sector': {
    title: 'Public Sector',
    color: '#f97316',
    chipBackground: 'rgba(249, 115, 22, 0.18)',
  },
  'threat-intelligence': {
    title: 'Threat Intelligence',
    color: '#22c55e',
    chipBackground: 'rgba(34, 197, 94, 0.18)',
  },
  espionage: {
    title: 'Espionage',
    color: '#ef4444',
    chipBackground: 'rgba(239, 68, 68, 0.18)',
  },
  automation: {
    title: 'Automation',
    color: '#84cc16',
    chipBackground: 'rgba(132, 204, 22, 0.18)',
  },
} as const;

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

  if (tag in TAG_META) {
    const key = tag as keyof typeof TAG_META;
    return TAG_META[key];
  }

  return {
    title: tag,
    color: '#67e8f9',
    chipBackground: 'rgba(34, 211, 238, 0.16)',
  };
}
