---
title: "New phishing kits target Microsoft 365 accounts, evade MFA"
description: "Two new phishing kits, Jalisco and OmegaLord, have been discovered in attacks targeting Microsoft 365 accounts, using techniques that defeat multi-factor authentication (MFA)."
pubDate: 2026-07-14
draft: false
tags:
  - security
  - threat-intelligence
canonical: "https://zerodaydiary.com/blog/2026/07/new-phishing-kits-target-microsoft-365-accounts-evade-mfa/"
---

## What happened
Recent reporting highlighted new phishing kits target microsoft 365 accounts, evade mfa. Two new phishing kits, Jalisco and OmegaLord, have been discovered in attacks targeting Microsoft 365 accounts, using techniques that defeat multi-factor authentication (MFA). While Jalisco uses the device-code phishing method, OmegaLord masquerades as a PDF reader to collect account login credentials and associated phone numbers, which could help the attacker intercept or hijack MFA requests or codes.

## Why it matters
This matters because it has practical implications for defensive prioritisation, exposure management, or incident response rather than sitting as abstract security commentary. It also helps frame how defenders should think about attacker adaptation and recurring tradecraft rather than single incidents in isolation.

## Assessment
The strongest signal here is the tradecraft pattern and what it says about attacker adaptation, not just the single campaign or disclosure. In practice, that means operators should read this as a broader signal over noise item rather than a narrow one-off.

## Recommended actions
- Review whether the issue, advisory, or attack pattern is relevant to your environment, suppliers, or exposed systems
- Patch, harden, or validate logging and monitoring coverage where applicable
- Map the observed activity to existing detections and threat-hunting hypotheses instead of tracking it only as narrative reporting
- Monitor follow-on reporting or primary-source updates for scope expansion, implementation guidance, or stronger enforcement signals

## Further reading
- [Primary source](https://www.bleepingcomputer.com/news/security/new-phishing-kits-target-microsoft-365-accounts-evade-mfa/)
- Source profile: Reporting
