---
title: "Tycoon2FA hijacks Microsoft 365 accounts via device-code phishing"
description: "The Tycoon2FA phishing kit now supports device-code phishing attacks and abuses Trustifi click-tracking URLs to hijack Microsoft 365 accounts."
pubDate: 2026-05-18
draft: false
tags:
  - security
  - cloud
  - regulation
  - threat-intelligence
canonical: "https://zerodaydiary.com/blog/2026/05/tycoon2fa-hijacks-microsoft-365-accounts-via-device-code-phishing/"
---

## What happened
Recent reporting highlighted tycoon2fa hijacks microsoft 365 accounts via device-code phishing. The Tycoon2FA phishing kit now supports device-code phishing attacks and abuses Trustifi click-tracking URLs to hijack Microsoft 365 accounts. Despite an international law enforcement operation disrupting the Tycoon2FA phishing platform in March, the malicious operation was rebuilt on new infrastructure and quickly returned to regular activity levels.

## Why it matters
This matters because it has practical implications for defensive prioritisation, exposure management, or incident response rather than sitting as abstract security commentary. It is a direct signal about how compliance and policy expectations are being translated into implementation work.

## Assessment
The strongest signal here is the tradecraft pattern and what it says about attacker adaptation, not just the single campaign or disclosure. In practice, that means cloud-adjacent control planes, shared services, and inherited trust assumptions deserve more scrutiny than many organisations currently give them.

## Recommended actions
- Review whether the issue, advisory, or attack pattern is relevant to your environment, suppliers, or exposed systems
- Patch, harden, or validate logging and monitoring coverage where applicable
- Check whether cloud services, connectors, or shared administrative paths create avoidable trust-boundary risk
- Translate the development into specific ownership, policy, and evidence requirements instead of leaving it as background policy tracking

## Further reading
- [Primary source](https://www.bleepingcomputer.com/news/security/tycoon2fa-hijacks-microsoft-365-accounts-via-device-code-phishing/)
- Source profile: Reporting
