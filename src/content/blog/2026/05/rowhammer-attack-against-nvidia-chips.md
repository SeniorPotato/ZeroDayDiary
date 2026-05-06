---
title: "Rowhammer Attack Against NVIDIA Chips"
description: "A new rowhammer attack gives complete control of NVIDIA CPUs. On Thursday, two research teams, working independently of each other, demonstrated attacks against two cards from Nvidia’s Ampere generation that take GPU rowhammering into ne…"
pubDate: 2026-05-06
draft: false
tags:
  - security
  - vulnerabilities
canonical: "https://zerodaydiary.com/blog/2026/05/rowhammer-attack-against-nvidia-chips/"
---

## What happened
The latest analysis post sets out a development that is directly relevant to security operators. On Thursday, two research teams, working independently of each other, demonstrated attacks against two cards from Nvidia’s Ampere generation that take GPU rowhammering into new—­and potentially much more consequential—­territory: GDDR bitflips that give adversaries full control of CPU memory, resulting in full system compromise of the host machine. “Our work shows that Rowhammer, which is well-studied on CPUs, is a serious threat on GPUs as well,” said Andrew Kwong, co-author of one of the papers.

## Why it matters
This matters because it has practical implications for defensive prioritisation, exposure management, or incident response rather than sitting as abstract security commentary.

## Assessment
The strongest signal here is that a vulnerability class or attack path is being treated as operationally relevant rather than background technical debt. In practice, that means operators should read this as a broader signal over noise item rather than a narrow one-off.

## Recommended actions
- Review whether the issue, advisory, or attack pattern is relevant to your environment, suppliers, or exposed systems
- Patch, harden, or validate logging and monitoring coverage where applicable
- Monitor follow-on reporting or primary-source updates for scope expansion, implementation guidance, or stronger enforcement signals

## Further reading
- [Primary source](https://www.schneier.com/blog/archives/2026/05/rowhammer-attack-against-nvidia-chips.html)
- Source profile: Analysis
