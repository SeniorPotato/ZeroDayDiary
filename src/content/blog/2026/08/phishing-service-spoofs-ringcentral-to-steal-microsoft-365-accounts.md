---
title: "Phishing service spoofs RingCentral to steal Microsoft 365 accounts"
description: "The Greatness phishing-as-a-service (PhaaS) platform has expanded from credential phishing to adversary-in-the-middle attacks and device-code phishing targeting Microsoft 365 accounts."
pubDate: 2026-08-05
draft: false
tags:
  - security
  - cloud
  - threat-intelligence
canonical: "https://zerodaydiary.com/blog/2026/08/phishing-service-spoofs-ringcentral-to-steal-microsoft-365-accounts/"
---

## What happened
Recent reporting highlighted phishing service spoofs ringcentral to steal microsoft 365 accounts. The Greatness phishing-as-a-service (PhaaS) platform has expanded from credential phishing to adversary-in-the-middle attacks and device-code phishing targeting Microsoft 365 accounts. The platform has been active since at least mid-2022, targeting Microsoft 365 users in the United States, Canada, the UK, Australia, and South Africa.

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
- [Primary source](https://www.bleepingcomputer.com/news/security/phishing-service-spoofs-ringcentral-to-steal-microsoft-365-accounts/)
- Source profile: Reporting
