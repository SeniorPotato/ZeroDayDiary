# ZeroDayDiary

ZeroDayDiary is an Astro-powered editorial site for short, source-backed posts about security, privacy, AI risk, governance, and infrastructure incidents. The repository combines normal static-site content with monitoring automation that reviews trusted sources, records candidate items, and can optionally promote selected candidates into published posts.

## Local setup

```sh
npm ci
npm run dev
```

The development server runs at `http://localhost:4321` by default. Content lives under `src/content/blog/` and is validated by the Astro content schema during the build.

## Build and validation

| Command | Purpose | Notes |
| --- | --- | --- |
| `npm run dev` | Start the local Astro development server. | Read-only. |
| `npm run build` | Build and validate the production site. | Required before publishing changes. |
| `npm run preview` | Preview the built site locally. | Run after `npm run build`. |
| `npm run monitor:priority-check` | Validate monitoring publish-priority patterns. | Read-only safety check. |
| `npm run monitor:review` | Fetch configured sources and update monitoring state, intake, review logs, and review packets. | Network-dependent and mutates tracked files. |
| `npm run monitor:publish` | Promote qualifying candidates from the latest source review into blog posts. | Network-dependent and mutates content. Defaults to zero forced posts; set `MONITOR_PUBLISH_MINIMUM=1` only when a minimum publication quota is intentionally required. |
| `npm run monitor:review-published` | Run the optional Anthropic editorial review over generated posts. | Requires Anthropic configuration. |
| `npm run monitor:draft` | Create a draft post from a monitoring candidate. | Mutates content. |
| `npm run draft:agent` | Create a draft from GitHub Actions inputs. | Used by manual agent workflows. |

## Monitoring and editorial automation

The monitoring system is intentionally review-first:

1. `npm run monitor:review` reads `data/monitoring/sources.json`, fetches source pages, detects new links, and writes review artifacts under `data/monitoring/`.
2. Review artifacts feed the candidate queue and latest review state in `data/monitoring/state/latest-source-review.json`.
3. Scheduled GitHub Actions runs perform discovery and validation, then open or update a monitoring pull request.
4. Publishing is no longer part of the scheduled cadence by default. A maintainer must manually dispatch the scheduled workflow with `publish_candidates` enabled, or run `npm run monitor:publish`, to promote qualifying candidates into posts.
5. If automatic publishing is explicitly enabled and Anthropic variables are configured, `npm run monitor:review-published` performs the editorial pass before the site build completes.

This prevents the scheduled cadence from publishing weak or only loosely relevant posts simply to satisfy a posting quota.

## Candidate, review, draft, and publication flow

- **Sources:** `data/monitoring/sources.json` defines monitored source pages.
- **Candidates:** `scripts/monitoring/review-sources.mjs` records newly discovered links in monitoring state and review packets.
- **Review packets:** `data/monitoring/review-packets/` contains generated snapshots for maintainer review.
- **Drafts:** `scripts/create-agent-draft.mjs` and `scripts/monitoring/create-draft-from-candidate.mjs` create draft content when a maintainer or workflow chooses to develop a candidate.
- **Publication:** `scripts/monitoring/publish-candidates.mjs` can write published posts under `src/content/blog/YYYY/MM/`, but it now defaults to publishing only candidates that pass the normal hard and soft skip rules. It does not force at least one post unless `MONITOR_PUBLISH_MINIMUM` is set above `0`.
- **Editorial review:** `scripts/monitoring/review-published-posts.mjs` can use Anthropic to review generated posts when both required Anthropic settings are present.

## GitHub Actions

| Workflow | Purpose |
| --- | --- |
| `.github/workflows/ci.yml` | Builds the site and runs monitoring priority validation on pull requests and pushes. |
| `.github/workflows/source_review_schedule.yml` | Runs scheduled source discovery every 12 hours. Scheduled runs do not publish posts by default. Manual dispatch can opt into candidate publication with the `publish_candidates` input. |
| `.github/workflows/agent_publish.yml` | Creates a draft post from manual workflow inputs. |
| `.github/workflows/agent_publish_event.yml` | Creates a draft event post from manual workflow inputs. |

## Required variables and secrets

Do not commit secret values. Configure them in GitHub Actions settings only.

| Name | Type | Required for | Notes |
| --- | --- | --- | --- |
| `GITHUB_TOKEN` | Built-in secret | Workflow commits, pull requests, and merges. | Provided by GitHub Actions; workflow permissions must allow content and pull-request writes. |
| `ANTHROPIC_API_KEY` | Secret | Optional editorial review. | Required only when the Anthropic editorial pass is enabled. |
| `ANTHROPIC_REVIEW_MODEL` | Variable | Optional editorial review. | Must be set together with `ANTHROPIC_API_KEY`; expected to be a Claude model or `anthropic/*` alias. |

## Operational notes

- Treat monitoring scripts as production automation: several fetch live pages and mutate tracked state or content.
- Prefer `npm run monitor:priority-check` and `npm run build` for safe local validation.
- Review generated monitoring changes before merging, especially changes under `data/monitoring/` and `src/content/blog/`.
- See `docs/monitoring-workflow.md`, `docs/monitoring-runbook.md`, and `data/monitoring/README.md` for deeper operational context.
