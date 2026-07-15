# ZeroDayDiary

ZeroDayDiary is an Astro content site for short, sourced notes on security, privacy, governance, AI-risk, infrastructure, and surveillance developments. The repository also contains monitoring automation that discovers candidate links from trusted sources, records review packets, and can turn reviewed candidates into posts.

## Local setup

```sh
npm install
npm run dev
```

The development server runs at `http://localhost:4321`. Production output is generated in `dist/`.

## Validation and build commands

| Command | Purpose |
| --- | --- |
| `npm run build` | Build the Astro site and validate content collections. |
| `npm run monitor:priority-check` | Check monitoring priority rules against the sample set. |
| `npm run monitor:validate` | Run fixture-based monitoring validation, dry-run review/publish checks, and priority checks. |
| `npm run validate` | Single validation entry point for automation validation plus the site build. |

CI runs `npm run validate` so monitoring logic and the site build are checked together.

## Content layout

- `src/content/blog/` contains published Markdown and MDX posts, grouped by year and month.
- `src/content.config.ts` defines content schema expectations.
- `docs/` contains runbooks and editorial guidance for operators.
- `data/monitoring/` contains source configuration, review queues, review packets, and monitoring state.

## Monitoring and editorial automation

The monitoring pipeline is intentionally split into discovery, review, draft, and publication steps:

1. `npm run monitor:review` fetches configured sources from `data/monitoring/sources.json`, finds unseen candidate links, writes a review packet, and updates monitoring state.
2. Review packets in `data/monitoring/review-packets/` and queue/intake files support human review before publication.
3. `npm run monitor:draft` can create a draft from a selected candidate.
4. `npm run monitor:publish` can publish eligible candidates from the latest source review state.
5. `npm run monitor:review-published` can run the optional editorial review pass for published posts when the Anthropic review configuration is available.

### Safe dry-run modes

Use dry-run mode before running mutating monitoring scripts locally:

```sh
npm run monitor:review -- --dry-run
npm run monitor:publish -- --dry-run
```

Both commands also accept local HTML fixtures for deterministic validation without live network access:

```sh
npm run monitor:review -- --dry-run --fixture test/fixtures/monitoring/source-list.html
npm run monitor:publish -- --dry-run --fixture test/fixtures/monitoring/article.html
```

Dry-run review reports the packet and candidate count without writing monitoring state, intake, review-log, or packet files. Dry-run publish evaluates candidates and validates generated Markdown without writing posts.

## GitHub Actions configuration

Required repository permissions and credentials are configured in GitHub, not committed to this repository.

- `GITHUB_TOKEN` is provided by GitHub Actions and is used by workflows that create commits or pull requests.
- `ANTHROPIC_API_KEY` enables optional editorial review automation.
- `ANTHROPIC_REVIEW_MODEL` selects the optional editorial review model.

Do not commit secret values. Document only variable names and expected behavior.

## Candidate-to-publication flow

1. Source definitions in `data/monitoring/sources.json` determine which trusted pages are scanned.
2. Source review produces candidate metadata in `data/monitoring/state/latest-source-review.json` and a human-readable packet under `data/monitoring/review-packets/`.
3. Operators review candidate relevance and quality.
4. Draft or publish scripts generate Markdown using shared validation checks.
5. The Astro build validates the resulting content before deployment.

## Operational guidance

- Prefer `npm run validate` before opening a pull request.
- Use `--dry-run` for local monitoring checks unless you intend to update tracked state or content.
- Keep generated monitoring state and published content changes easy to review in pull requests.
- See `docs/monitoring-workflow.md`, `docs/monitoring-runbook.md`, and `data/monitoring/README.md` for deeper operational details.
