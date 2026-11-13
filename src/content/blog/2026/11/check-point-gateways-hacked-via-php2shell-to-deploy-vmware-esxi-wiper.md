---
title: "Check Point gateways hacked via PHP2Shell to deploy VMware ESXi wiper"
description: "Vulnerable Check Point Security Gateway instances have been targeted in PHP2Shell attacks that deployed data-wiping malware on VMware ESXi hosts."
pubDate: 2026-11-13
draft: false
tags:
  - security
  - cloud
  - vulnerabilities
  - kev
canonical: "https://zerodaydiary.com/blog/2026/11/check-point-gateways-hacked-via-php2shell-to-deploy-vmware-esxi-wiper/"
---

## What happened
Recent reporting highlighted check point gateways hacked via php2shell to deploy vmware esxi wiper. Vulnerable Check Point Security Gateway instances have been targeted in PHP2Shell attacks that deployed data-wiping malware on VMware ESXi hosts. The attacks started on October 30, initially against Israeli organizations, and were conducted by an actor that ran the entire campaign, from initial access to lateral movement and launching PHP webshells.

## Why it matters
This matters because it has practical implications for defensive prioritisation, exposure management, or incident response rather than sitting as abstract security commentary. KEV-style urgency also pushes the item closer to immediate operational response than routine tracking.

## Assessment
The strongest signal here is that a vulnerability class or attack path is being treated as operationally relevant rather than background technical debt. In practice, that means cloud-adjacent control planes, shared services, and inherited trust assumptions deserve more scrutiny than many organisations currently give them.

## Recommended actions
- Review whether the issue, advisory, or attack pattern is relevant to your environment, suppliers, or exposed systems
- Patch, harden, or validate logging and monitoring coverage where applicable
- Check whether cloud services, connectors, or shared administrative paths create avoidable trust-boundary risk
- Monitor follow-on reporting or primary-source updates for scope expansion, implementation guidance, or stronger enforcement signals

## Further reading
- [Primary source](https://www.bleepingcomputer.com/news/security/check-point-gateways-hacked-via-php2shell-to-deploy-vmware-esxi-wiper/)
- Source profile: Reporting
