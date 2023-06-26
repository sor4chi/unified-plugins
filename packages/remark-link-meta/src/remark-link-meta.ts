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

const getOrigin = (url: string): string => {
  const { origin } = new URL(url);
  return origin;
};

const fetchMeta = async (url: string): Promise<Partial<LinkMeta>> => {
  const res = await fetch(url);
  const html = await res.text();
  const doc = parse(html);

  const meta: Partial<LinkMeta> = {
    title: getTitleFromElement(doc),
    description: getDescriptionFromElement(doc),
  };

  const iconUrl = getIconUrlFromElement(doc);
  if (iconUrl) {
    meta.iconUrl = iconUrl.startsWith('http')
      ? iconUrl
      : getOrigin(url) + iconUrl;
  }

  const thumbnailUrl = getThumbnailUrlFromElement(doc);
  if (thumbnailUrl) {
    meta.thumbnailUrl = thumbnailUrl.startsWith('http')
      ? thumbnailUrl
      : getOrigin(url) + thumbnailUrl;
  }

  return meta;
};

const cache = new Map<string, Partial<LinkMeta>>();

export const remarkLinkMeta: Plugin<[RemarkLinkMetaOptions?]> = (
  options = {},
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
          let meta = cache.get(url);
          if (!meta) {
            meta = await fetchMeta(url);
            cache.set(url, meta);
          }
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
