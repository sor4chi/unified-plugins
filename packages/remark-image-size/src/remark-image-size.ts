import { getPlaiceholder } from 'plaiceholder';
import { Plugin, Transformer } from 'unified';
import { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';

import type { Image } from 'mdast';

const fetch = (...args: Parameters<typeof import('node-fetch')['default']>) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const caches = new Map<string, { width: number; height: number }>();

export const remarkImageSize: Plugin = (): Transformer => {
  return async (tree: Node) => {
    const fetchers: (() => Promise<void>)[] = [];
    const visitor = (node: Image, _index: number, _parent?: Parent) => {
      const { url } = node;
      if (url) {
        fetchers.push(async () => {
          let metadata = caches.get(url);
          if (!metadata) {
            const buffer = await fetch(url).then((res) => res.arrayBuffer());
            const {
              metadata: { width, height },
            } = await getPlaiceholder(Buffer.from(buffer));
            metadata = { width, height };
            caches.set(url, { width, height });
          }

          node.data = {
            hProperties: {
              src: url,
              alt: node.alt,
              width: metadata.width,
              height: metadata.height,
            },
          };
        });
      }
    };
    visit(tree, 'image', visitor);
    await Promise.all(fetchers.map((fetcher) => fetcher()));
  };
};
