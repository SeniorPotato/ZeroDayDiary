# ZeroDayDiary Monitoring Workflow

## Objective
Create a repeatable, low-maintenance system for discovering, triaging, drafting, and publishing globally relevant security, privacy, and AI risk events.

## Principles
- No inbox-style email operations.
- No reader PII capture.
- Source-first, evidence-aware publication.
- Draft before publish when confidence is incomplete.
- Prefer durable archive quality over speed theater.

## System components
- `data/monitoring/sources.json` — structured source registry for scheduled review
- `scripts/monitoring/review-sources.mjs` — fetches configured source pages, detects unseen links, creates review packets, updates intake, and logs the pass
- `data/monitoring/review-packets/` — timestamped packets of newly detected candidate links for editorial triage
- `data/monitoring/state/source-review-state.json` — remembers seen links to avoid repeat candidate spam
- `scripts/monitoring/create-draft-from-candidate.mjs` — turns a reviewed candidate JSON file into a Markdown draft in the site content tree
- `data/monitoring/candidate-template.json` — example payload for the draft generator

## Workflow stages

### 1. Discovery
Inputs:
- official alerts and regulator updates
- trusted specialist reporting
- search / RSS / manual web monitoring
- public disclosures and incident notices

Output:
- candidate event added to `data/monitoring/intake.md`

### 2. Triage
Questions:
- Is this globally relevant or a useful local signal?
- Is there a primary source or at least a strong secondary source?
- Which primary category fits best?
- Is this an event entry, watchlist note, or analysis piece?

Output:
- event moved to `queue.md` with status

### 3. Classification
Assign:
- one primary category
- 2-4 supporting tags
- confidence level: high / medium / low
- content type: event / watchlist / analysis

### 4. Drafting
Create a Markdown draft using the event-entry template.
Drafts should answer:
- what happened
- why it matters
- who is affected
- what to watch next

### 5. Review gate
Check:
- title and standfirst accuracy
- claims attributable
- no hype language
- taxonomy consistent
- uncertainty explicitly stated

### 6. Publish
- merge through Git workflow
- archive becomes searchable via category + search pages

## Status model
- DISCOVERED
- TRIAGED
- DRAFTING
- REVIEW
- PUBLISHED
- HOLD
- REJECTED

## Cadence
Recommended:
- scheduled source review task every 4 hours
- structured roundup: daily or every 48 hours
- deeper analysis: only when there is a meaningful pattern or policy shift

## Review logging
- record each manual or scheduled review pass in `data/monitoring/review-log.md`
- mark whether the pass produced a candidate, draft, publication, or no publishable change
- prefer "no publishable change" over rushed low-confidence posting
