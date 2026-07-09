---
title: "Fake Paysafe, Skrill SDKs on NPM and PyPi steal credentials"
description: "Malicious packages on the Node Package Manager (npm) and the Python Package Index (PyPI) delivered stealer malware to developers and users of Paysafe, Skrill, and Neteller payment applications."
pubDate: 2026-07-09
draft: false
tags:
  - security
  - cloud
  - data-security
  - crypto
canonical: "https://zerodaydiary.com/blog/2026/07/fake-paysafe-skrill-sdks-on-npm-and-pypi-steal-credentials/"
---

## What happened
Recent reporting highlighted fake paysafe, skrill sdks on npm and pypi steal credentials. Malicious packages on the Node Package Manager (npm) and the Python Package Index (PyPI) delivered stealer malware to developers and users of Paysafe, Skrill, and Neteller payment applications. The threat actor published at least 17 malicious packages simultaneously, each tasked to exfiltrate credentials and access tokens to a command-and-control server hosted on Amazon Web Services (AWS).

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
- [Primary source](https://www.bleepingcomputer.com/news/security/fake-paysafe-skrill-sdks-on-npm-and-pypi-steal-credentials/)
- Source profile: Reporting
