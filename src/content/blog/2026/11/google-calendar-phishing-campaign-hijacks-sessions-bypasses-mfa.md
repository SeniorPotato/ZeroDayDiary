---
title: "Google Calendar phishing campaign hijacks sessions, bypasses MFA"
description: "A phishing campaign used Google Calendar invites, trusted redirects, and fake login pages to hijack corporate Google sessions and bypass MFA protections. Material Security examines how Operation CloudFire tracked the attacks, blocked mal…"
pubDate: 2026-11-05
draft: false
tags:
  - security
  - cloud
  - threat-intelligence
canonical: "https://zerodaydiary.com/blog/2026/11/google-calendar-phishing-campaign-hijacks-sessions-bypasses-mfa/"
---

## What happened
Recent reporting highlighted google calendar phishing campaign hijacks sessions, bypasses mfa. Since mid-August 2026, a phishing operation has been harvesting live Google sessions from corporate users. Material Security’s Threat Research team identified the campaign and has taken down hundreds of domains used by attackers in what they have dubbed Operation CloudFire.

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
- [Primary source](https://www.bleepingcomputer.com/news/security/google-calendar-phishing-campaign-hijacks-sessions-bypasses-mfa/)
- Source profile: Reporting
