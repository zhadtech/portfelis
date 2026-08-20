---
title: Atlas
description: A route-planning experiment over public transit data, currently paused while the upstream feed format settles.
date: 2026-08-05
tech: ['Rust', 'GTFS']
repo: https://example.com/repo/atlas
featured: false
draft: true
---

Placeholder project, and a deliberate draft — it renders in `astro dev` and is absent
from a production build.

| Stage          | State   |
| -------------- | ------- |
| Feed ingest    | Working |
| Transfer graph | Working |
| Query API      | Paused  |

Paused rather than abandoned: the upstream feed changes shape roughly every quarter,
and rebuilding the ingest each time costs more than the result is currently worth.
