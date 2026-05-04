---
title: "Microsoft Defender wrongly flags DigiCert certs as Trojan:Win32/Cerdigent.A!dha"
description: "Microsoft Defender is detecting legitimate DigiCert root certificates as Trojan:Win32/Cerdigent.A!dha, resulting in widespread false-positive alerts, and in some cases, removing certificates from Windows. Update: Added Microsoft's statem…"
pubDate: 2026-05-04
draft: false
tags:
  - security
  - threat-intelligence
canonical: "https://zerodaydiary.com/blog/2026/05/microsoft-defender-wrongly-flags-digicert-certs-as-trojan-win32-cerdigent-a-dha/"
---

## What happened
Recent reporting highlighted microsoft defender wrongly flags digicert certs as trojan:win32/cerdigent.a!dha. Update: Added Microsoft's statement to the end of the first section of this article. Microsoft Defender is detecting legitimate DigiCert root certificates as Trojan:Win32/Cerdigent.A!dha, resulting in widespread false-positive alerts, and in some cases, removing certificates from Windows.

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
- [Primary source](https://www.bleepingcomputer.com/news/security/microsoft-defender-wrongly-flags-digicert-certs-as-trojan-win32-cerdigentadha/)
- Source profile: Reporting
