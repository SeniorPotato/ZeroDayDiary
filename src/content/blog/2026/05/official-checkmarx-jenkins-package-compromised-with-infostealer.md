---
title: "Official CheckMarx Jenkins package compromised with infostealer"
description: "Checkmarx warned over the weekend that a rogue version of its Jenkins Application Security Testing (AST) plugin had been published on the Jenkins Marketplace."
pubDate: 2026-05-12
draft: false
tags:
  - security
  - vulnerabilities
  - devops
  - threat-intelligence
canonical: "https://zerodaydiary.com/blog/2026/05/official-checkmarx-jenkins-package-compromised-with-infostealer/"
---

## What happened
Recent reporting highlighted official checkmarx jenkins package compromised with infostealer. Checkmarx warned over the weekend that a rogue version of its Jenkins Application Security Testing (AST) plugin had been published on the Jenkins Marketplace. The compromise was claimed by the TeamPCP hacker group, which initiated a spree of supply-chain attacks that included the Shai-Hulud campaigns on npm and the Trivy vulnerability scanner breach, resulting in the delivery of credential-stealing malware.

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
- [Primary source](https://www.bleepingcomputer.com/news/security/official-checkmarx-jenkins-package-compromised-with-infostealer/)
- Source profile: Reporting
