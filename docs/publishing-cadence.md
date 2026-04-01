# ZeroDayDiary Publishing Cadence

## Default cadence

### Daily watchlist
- **Frequency:** once per day
- **Purpose:** capture the most relevant new signals in security, privacy, AI risk, and governance
- **Format:** concise roundup / watchlist entry
- **Threshold:** publish when there are 2-5 worthwhile developments or one notable cluster

### Event entries
- **Frequency:** as needed
- **Purpose:** log a discrete event with clear stakes and useful evidence
- **Format:** event-entry template
- **Threshold:** publish when facts are stable enough and the event changes the archive meaningfully

### Deeper analysis
- **Frequency:** every few days
- **Purpose:** connect patterns, policy shifts, or repeated failure modes
- **Format:** analysis piece
- **Threshold:** publish when multiple events point to the same structural issue

## Priority order
1. public-interest security events
2. privacy and surveillance changes with practical impact
3. AI deployment and governance failures
4. infrastructure / state / education / healthcare risk developments

## Decision rules
- If the signal is important but still incomplete -> publish as **watchlist**
- If the event is clear and attributable -> publish as **event entry**
- If multiple developments form a pattern -> publish as **analysis**

## Always-cover criteria

The site should default to publishing when a candidate matches any of the following, even if it comes from a newly added source or would otherwise be soft-skipped:

- **source-code leaks or accidental source exposure** involving major vendors, AI systems, critical infrastructure, or widely used developer tools
- **malware or supply-chain compromise** affecting widely used npm packages, developer libraries, package managers, CI/CD tooling, or enterprise software with broad downstream blast radius
- **industry-impacting breaches** involving major vendors, public-sector bodies, critical service providers, or incidents likely to create second-order compromise across customers or partners
- **large-scale phishing / AitM / credential theft campaigns** targeting widely used platforms, enterprise identities, or high-volume business users
- **high-confidence exploitation events** such as zero-days, active exploitation, ransomware, wipers, botnets, or major backdoors with clear operational significance

If a candidate falls into one of these buckets, the bias should be to **publish**, not to wait for a more perfect signal.

## Automated workflow rhythm

The publishing system runs on a **12-hour schedule** via GitHub Actions cron (UTC 00:17 & 12:17):

1. **Scan sources** — monitors feeds for new content matching priority categories
2. **Generate candidates** — extracts titles, descriptions, and metadata from source articles
3. **Publish qualifying posts** — auto-generates markdown and creates a PR with up to 3 posts per run
4. **Auto-merge** — once CI passes (build validation, markdown structure checks), the PR auto-merges to main
5. **Go live** — published posts appear on the site immediately after merge

**Cadence guarantee:** At minimum **1 post per 12-hour run** when candidates are available. Typically 2-3 posts per run.

## Manual editorial work (optional)

If you want to gate publishing on human review before auto-merge:
- Disable `auto-merge-enabled` in the workflow
- Review quality and fit in the open PR
- Manually merge when satisfied
- Can batch multiple runs for editorial efficiency

## Output goal
Keep the site consistently alive without turning it into a volume game.
Quality, retrieval value, and long-term archive usefulness matter more than posting frequency alone.
