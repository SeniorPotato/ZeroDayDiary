---
title: "GlassWorm ForceMemo campaign shows how stolen GitHub tokens can silently poison Python repos"
description: "Researchers say a GlassWorm-linked campaign used stolen GitHub tokens to force-push obfuscated malware into Python repositories, turning account takeover into a stealthy software supply-chain distribution channel."
pubDate: 2026-03-17
draft: false
tags:
  - security
  - supply-chain
  - github
  - threat-intelligence
canonical: "https://zerodaydiary.com/blog/2026/03/glassworm-forcememo-campaign-shows-how-stolen-github-tokens-can-silently-poison-python-repos/"
---

## What happened
Researchers say a GlassWorm-linked malware campaign is being used to compromise developer accounts, steal GitHub tokens, and then force-push malicious changes into Python repositories. According to reporting that cites StepSecurity, the attackers rebased legitimate repository history with obfuscated malware appended to common Python entry points such as `setup.py`, `main.py`, and `app.py`, while preserving the original commit message, author, and author date.

That matters because it shifts the attack from simple account theft into a harder-to-detect supply-chain distribution model. Instead of relying on a visible malicious pull request or obviously suspicious commit trail, the attacker can rewrite history on the default branch and leave downstream users to discover compromise only after cloning, installing, or executing poisoned code.

## Why it matters
This is a stronger signal than a routine repository compromise story because the technique attacks trust in the developer workflow itself. If a force-push can preserve the appearance of legitimate commit history while silently appending payloads to widely used files, defenders cannot rely only on casual review of GitHub UI history to spot tampering.

The campaign also shows how compromise can move across layers: malicious editor extensions and developer endpoint theft feed credential theft, stolen GitHub tokens enable repository takeover, and repository poisoning creates a path into package installation, cloned application code, and downstream build pipelines. That is a durable software-supply-chain lesson rather than a one-off campaign detail.

## Assessment
The most important part of this story is not the malware family name. It is the operational pattern: attacker access to developer credentials can now be converted into stealth repository rewrites that preserve enough visible legitimacy to delay detection. That makes GitHub token hygiene, branch protection, and force-push controls more strategically important than teams often treat them.

For ZeroDayDiary, this is worth publishing because it captures a concrete evolution in supply-chain tradecraft. The blend of stolen developer tokens, force-push history rewriting, and payload staging through external infrastructure is exactly the kind of signal-over-noise pattern that should stay in the archive.

## Further reading
- [The Hacker News report on the GlassWorm / ForceMemo GitHub repo compromises](https://thehackernews.com/2026/03/glassworm-attack-uses-stolen-github.html)
- [StepSecurity research on ForceMemo and compromised GitHub Python repos](https://www.stepsecurity.io/blog/forcememo-hundreds-of-github-python-repos-compromised-via-account-takeover-and-force-push)
