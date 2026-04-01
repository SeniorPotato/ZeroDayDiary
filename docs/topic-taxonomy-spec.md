# ZeroDayDiary — Topic Taxonomy & Editorial Scoring Spec

**Version:** 1.1.0  
**Last updated:** 2026-04-01  
**Companion file:** `config/topic-taxonomy.yml`

---

## Purpose

This document defines a practical editorial taxonomy for ZeroDayDiary's 12-hour publishing workflow. It is designed to improve ranking and consistency without making the live pipeline brittle.

This spec is intentionally tuned to the current site:
- strong bias toward high-consequence security events
- support for privacy, governance, and AI risk coverage
- no requirement to invent filler during quiet cycles
- no assumption that taxonomy alone adds new ingestion sources

---

## How this should be used

The taxonomy should be treated as an **editorial scoring layer**, not as a magical automation layer.

It helps with:
1. ranking candidates
2. deciding publish bias
3. warning when coverage is drifting
4. documenting what the site considers important

It does **not** by itself:
- add new monitored sources
- guarantee extraction succeeds
- force a post when the underlying source material is weak

---

## Core editorial principle

ZeroDayDiary should bias toward publishing events that have clear operational consequences, broad downstream blast radius, or lasting public-interest significance.

That means the site should strongly prefer covering:
- source code leaks and source exposure involving major vendors or widely used tools
- malware or supply-chain compromise affecting widely used npm packages, developer libraries, or enterprise software
- major breaches, especially where they imply second-order compromise across customers or partners
- large-scale phishing, credential theft, and AiTM campaigns
- active exploitation, zero-days, ransomware, wipers, and major backdoors

Quiet cycles are acceptable. Low-value filler is not.

---

## Tier model

### Tier 1 — Publish Priority
These should usually publish in the current 12-hour cycle if the story is real and extraction quality is good.

Included here:
- supply-chain compromise
- actively exploited vulnerability
- major breach or high-consequence compromise
- ransomware / destructive malware
- AI deployment or model security failure
- large-scale phishing / credential theft
- major regulatory enforcement action

### Tier 2 — Strong cycle coverage
These matter, but can tolerate slightly more editorial judgment.

Included here:
- privacy regulatory developments
- cloud and infrastructure misconfiguration
- developer tooling and IDE security
- similar stories with clear but less urgent consequences

### Tier 3 — Context and enrichment
These are useful for pattern building, but should not crowd out stronger event coverage.

Included here:
- standards updates
- framework revisions
- slower-burn governance or policy material

---

## Why this version is better than a rigid gate system

The earlier draft was smart, but too clean and too strict for the live site.

This amended version removes the biggest failure modes:

### No hard requirement for two Tier-1 items every cycle
That sounds disciplined on paper, but in practice it creates brittleness and encourages weak filler on quiet days.

### No per-cycle requirement to hit all core categories
Security will naturally dominate some cycles. That is fine. Category balance should be measured over rolling windows, not forced every 12 hours.

### Warnings instead of false precision
The taxonomy should warn when the site is drifting away from major themes, not hard-stop publication for lack of a perfect category mix.

---

## Publish bias model

Each topic has a `publish_bias` value:

- `auto` — strong default to publish if extraction quality is acceptable
- `review` — likely important, but should tolerate more editorial filtering
- `hold` — useful for context, but not a default event-entry trigger

This is more useful than pretending a single numeric threshold can perfectly encode importance.

---

## Scoring guidance

Scoring is still useful, but should remain advisory.

It should combine:
- tier weight
- source credibility
- recency
- novelty
- topic boost

Recommended thresholds:
- **75+** → likely auto-publish if extraction is clean
- **55–74** → queue / review
- **below 55** → usually hold unless editorially exceptional

Scores should help rank decisions, not replace them.

---

## Guardrails

Guards should be warnings and escalation prompts, not rigid blockers.

Useful warnings include:
- no high-impact security event covered in the last 24h
- no AI-risk / AI-governance item covered in the last 48h

These are editorial signals, not reasons to force bad posts.

---

## Important implementation note

`source_hints` are editorial hints only.

If a domain is listed here but not present in the actual monitored-source configuration, the live pipeline will not automatically ingest it. Source registration, extraction quality, and taxonomy should be treated as three separate layers.

---

## Recommended next implementation steps

1. keep this taxonomy in the repo as the editorial source of truth
2. use it to refine ranking and publish bias
3. gradually map current monitored sources to topic clusters
4. add lightweight tests so high-impact patterns do not get silently deprioritized later

---

## Bottom line

This amended taxonomy is meant to fit the real ZeroDayDiary workflow:
- opinionated enough to improve coverage
- flexible enough not to break on noisy inputs
- biased toward consequential security stories
- resistant to filler and false precision
