---
title: "Unpatched Cacti zero-day with public PoC gives remote code execution"
description: "A zero-day vulnerability in the Cacti network monitoring platform has been publicly disclosed, along with a proof-of-concept exploit that lets unauthenticated attackers execute commands on vulnerable servers."
pubDate: 2026-11-27
draft: false
tags:
  - security
  - vulnerabilities
  - network-edge
  - threat-intelligence
canonical: "https://zerodaydiary.com/blog/2026/11/unpatched-cacti-zero-day-with-public-poc-gives-remote-code-execution/"
---

## What happened
Recent reporting highlighted unpatched cacti zero-day with public poc gives remote code execution. A zero-day vulnerability in the Cacti network monitoring platform has been publicly disclosed, along with a proof-of-concept exploit that lets unauthenticated attackers execute commands on vulnerable servers. The exploit, dubbed "4HTTP2SHELL" (previously 4HTTP2ROOT), was published on Thanksgiving Day by a cybersecurity researcher known as ek0ms savi0r from the Church of Malware, who demonstrated how the vulnerability can be exploited using just four HTTP requests.

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
- [Primary source](https://www.bleepingcomputer.com/news/security/unpatched-cacti-zero-day-with-public-poc-gives-remote-code-execution/)
- Source profile: Reporting
