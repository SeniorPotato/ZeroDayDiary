# ZeroDayDiary

ZeroDayDiary is an Astro-based editorial site for tracking and publishing concise notes about cybersecurity, privacy, AI risk, regulation, and infrastructure incidents. The repository combines a static content site with Git-based monitoring automation so candidates can be discovered, reviewed, drafted, validated, and published with a visible audit trail.

The project intentionally keeps operations inside the repository:

- source monitoring configuration lives in `data/monitoring/`
- editorial state is recorded in Markdown and JSON files
- posts are Markdown/MDX content under `src/content/blog/`
- GitHub Actions run validation and optional publication automation

## Local installation and development

Prerequisites:

- Node.js 20, matching the GitHub Actions runtime
- npm

Install dependencies and start the local Astro server:

```sh
npm ci
npm run dev
```

Common local commands:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run build` | Build the production site into `dist/` and validate Astro content. |
| `npm run preview` | Preview the built site locally after `npm run build`. |
| `npm run astro -- --help` | Run Astro CLI commands. |

Content entries live in `src/content/blog/`. Frontmatter is validated by `src/content.config.ts` and supports fields such as `title`, `description`, `pubDate`, `draft`, `tags`, `canonical`, and optional geographic metadata.

## Build and validation

Run these checks before opening or updating a pull request:

```sh
npm run monitor:priority-check
npm run build
```

`npm run monitor:priority-check` validates the publication-priority matching rules used by the monitoring automation. `npm run build` validates the Astro site and content collections.

The CI workflow also runs `npm ci` and `npm run build` for pushes to `main` and pull requests.

## Monitoring and editorial automation

ZeroDayDiary uses monitoring scripts to review configured sources, capture candidate links, and optionally create content from qualified candidates.

| Command | Effect | Notes |
| --- | --- | --- |
| `npm run monitor:review` | Fetches configured source pages, detects unseen links, writes review packets, updates state, intake, and review logs. | Network-dependent and mutates tracked monitoring files. |
| `npm run monitor:publish` | Reviews candidate links and writes qualifying posts into `src/content/blog/`. | Network-dependent and mutates tracked content. |
| `npm run monitor:review-published` | Runs the optional Anthropic editorial pass over generated posts. | Requires Anthropic configuration. |
| `npm run monitor:draft` | Creates a Markdown draft from a candidate JSON payload. | Mutates content files. |
| `npm run draft:agent` | Creates a validated post or event draft from workflow-provided inputs. | Used by manual GitHub Actions workflows. |

Supporting files:

- `data/monitoring/sources.json` defines the monitored source list.
- `data/monitoring/intake.md` records raw candidate events.
- `data/monitoring/queue.md` tracks editorial prioritisation and status.
- `data/monitoring/review-log.md` records review activity.
- `data/monitoring/review-packets/` stores timestamped discovery packets.
- `data/monitoring/state/source-review-state.json` tracks previously seen links.
- `data/monitoring/state/latest-source-review.json` records the most recent scheduled review output.

Because several monitoring commands fetch live pages and write tracked files, avoid running them casually in a dirty working tree.

## Candidate, review, draft, and publication flow

1. **Discovery** — `npm run monitor:review` scans the configured source list and writes newly detected items to review packets, intake, state, and logs.
2. **Candidate triage** — editors review candidates in `data/monitoring/intake.md` and promote useful items into `data/monitoring/queue.md` with an appropriate status.
3. **Drafting** — a draft can be created manually, through `npm run monitor:draft`, through `npm run draft:agent`, or by the scheduled candidate publisher when configured to publish qualifying candidates.
4. **Review** — drafts should be checked for attribution, uncertainty, category/tag consistency, and editorial tone. If Anthropic review is configured, generated posts can receive an additional automated editorial pass.
5. **Validation** — run `npm run monitor:priority-check` and `npm run build` before merging.
6. **Publication** — publish by merging the validated content change. Draft content should keep `draft: true`; published content should set `draft: false` or omit a draft-only workflow setting as appropriate.

The preferred editorial posture is source-first and evidence-aware: it is acceptable for a monitoring pass to produce no publishable change.

## GitHub Actions

The repository includes these workflows:

- **CI** (`.github/workflows/ci.yml`) installs dependencies and builds the site for pull requests and pushes to `main`.
- **Source Review Cadence** (`.github/workflows/source_review_schedule.yml`) runs on a schedule and by manual dispatch. It reviews sources, publishes qualifying candidates, optionally runs the Anthropic editorial review, builds the site, opens or updates a monitoring pull request, and merges that pull request after validation.
- **Agent Publish Post** (`.github/workflows/agent_publish.yml`) manually creates a validated post draft from workflow inputs and opens a pull request.
- **Agent Publish Event Draft** (`.github/workflows/agent_publish_event.yml`) manually creates a validated event draft from workflow inputs and opens a pull request.

## Required GitHub Actions variables and secrets

Do not commit secret values to the repository. Configure these in GitHub repository settings when the related automation is enabled:

| Name | Type | Used by | Purpose |
| --- | --- | --- | --- |
| `GITHUB_TOKEN` | Automatically provided secret | All workflows that create commits, branches, pull requests, or merges | Requires workflow permissions for `contents: write` and, where pull requests are created, `pull-requests: write`. |
| `ANTHROPIC_REVIEW_MODEL` | Repository variable | Source Review Cadence | Enables the automated editorial review model selection. Must be set together with `ANTHROPIC_API_KEY`. |
| `ANTHROPIC_API_KEY` | Repository secret | Source Review Cadence | Enables the Anthropic editorial review pass. Must be set together with `ANTHROPIC_REVIEW_MODEL`. |

If only one Anthropic setting is present, the scheduled workflow fails fast so the editorial review is not partially configured.

## Additional documentation

- `docs/monitoring-workflow.md` describes the discovery-to-publication workflow and status model.
- `docs/monitoring-runbook.md` provides a concise daily operating routine.
- `docs/content-ops-mode.md` documents the content operations mode.
- `docs/editorial-style-guide.md` captures editorial style expectations.
- `docs/publishing-cadence.md` explains publishing cadence guidance.
- `docs/source-map.md` maps source coverage.
- `data/monitoring/README.md` documents the monitoring queue files.
