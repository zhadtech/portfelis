---
title: Ledger — double-entry bookkeeping in the browser
description: A single-page accounting tool that keeps its data on the device and reconciles imported statements against manual entries.
date: 2026-07-18
tech: ['TypeScript', 'IndexedDB', 'Web Workers', 'Vitest']
repo: https://example.com/repo/ledger
demo: https://example.com/demo/ledger
featured: true
draft: false
---

Placeholder project. Replace this file, or mount the private content repository over
`src/content/projects`.

The interesting constraint was that nothing leaves the device, so reconciliation had to
run locally against files the user picks. Parsing moved to a worker once statements
crossed a few thousand rows.

```ts
// Match imported rows against manual entries by amount and a date window.
export function reconcile(imported: Row[], manual: Entry[], windowDays = 3): Match[] {
  const byAmount = Map.groupBy(manual, (entry) => entry.amount);

  return imported.flatMap((row) => {
    const candidates = byAmount.get(row.amount) ?? [];
    const match = candidates.find((entry) => daysBetween(entry.date, row.date) <= windowDays);
    return match ? [{ row, entry: match }] : [];
  });
}
```

Notes on the storage layer are in the [write-up](https://example.com/notes/ledger).
