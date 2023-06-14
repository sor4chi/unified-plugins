import { Node, Parent } from "unist";
import { visit } from "unist-util-visit";
import { Plugin, Transformer } from "unified";
import type { Image } from "mdast";
import probe from "probe-image-size";

export const remarkImageSize: Plugin = (): Transformer => {
  return async (tree: Node) => {
    const fetchers: (() => Promise<void>)[] = [];
    const visitor = (node: Image, _index: number, _parent?: Parent) => {
      const { url } = node;
      if (url) {
        fetchers.push(async () => {
          const { width, height } = await probe(url);
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
    visit(tree, "image", visitor);
    await Promise.all(fetchers.map((fetcher) => fetcher()));
  };
};
