import { getPlaiceholder } from 'plaiceholder';
import { Plugin, Transformer } from 'unified';
import { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';

import type { Image } from 'mdast';

const fetch = (...args: Parameters<typeof import('node-fetch')['default']>) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

export const remarkImageSize: Plugin = (): Transformer => {
  return async (tree: Node) => {
    const fetchers: (() => Promise<void>)[] = [];
    const visitor = (node: Image, _index: number, _parent?: Parent) => {
      const { url } = node;
      if (url) {
        fetchers.push(async () => {
          const buffer = await fetch(url).then((res) => res.arrayBuffer());
          const {
            metadata: { width, height },
          } = await getPlaiceholder(Buffer.from(buffer));

          node.data = {
            hProperties: {
              src: url,
              alt: node.alt,
              width,
              height,
            },
          };
        });
      }
    };
    visit(tree, 'image', visitor);
    await Promise.all(fetchers.map((fetcher) => fetcher()));
  };
};
