const samples = [
  'Claude Code source leaked via npm packaging error',
  'Axios supply chain attack pushes cross-platform RAT via compromised npm account',
  'Cisco source code stolen in Trivy-linked dev environment breach',
  'Large-scale phishing campaign steals Microsoft 365 credentials',
  'Routine webinar on compliance trends'
];

const PRIORITY_REGEX = /source code|source leak|code leak|npm|package compromise|supply chain|malware|trojan|rat\b|remote access trojan|phishing|aitm|adversary-in-the-middle|data breach|breach|exfiltrat|stolen credentials|credential theft|zero-day|actively exploited|ransomware|wiper|botnet|backdoor/i;

const expected = [true, true, true, true, false];
const actual = samples.map((text) => PRIORITY_REGEX.test(text));

const failed = actual.some((value, index) => value !== expected[index]);
if (failed) {
  console.error('publish-priority-check failed');
  samples.forEach((sample, index) => {
    console.error(`- ${sample} => expected ${expected[index]}, got ${actual[index]}`);
  });
  process.exit(1);
}

console.log('publish-priority-check passed');
