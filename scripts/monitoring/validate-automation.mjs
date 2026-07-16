import { spawnSync } from 'node:child_process';

const checks = [
  ['monitor:priority-check', ['npm', ['run', 'monitor:priority-check']]],
  ['monitor:review fixture dry-run', ['npm', ['run', 'monitor:review', '--', '--dry-run', '--fixture=test/fixtures/monitoring/source-list.html']]],
  ['monitor:publish fixture dry-run', ['npm', ['run', 'monitor:publish', '--', '--dry-run', '--review-fixture=test/fixtures/monitoring/latest-source-review.json', '--fixture=test/fixtures/monitoring/article.html']]],
];

for (const [label, [command, args]] of checks) {
  console.log(`\n> ${label}`);
  const result = spawnSync(command, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0) process.exit(result.status || 1);
}

console.log('\nmonitor automation validation passed');
