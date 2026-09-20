---
title: "Malicious npm packages evade install-script defenses at runtime"
description: "An ongoing npm malware campaign involving the 'indexed-btree' package shows how threat actors bypass supply chain defenses by hiding malicious code in a package's normal runtime behavior rather than in installation scripts."
pubDate: 2026-09-20
draft: false
tags:
  - security
  - crypto
  - threat-intelligence
canonical: "https://zerodaydiary.com/blog/2026/09/malicious-npm-packages-evade-install-script-defenses-at-runtime/"
---

## What happened
Recent reporting highlighted malicious npm packages evade install-script defenses at runtime. An ongoing npm malware campaign involving the 'indexed-btree' package shows how threat actors bypass supply chain defenses by hiding malicious code in a package's normal runtime behavior rather than in installation scripts. The package, spotted by Checkmarx researchers, attempts to impersonate the legitimate 'sorted-btree' library and has already amassed 2 million weekly downloads.

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
- [Primary source](https://www.bleepingcomputer.com/news/security/malicious-npm-packages-evade-install-script-defenses-at-runtime/)
- Source profile: Reporting
