---
title: "Inside Modern Phishing Kits Built to Steal Microsoft 365 Sessions"
description: "Huntress researchers break down how EvilTokens, Knight Office, and Kali365 capture and replay M365 tokens, plus how defenders can detect and contain them. It’s never been easier to steal credentials, thanks to a growing number of phishin…"
pubDate: 2026-11-17
draft: false
tags:
  - security
  - cloud
  - threat-intelligence
canonical: "https://zerodaydiary.com/blog/2026/11/inside-modern-phishing-kits-built-to-steal-microsoft-365-sessions/"
---

## What happened
Recent reporting highlighted inside modern phishing kits built to steal microsoft 365 sessions. It’s never been easier to steal credentials, thanks to a growing number of phishing kits that give aspiring attackers everything they need in one convenient interface. Even entry-level attackers who replay a stolen token can end up in an active session where the login and MFA are already complete, with instant access to the victim’s cloud resources and email.

## Why it matters
This matters because it has practical implications for defensive prioritisation, exposure management, or incident response rather than sitting as abstract security commentary. It also helps frame how defenders should think about attacker adaptation and recurring tradecraft rather than single incidents in isolation.

## Assessment
The strongest signal here is the tradecraft pattern and what it says about attacker adaptation, not just the single campaign or disclosure. In practice, that means cloud-adjacent control planes, shared services, and inherited trust assumptions deserve more scrutiny than many organisations currently give them.

## Recommended actions
- Review whether the issue, advisory, or attack pattern is relevant to your environment, suppliers, or exposed systems
- Patch, harden, or validate logging and monitoring coverage where applicable
- Check whether cloud services, connectors, or shared administrative paths create avoidable trust-boundary risk
- Map the observed activity to existing detections and threat-hunting hypotheses instead of tracking it only as narrative reporting

## Further reading
- [Primary source](https://www.bleepingcomputer.com/news/security/inside-modern-phishing-kits-built-to-steal-microsoft-365-sessions/)
- Source profile: Reporting
