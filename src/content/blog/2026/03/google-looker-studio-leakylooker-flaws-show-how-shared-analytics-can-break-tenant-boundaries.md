---
title: "Google Looker Studio LeakyLooker flaws show how shared analytics can break tenant boundaries"
description: "Researchers disclosed nine cross-tenant flaws in Google Looker Studio that could have enabled arbitrary SQL queries, data exfiltration, and destructive actions across victims’ cloud-connected data sources before Google patched them."
pubDate: 2026-03-11
draft: false
tags:
  - security
  - cloud
  - data-security
  - vulnerabilities
canonical: "https://zerodaydiary.com/blog/2026/03/google-looker-studio-leakylooker-flaws-show-how-shared-analytics-can-break-tenant-boundaries/"
---

## Summary
Researchers have disclosed nine cross-tenant vulnerabilities in Google Looker Studio that could have allowed attackers to run arbitrary SQL queries, exfiltrate sensitive information, and in some cases modify or delete data tied to victims’ cloud-connected data sources. Google said the issues were responsibly disclosed in June 2025 and have now been addressed, with no evidence of in-the-wild exploitation.

## What happened
According to reporting on Tenable’s research, the flaws — collectively named LeakyLooker — affected trust boundaries in Google Looker Studio’s report-sharing and data-connector model. The reported weaknesses involved multiple paths for cross-tenant abuse, including zero-click SQL injection on database connectors, stored-credential misuse, data leaks through hyperlinks and image rendering, and cross-tenant access through BigQuery, Spanner, and other connected services.

The most serious scenario described by the researchers would have allowed an attacker to abuse public or shared reports and their attached data sources in ways that broke the assumption that a viewer should not be able to control the underlying data access context.

## Key details
The reported impact included:
- arbitrary SQL query execution against connected databases
- exfiltration of sensitive data from victims’ cloud environments
- possible insertion, deletion, or modification of data in some configurations
- abuse paths involving BigQuery, Spanner, Google Sheets, Cloud Storage, PostgreSQL, MySQL, and other Looker Studio data connectors
- one-click and zero-click attack chains depending on the connector and report-sharing setup

The research framed the issue as a design-level attack class affecting cross-tenant trust assumptions rather than a single isolated bug. Google has since patched the weaknesses.

## Why it matters
This matters because analytics and reporting platforms often sit close to sensitive datasets while being treated as collaboration layers rather than high-risk execution surfaces. When those platforms support sharing, embedded media, copied reports, stored credentials, and multiple connector types, small trust-boundary mistakes can turn into cross-tenant exposure.

The Looker Studio case is a reminder that cloud data tools do not just inherit database risk — they create their own attack surface through convenience features, workflow assumptions, and hidden connector behaviour.

## Assessment
The key lesson here is architectural, not just product-specific. Security teams tend to focus on identity, storage, and direct application exposure, but shared analytics layers can quietly become control planes for data access. If the access model assumes viewers are passive while product features allow cloning, rendering, or query reuse under another tenant’s context, the blast radius becomes much larger than a normal reporting bug.

Even though these flaws are patched, the broader pattern is likely to recur across BI, observability, and embedded reporting platforms.

## Recommended actions
- review whether shared analytics or BI platforms in your environment connect to high-value datasets through stored credentials or reusable connector contexts
- audit public and externally shared reports for unnecessary access paths, embedded content, and inherited permissions
- validate whether copied reports, shared templates, or connector re-use could preserve privileged access unexpectedly
- treat reporting and analytics layers as part of the data-security attack surface, not just presentation tooling

## Further reading
- [The Hacker News coverage of LeakyLooker](https://thehackernews.com/2026/03/new-leakylooker-flaws-in-google-looker.html)
- [Tenable research overview](https://www.tenable.com/blog/leakylooker-google-cloud-looker-studio-vulnerabilities)
