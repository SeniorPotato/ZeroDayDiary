# ZeroDayDiary

ZeroDayDiary is an Astro-powered public journal for durable coverage of security incidents, privacy and surveillance changes, platform governance developments, infrastructure risk, and AI risk events. The project is intentionally lightweight: content lives in Git, editorial state is stored as Markdown/JSON, and automation is limited to source monitoring, candidate triage, draft generation, validation, and pull-request creation.

The editorial goal is to capture useful signal without creating filler. If a candidate does not improve the archive, it should stay in review rather than become a post.

## Project structure

| Path | Purpose |
| --- | --- |
| `src/content/blog/` | Published and draft blog entries rendered by Astro content collections. |
| `src/content.config.ts` | Content schema for blog frontmatter validation. |
| `src/pages/` | Astro routes for the site, RSS, search, and category pages. |
| `src/components/` | Reusable Astro UI components. |
| `src/layouts/` | Page and post layouts. |
| `data/monitoring/` | Git-backed monitoring workspace: intake, queue, review log, candidate templates, source state, and review packets. |
| `data/monitoring/sources.json` | Source registry used by scheduled monitoring. |
| `scripts/monitoring/` | Monitoring, candidate publishing, draft, and editorial review scripts. |
| `scripts/create-agent-draft.mjs` | Shared workflow entry point for agent-created post and event drafts. |
| `.github/workflows/` | CI, scheduled source review, and manual agent draft workflows. |
| `docs/` | Detailed editorial and monitoring runbooks. |

## Local setup

Install Node.js 20, then install dependencies from the repository root:

```sh
npm ci
```

Start the local Astro development server:

```sh
npm run dev
```

Preview a production build locally after building:

```sh
npm run build
npm run preview
```

## Build and validation commands

| Command | Purpose | Notes |
| --- | --- | --- |
| `npm run dev` | Start the local development server. | Read-only for content/state unless you edit files manually. |
| `npm run build` | Build the static Astro site. | Main validation command used by CI and automation workflows. |
| `npm run preview` | Serve the built `dist/` output locally. | Run after `npm run build`. |
| `npm run monitor:priority-check` | Validate publication-priority matching rules. | Lightweight script check for monitoring policy logic. |
| `npm run monitor:review` | Fetch monitored sources and update monitoring state. | Network-dependent and mutates files under `data/monitoring/`. Do not run casually. |
| `npm run monitor:publish` | Turn qualifying monitoring candidates into blog posts. | Network-dependent and mutates `src/content/blog/`. Use intentionally. |
| `npm run monitor:review-published` | Run the optional editorial review pass on generated posts. | Requires Anthropic configuration. |
| `npm run monitor:draft` | Create a draft from a candidate JSON payload. | Mutates `src/content/blog/`. |
| `npm run draft:agent` | Generate a validated post/event draft from workflow environment inputs. | Intended for GitHub Actions workflows. |

For routine local checks, run:

```sh
npm run monitor:priority-check
npm run build
```

## Content model

Posts are Markdown/MDX entries in `src/content/blog/`. Frontmatter is validated through Astro content collections, so build failures should be treated as content validation failures as well as site failures.

The editorial model favors:

- calm, attributable summaries;
- one core event or pattern per post;
- explicit uncertainty when facts are still developing;
- links to primary sources where possible;
- archive value over publication volume.

See `docs/editorial-style-guide.md` for tone, taxonomy, and post-structure guidance.

## Monitoring and editorial automation

ZeroDayDiary uses Git-backed automation rather than email inboxes or external editorial databases.

### Scheduled source review

`.github/workflows/source_review_schedule.yml` runs on a 12-hour cron and can also be started manually. It installs dependencies, runs the monitoring review, publishes qualifying candidates, optionally runs the Anthropic editorial review pass, builds the site, commits changes to an automation branch, opens or updates a pull request, and merges the generated pull request after validation.

Important implementation files:

- `scripts/monitoring/review-sources.mjs` fetches configured source pages, detects unseen links, updates state, and writes review packets.
- `scripts/monitoring/publish-candidates.mjs` evaluates candidates and can create posts from qualifying source material.
- `scripts/monitoring/review-published-posts.mjs` performs the optional Anthropic editorial review pass.
- `.github/source-review-pr-body.md` contains the scheduled review pull-request body.

Because this workflow can mutate monitoring state and published content, treat local runs of the underlying scripts as production-affecting operations unless you are intentionally testing a change.

### Manual agent draft workflows

Two workflow-dispatch actions support draft creation through pull requests:

- `.github/workflows/agent_publish.yml` creates a general post draft.
- `.github/workflows/agent_publish_event.yml` creates an event draft with structured sections.

Both workflows call `npm run draft:agent`, validate the generated Markdown, run the Astro build, and open a pull request with the draft.

## Candidate, review, draft, and publication flow

1. **Source discovery** — `data/monitoring/sources.json` lists the official and specialist sources that scheduled review checks.
2. **Review packet generation** — `npm run monitor:review` records newly seen links in timestamped files under `data/monitoring/review-packets/`, updates `data/monitoring/state/`, and appends monitoring notes.
3. **Intake and queue review** — candidate events are tracked in `data/monitoring/intake.md` and can be promoted into `data/monitoring/queue.md` for editorial work.
4. **Draft creation** — drafts may be created manually, by `npm run monitor:draft`, by `npm run draft:agent` in workflow-dispatch jobs, or by `npm run monitor:publish` for qualifying monitored candidates.
5. **Editorial review** — reviewers check source quality, headline accuracy, frontmatter, section structure, uncertainty, and fit with the editorial style guide. The optional Anthropic pass can add another automated review layer for generated posts.
6. **Publication** — merged Markdown entries in `src/content/blog/` are rendered by Astro and validated by `npm run build`.

Detailed runbooks live in:

- `docs/monitoring-workflow.md`
- `docs/monitoring-runbook.md`
- `docs/content-ops-mode.md`
- `docs/editorial-style-guide.md`
- `docs/publishing-cadence.md`
- `data/monitoring/README.md`

## GitHub Actions configuration

The workflows use the repository-provided `GITHUB_TOKEN` for checkout, branch pushes, pull-request creation, and scheduled automation merges. No value needs to be stored manually for `GITHUB_TOKEN`, but repository permissions and branch-protection settings must allow the intended workflow behavior.

Optional Anthropic editorial review requires both of these to be configured together:

| Name | Type | Used by | Purpose |
| --- | --- | --- | --- |
| `ANTHROPIC_REVIEW_MODEL` | Repository variable | `source_review_schedule.yml` | Names the Claude model or `anthropic/*` alias used for generated-post review. |
| `ANTHROPIC_API_KEY` | Repository secret | `source_review_schedule.yml` | Authenticates the editorial review script. Keep secret; never commit the value. |

If either Anthropic value is set without the other, the scheduled workflow fails fast so review configuration does not silently drift.

## Operating guidance

- Prefer `npm run monitor:priority-check` and `npm run build` for safe validation.
- Do not run monitoring publish scripts casually; they are designed to change tracked state and content.
- Keep source changes small and reviewable, especially in `.github/workflows/`, `scripts/monitoring/`, and `data/monitoring/state/`.
- Use the root README as the quick map, then follow the detailed runbooks in `docs/` for editorial decisions.
