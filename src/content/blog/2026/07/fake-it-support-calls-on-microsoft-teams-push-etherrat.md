---
title: "Fake IT support calls on Microsoft Teams push EtherRAT"
description: "Threat actors are abusing Microsoft Teams voice calls by impersonating corporate IT support staff to trick employees into installing the EtherRAT malware, giving attackers initial access to corporate networks."
pubDate: 2026-07-07
draft: false
tags:
  - security
  - cloud
  - threat-intelligence
canonical: "https://zerodaydiary.com/blog/2026/07/fake-it-support-calls-on-microsoft-teams-push-etherrat/"
---

## What happened
Recent reporting highlighted fake it support calls on microsoft teams push etherrat. Threat actors are abusing Microsoft Teams voice calls by impersonating corporate IT support staff to trick employees into installing the EtherRAT malware, giving attackers initial access to corporate networks. The campaign, reported by Palo Alto Networks' Unit 42, combines phishing emails, Microsoft Teams voice calls, legitimate remote management tools, and a Node.js-based malware loader to compromise victims' computers.

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
- [Primary source](https://www.bleepingcomputer.com/news/security/fake-it-support-calls-on-microsoft-teams-push-etherrat-malware/)
- Source profile: Reporting
