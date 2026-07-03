---
title: "ARToken PhaaS exposes EvilTokens' Microsoft 365 phishing toolkit"
description: "A new phishing-as-a-service (PhaaS) platform dubbed \"ARToken\" appears to operate as an affiliate of the EvilTokens phishing platform, giving researchers a glimpse into an extensive toolkit designed to compromise Microsoft 365."
pubDate: 2026-07-03
draft: false
tags:
  - security
  - cloud
canonical: "https://zerodaydiary.com/blog/2026/07/artoken-phaas-exposes-eviltokens-microsoft-365-phishing-toolkit/"
---

## What happened
Recent reporting highlighted artoken phaas exposes eviltokens' microsoft 365 phishing toolkit. A new phishing-as-a-service (PhaaS) platform dubbed "ARToken" appears to operate as an affiliate of the EvilTokens phishing platform, giving researchers a glimpse into an extensive toolkit designed to compromise Microsoft 365. Cisco Talos researchers discovered the platform while investigating phishing infrastructure used in an incident response engagement and identified a React-based management panel called "ARToken Panel" that exposed more than 80 API endpoints.

## Why it matters
This matters because it has practical implications for defensive prioritisation, exposure management, or incident response rather than sitting as abstract security commentary.

## Assessment
The strongest signal here is not just the headline event, but the wider pattern it points to. In practice, that means cloud-adjacent control planes, shared services, and inherited trust assumptions deserve more scrutiny than many organisations currently give them.

## Recommended actions
- Review whether the issue, advisory, or attack pattern is relevant to your environment, suppliers, or exposed systems
- Patch, harden, or validate logging and monitoring coverage where applicable
- Check whether cloud services, connectors, or shared administrative paths create avoidable trust-boundary risk
- Monitor follow-on reporting or primary-source updates for scope expansion, implementation guidance, or stronger enforcement signals

## Further reading
- [Primary source](https://www.bleepingcomputer.com/news/security/artoken-phaas-exposes-eviltokens-microsoft-365-phishing-toolkit/)
- Source profile: Reporting
