export const CATEGORY_META = {
  security: {
    title: 'Security',
    description: 'Breaches, vulnerabilities, exploit activity, ransomware, and systemic security failures.',
  },
  privacy: {
    title: 'Privacy',
    description: 'Data misuse, tracking changes, surveillance expansion, and privacy enforcement developments.',
  },
  'ai-risk': {
    title: 'AI Risk',
    description: 'Model misuse, safety regressions, governance gaps, and deployment-driven AI risk.',
  },
  governance: {
    title: 'Governance',
    description: 'Regulation, enforcement, standards, court action, and institutional accountability.',
  },
  infrastructure: {
    title: 'Infrastructure',
    description: 'Cloud, telecoms, transport, public systems, and critical infrastructure risk developments.',
  },
  surveillance: {
    title: 'Surveillance',
    description: 'Biometrics, monitoring systems, identity correlation, and public/private observation systems.',
  },
} as const;

export const CATEGORY_LIST = Object.entries(CATEGORY_META).map(([slug, meta]) => ({ slug, ...meta }));
