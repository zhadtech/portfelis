---
title: Why a static site is usually the right default for a small personal project
description: A short comparison of the failure modes you inherit with a server, and the ones you avoid without one.
date: 2026-06-30
tags: ['static-sites', 'performance', 'tooling', 'notes']
draft: false
---

Placeholder post. Replace this file, or mount the private content repository over
`src/content/blog`.

> The cheapest system to operate is the one that is not running.

A static site has no request-time code, so a whole category of problem simply does not
arise. Nothing to patch at midnight, nothing to scale, nothing to leak.

What you give up:

- Anything personalised per visitor.
- Anything that must be fresh between deploys.
- Server-side form handling, which is why the contact form here posts to a third party.

What you keep:

| Concern            | With a server          | Static               |
| ------------------ | ---------------------- | -------------------- |
| Time to first byte | Depends on the runtime | CDN edge             |
| Rollback           | Redeploy and hope      | Previous artifact    |
| Attack surface     | Runtime, deps, host    | The files themselves |
| Monthly cost       | Nonzero                | Zero                 |

The trade only turns bad once a page genuinely differs per reader. Until then, the
server is a liability you are paying to maintain.
