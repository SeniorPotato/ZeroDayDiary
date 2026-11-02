---
title: "Ivanti patches two more Connect Secure zero-days chained in attacks"
description: "Ivanti released security updates to patch two more Connect Secure (ICS) remote access gateway flaws that have been chained in zero-day attacks since at least October 1."
pubDate: 2026-11-02
draft: false
tags:
  - security
  - cloud
  - vulnerabilities
  - network-edge
canonical: "https://zerodaydiary.com/blog/2026/11/ivanti-patches-two-more-connect-secure-zero-days-chained-in-attacks/"
---

## What happened
Recent reporting highlighted ivanti patches two more connect secure zero-days chained in attacks. Ivanti released security updates to patch two more Connect Secure (ICS) remote access gateway flaws that have been chained in zero-day attacks since at least October 1. Threat actors exploited these two flaws (tracked as CVE-2026-111357 and CVE-2026-118527) alongside an authentication bypass vulnerability (CVE-2026-104935), which Ivanti patched last month to remove the main attack surface.

## Why it matters
This matters because it has practical implications for defensive prioritisation, exposure management, or incident response rather than sitting as abstract security commentary.

## Assessment
The strongest signal here is that a vulnerability class or attack path is being treated as operationally relevant rather than background technical debt. In practice, that means cloud-adjacent control planes, shared services, and inherited trust assumptions deserve more scrutiny than many organisations currently give them.

## Recommended actions
- Review whether the issue, advisory, or attack pattern is relevant to your environment, suppliers, or exposed systems
- Patch, harden, or validate logging and monitoring coverage where applicable
- Check whether cloud services, connectors, or shared administrative paths create avoidable trust-boundary risk
- Monitor follow-on reporting or primary-source updates for scope expansion, implementation guidance, or stronger enforcement signals

## Further reading
- [Primary source](https://www.bleepingcomputer.com/news/security/ivanti-patches-two-more-connect-secure-zero-days-chained-in-attacks/)
- Source profile: Reporting
