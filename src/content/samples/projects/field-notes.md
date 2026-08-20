---
title: Field Notes
description: A small offline-first note-taking tool built to test how far a plain form and local storage can go before a framework earns its place.
date: 2026-03-04
tech: ['Web Components']
featured: false
draft: false
---

Placeholder project with neither a repository nor a demo link — the card and the detail
page both have to look deliberate without them.

The whole application is one form, one list, and a storage adapter. No build step, no
dependencies, no bundle. It exists as a reference point: whatever replaces it has to
justify the difference.

- Entries are plain text, saved on blur.
- Search is a substring scan, because the corpus never exceeds a few hundred entries.
- Export writes a single Markdown file.

> Adding a framework here would have doubled the payload and removed nothing from the
> code that already worked.
