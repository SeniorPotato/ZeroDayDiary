---
title: "'Ghostcommit' hides prompt injection in images to fool AI agents, steal secrets"
description: "A PNG hiding a prompt injection could steal your repo's secrets, researchers demonstrate. The technique, dubbed 'Ghostcommit,' slipped past AI code reviewers CodeRabbit and Bugbot, which never open image files at all, then convinced a co…"
pubDate: 2026-07-11
draft: false
tags:
  - ai-risk
canonical: "https://zerodaydiary.com/blog/2026/07/ghostcommit-hides-prompt-injection-in-images-to-fool-ai-agents-steal-secrets/"
---

## What happened
Recent reporting highlighted 'ghostcommit' hides prompt injection in images to fool ai agents, steal secrets. Researchers have built a pull request that steals a repository's secrets by hiding the malicious instruction inside a PNG that AI code reviewers never open. The reviewer waves the change through.

## Why it matters
This matters because AI-related risk increasingly shows up through deployment choices, interfaces, and governance gaps rather than model headlines alone.

## Assessment
The strongest signal here is not just the headline event, but the wider pattern it points to. In practice, that means operators should read this as a broader signal over noise item rather than a narrow one-off.

## Recommended actions
- Monitor follow-on reporting or primary-source updates for scope expansion, implementation guidance, or stronger enforcement signals

## Further reading
- [Primary source](https://www.bleepingcomputer.com/news/security/ghostcommit-hides-prompt-injection-in-images-to-fool-ai-agents-steal-secrets/)
- Source profile: Reporting
