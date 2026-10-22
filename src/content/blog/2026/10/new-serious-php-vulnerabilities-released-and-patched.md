---
title: "New Serious PHP Vulnerabilities Released and Patched"
description: "PHP maintainers have released fixes for two critical vulnerabilities: PHP 8.5.12, 8.4.27, 8.3.36 and 8.2.35 fix two critical vulnerabilities that can allow unauthenticated remote code execution. All PHP users are strongly encouraged to u…"
pubDate: 2026-10-22
draft: false
tags:
  - security
  - vulnerabilities
canonical: "https://zerodaydiary.com/blog/2026/10/new-serious-php-vulnerabilities-released-and-patched/"
---

## What happened
The latest analysis post sets out a development that is directly relevant to security operators. PHP 8.5.12, 8.4.27, 8.3.36 and 8.2.35 fix two critical vulnerabilities that can allow unauthenticated remote code execution. Who is at risk: all PHP installations serving web requests, including PHP-FPM, Apache with mod_php, php-cgi, FrankenPHP and LiteSpeed.

## Why it matters
This matters because it has practical implications for defensive prioritisation, exposure management, or incident response rather than sitting as abstract security commentary.

## Assessment
The strongest signal here is that a vulnerability class or attack path is being treated as operationally relevant rather than background technical debt. In practice, that means operators should read this as a broader signal over noise item rather than a narrow one-off.

## Recommended actions
- Review whether the issue, advisory, or attack pattern is relevant to your environment, suppliers, or exposed systems
- Patch, harden, or validate logging and monitoring coverage where applicable
- Monitor follow-on reporting or primary-source updates for scope expansion, implementation guidance, or stronger enforcement signals

## Further reading
- [Primary source](https://www.schneier.com/blog/archives/2026/10/new-serious-php-vulnerabilities-released-and-patched.html)
- Source profile: Analysis
