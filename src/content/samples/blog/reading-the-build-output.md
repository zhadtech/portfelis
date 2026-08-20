---
title: Reading the build output
description: What the numbers after a production build actually tell you, and which one to watch first.
date: 2026-05-12
tags: ['tooling']
draft: false
---

Placeholder post. Replace this file, or mount the private content repository over
`src/content/blog`.

A production build prints more than a success message. The line worth reading first is
the total transferred weight of the initial route, because that is the number a reader
experiences before anything else on the page has a chance to matter.

```js
// Report the weight of every emitted asset, largest first.
const assets = await readdir('dist/_astro');
const sizes = await Promise.all(
  assets.map(async (name) => [name, (await stat(`dist/_astro/${name}`)).size]),
);

for (const [name, bytes] of sizes.sort((a, b) => b[1] - a[1])) {
  console.log(`${(bytes / 1024).toFixed(1)} kB  ${name}`);
}
```

Two assets on this page are unavoidable: the document and the stylesheet. Everything
else is a choice. The [project notes](https://example.com/notes) go into the reasoning
behind each one.
