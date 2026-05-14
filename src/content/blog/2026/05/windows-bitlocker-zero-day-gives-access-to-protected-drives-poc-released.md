---
title: "Windows BitLocker zero-day gives access to protected drives, PoC released"
description: "A cybersecurity researcher has published proof-of-concept (PoC) exploits for two unpatched Microsoft Windows vulnerabilities named YellowKey and GreenPlasma, which are a BitLocker bypass and a privilege-escalation flaw."
pubDate: 2026-05-14
draft: false
tags:
  - security
  - cloud
  - vulnerabilities
  - regulation
canonical: "https://zerodaydiary.com/blog/2026/05/windows-bitlocker-zero-day-gives-access-to-protected-drives-poc-released/"
---

## What happened
Recent reporting highlighted windows bitlocker zero-day gives access to protected drives, poc released. A cybersecurity researcher has published proof-of-concept (PoC) exploits for two unpatched Microsoft Windows vulnerabilities named YellowKey and GreenPlasma, which are a BitLocker bypass and a privilege-escalation flaw. The latest exploits follow the researcher's previous disclosure of the BlueHammer (CVE-2026-33825) and RedSun (no identifier) local privilege escalation (LPE) as zero-day flaws, both of which began to be exploited in the wild shortly after being publicly disclosed.

## Why it matters
This matters because it has practical implications for defensive prioritisation, exposure management, or incident response rather than sitting as abstract security commentary. It is a direct signal about how compliance and policy expectations are being translated into implementation work.

## Assessment
The strongest signal here is that a vulnerability class or attack path is being treated as operationally relevant rather than background technical debt. In practice, that means cloud-adjacent control planes, shared services, and inherited trust assumptions deserve more scrutiny than many organisations currently give them.

## Recommended actions
- Review whether the issue, advisory, or attack pattern is relevant to your environment, suppliers, or exposed systems
- Patch, harden, or validate logging and monitoring coverage where applicable
- Check whether cloud services, connectors, or shared administrative paths create avoidable trust-boundary risk
- Translate the development into specific ownership, policy, and evidence requirements instead of leaving it as background policy tracking

## Further reading
- [Primary source](https://www.bleepingcomputer.com/news/security/windows-bitlocker-zero-day-gives-access-to-protected-drives-poc-released/)
- Source profile: Reporting
