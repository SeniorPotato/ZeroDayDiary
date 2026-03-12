---
title: "APT28 cloud-backed espionage tooling shows the value of old frameworks in new campaigns"
description: "ESET says APT28 has used BEARDSHELL, SLIMAGENT, and a heavily modified COVENANT framework to maintain long-term surveillance of Ukrainian military targets while abusing legitimate cloud storage services for command and control."
pubDate: 2026-03-11
draft: false
tags:
  - security
  - threat-intelligence
  - espionage
  - cloud
canonical: "https://zerodaydiary.com/blog/2026/03/apt28-cloud-backed-espionage-tooling-shows-the-value-of-old-frameworks-in-new-campaigns/"
geo:
  type: country
  countries:
    - UA
  points:
    - name: "Ukraine"
      lat: 48.4
      lng: 31.2
---

## Summary
ESET says APT28 has been using a combination of custom implants and a modified version of the open-source COVENANT framework to support long-term espionage operations against Ukrainian military personnel. The reported toolset includes SLIMAGENT for surveillance collection, BEARDSHELL for PowerShell-based command execution, and cloud-backed command-and-control channels that rely on legitimate storage providers to blend in.

## What happened
According to ESET reporting, the activity has involved the deployment of malware families dubbed BEARDSHELL and SLIMAGENT since April 2024, alongside a heavily modified form of COVENANT from at least July 2025. The company attributes the activity to APT28, the Russian state-linked group also tracked as Fancy Bear, Sednit, and several other names.

SLIMAGENT was described as an espionage implant capable of logging keystrokes, capturing screenshots, and collecting clipboard data. ESET also identified code-level overlap between SLIMAGENT and older XAgent-era tooling, suggesting continuity inside APT28’s custom malware lineage.

## Key details
The reported campaign used:
- SLIMAGENT for surveillance collection and operator visibility into victim activity
- BEARDSHELL to execute PowerShell commands on infected systems
- a modified COVENANT framework adapted for long-term espionage rather than short-lived red-team style use
- cloud storage services such as Icedrive and Filen for command and control, with earlier use of pCloud and Koofr also noted
- obfuscation techniques that ESET says overlap with other APT28 tooling, including older XTunnel-related tradecraft

The reporting suggests the operational value of these tools came not from novelty alone, but from adapting older or open-source capabilities into durable, cloud-friendly espionage workflows.

## Why it matters
This matters because it highlights how state-backed actors continue to blend bespoke malware, repurposed public tooling, and legitimate cloud services to complicate detection. Defenders often focus on brand-new malware families, but long-running operators can get strong results by revisiting older frameworks and reshaping them for today’s infrastructure.

The use of cloud storage for command and control is especially relevant because it pushes activity into channels that may look routine or low-risk without deeper behavioural inspection.

## Assessment
The strongest signal here is strategic reuse. APT28 does not need to reinvent every part of its toolkit if it can modernise older implants, retain proven collection logic, and wrap command-and-control inside services that defenders are reluctant to block outright. That is a practical reminder that malware age is not the same thing as operational irrelevance.

For threat-intelligence and detection teams, the case reinforces the need to track behavioural families and tradecraft continuity, not only malware names.

## Recommended actions
- review detections for cloud-storage-backed command-and-control activity rather than assuming those services are benign by default
- map existing endpoint and network controls against PowerShell-driven backdoors, keylogging, clipboard collection, and unusual screenshot activity
- incorporate lineage-based detection thinking where legacy frameworks or older implants may reappear in altered form
- monitor threat reporting on APT28/Sednit activity affecting military, defence, and government-adjacent environments in Europe

## Further reading
- [The Hacker News coverage of the ESET findings](https://thehackernews.com/2026/03/apt28-uses-beardshell-and-covenant.html)
- [ESET research on the campaign](https://www.welivesecurity.com/en/eset-research/sednit-reloaded-back-trenches/)
