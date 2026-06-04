---
title: "New 'HTTP/2 Bomb' DoS attack crashes web servers in under a minute"
description: "A new denial-of-service (DoS) attack dubbed HTTP/2 Bomb can be launched from a single machine to take down web servers within seconds."
pubDate: 2026-06-04
draft: false
tags:
  - security
  - cloud
  - vulnerabilities
  - regulation
canonical: "https://zerodaydiary.com/blog/2026/06/new-http-2-bomb-dos-attack-crashes-web-servers-in-under-a-minute/"
---

## What happened
Recent reporting highlighted new 'http/2 bomb' dos attack crashes web servers in under a minute. A new denial-of-service (DoS) attack dubbed HTTP/2 Bomb can be launched from a single machine to take down web servers within seconds. The technique works on default HTTP/2 configurations of major web servers, including NGINX, Apache HTTP Server, Microsoft IIS, Envoy, and Cloudflare Pingora.

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
- [Primary source](https://www.bleepingcomputer.com/news/security/new-http-2-bomb-dos-attack-crashes-web-servers-in-under-a-minute/)
- Source profile: Reporting
