---
title: "PyPI package with 1.1M monthly downloads hacked to push infostealer"
description: "An attacker pushed a malicious version of the popular elementary-data package Python Package Index (PyPI) to steal sensitive developer data and cryptocurrency wallets."
pubDate: 2026-04-28
draft: false
tags:
  - security
  - vulnerabilities
  - devops
  - crypto
canonical: "https://zerodaydiary.com/blog/2026/04/pypi-package-with-1-1m-monthly-downloads-hacked-to-push-infostealer/"
---

## What happened
Recent reporting highlighted pypi package with 1.1m monthly downloads hacked to push infostealer. An attacker pushed a malicious version of the popular elementary-data package Python Package Index (PyPI) to steal sensitive developer data and cryptocurrency wallets. The dangerous release is 0.23.3, and it extended to the Docker image due to the package's workflow that creates the image from the code and uploads it to a container registry for deployment.

## Why it matters
This matters because it has practical implications for defensive prioritisation, exposure management, or incident response rather than sitting as abstract security commentary.

## Assessment
The strongest signal here is that a vulnerability class or attack path is being treated as operationally relevant rather than background technical debt. In practice, that means operators should read this as a broader signal over noise item rather than a narrow one-off.

## Recommended actions
- Review whether the issue, advisory, or attack pattern is relevant to your environment, suppliers, or exposed systems
- Patch, harden, or validate logging and monitoring coverage where applicable
- Monitor follow-on reporting or primary-source updates for scope expansion, implementation guidance, or stronger enforcement signals

## Further reading
- [Primary source](https://www.bleepingcomputer.com/news/security/pypi-package-with-11m-monthly-downloads-hacked-to-push-infostealer/)
- Source profile: Reporting
