import { parse } from 'node-html-parser';
import { Plugin, Transformer } from 'unified';
import { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';

import {
  getDescriptionFromElement,
  getIconUrlFromElement,
  getThumbnailUrlFromElement,
  getTitleFromElement,
} from './meta-parser';

import { LinkMeta, RemarkLinkMetaOptions } from '.';

import type { Link } from 'mdast';

const fetch = (...args: Parameters<typeof import('node-fetch')['default']>) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const fetchMeta = async (url: string): Promise<Partial<LinkMeta>> => {
  const res = await fetch(url);
  const html = await res.text();
  const doc = parse(html);

  return {
    title: getTitleFromElement(doc),
    description: getDescriptionFromElement(doc),
    iconUrl: getIconUrlFromElement(doc),
    thumbnailUrl: getThumbnailUrlFromElement(doc),
  };
};

export const remarkLinkMeta: Plugin = (
  options: RemarkLinkMetaOptions = {},
): Transformer => {
  return async (tree: Node) => {
    const fetchers: (() => Promise<void>)[] = [];
    const visitor = (node: Link, _index: number, parent?: Parent) => {
      // if inline link and inline option is false, skip
      if (
        !options.inline &&
        parent?.type === 'paragraph' &&
        parent.children.length > 1
      )
        return;
      const { url } = node;
      if (url) {
        fetchers.push(async () => {
          const meta = await fetchMeta(url);
          node.data = {
            hProperties: {
              href: url,
              ...meta,
            },
          };
        });
      }
    };
    visit(tree, 'link', visitor);
    await Promise.all(fetchers.map((fetcher) => fetcher()));
  };
};
