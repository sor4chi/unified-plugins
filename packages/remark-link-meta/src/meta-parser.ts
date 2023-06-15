import type { HTMLElement } from 'node-html-parser';

export const getTitleFromElement = (el: HTMLElement): string | undefined => {
  // first try <meta property="og:title" content="...">
  const ogTitle = el.querySelector("meta[property='og:title']");
  if (ogTitle) {
    return ogTitle.getAttribute('content') ?? undefined;
  }
  // then try <meta name="twitter:title" content="...">
  const twitterTitle = el.querySelector("meta[name='twitter:title']");
  if (twitterTitle) {
    return twitterTitle.getAttribute('content') ?? undefined;
  }
  // then try <title>...</title>
  const title = el.querySelector('title');
  if (title) {
    return title.textContent ?? undefined;
  }
  return undefined;
};

export const getDescriptionFromElement = (
  el: HTMLElement,
): string | undefined => {
  // first try <meta property="og:description" content="...">
  const ogDescription = el.querySelector("meta[property='og:description']");
  if (ogDescription) {
    return ogDescription.getAttribute('content') ?? undefined;
  }
  // then try <meta name="twitter:description" content="...">
  const twitterDescription = el.querySelector(
    "meta[name='twitter:description']",
  );
  if (twitterDescription) {
    return twitterDescription.getAttribute('content') ?? undefined;
  }
  // then try <meta name="description" content="...">
  const description = el.querySelector("meta[name='description']");
  if (description) {
    return description.getAttribute('content') ?? undefined;
  }
  return undefined;
};

export const getIconUrlFromElement = (el: HTMLElement): string | undefined => {
  // first try <link rel="icon" href="...">
  const favicon = el.querySelector("link[rel='icon']");
  if (favicon) {
    return favicon.getAttribute('href') ?? undefined;
  }
  // then try <link rel="shortcut icon" href="...">
  const shortcutIcon = el.querySelector("link[rel='shortcut icon']");
  if (shortcutIcon) {
    return shortcutIcon.getAttribute('href') ?? undefined;
  }
  // then try <link rel="apple-touch-icon" href="...">
  const appleTouchIcon = el.querySelector("link[rel='apple-touch-icon']");
  if (appleTouchIcon) {
    return appleTouchIcon.getAttribute('href') ?? undefined;
  }
  return undefined;
};

export const getThumbnailUrlFromElement = (
  el: HTMLElement,
): string | undefined => {
  // first try <meta property="og:image" content="...">
  const ogImage = el.querySelector("meta[property='og:image']");
  if (ogImage) {
    return ogImage.getAttribute('content') ?? undefined;
  }
  // then try <meta name="twitter:image" content="...">
  const twitterImage = el.querySelector("meta[name='twitter:image']");
  if (twitterImage) {
    return twitterImage.getAttribute('content') ?? undefined;
  }
  return undefined;
};
