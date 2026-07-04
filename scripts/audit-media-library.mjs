#!/usr/bin/env node

import { getMediaLibrary, mediaRoots } from "../src/data/media-library.mjs";

const media = getMediaLibrary();
const missingRoots = mediaRoots.filter((root) => !media.some((item) => item.root === root.root));

if (missingRoots.length) {
  console.error(`Media roots without images: ${missingRoots.map((root) => root.root).join(", ")}`);
  process.exit(1);
}

const byProduct = new Map();
for (const item of media) {
  byProduct.set(item.product, (byProduct.get(item.product) || 0) + 1);
}

console.log(`Media library audit passed (${media.length} image assets).`);
for (const [product, count] of byProduct) {
  console.log(`- ${product}: ${count}`);
}
