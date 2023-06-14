import {
  getTitleFromElement,
  getDescriptionFromElement,
  getIconUrlFromElement,
  getThumbnailUrlFromElement,
} from "../src/meta-parser";
import { parse } from "node-html-parser";

describe("getTitleFromElement", () => {
  it("returns the og:title content if it exists", () => {
    const el = parse(`
      <html>
        <head>
          <meta property="og:title" content="Example: Home" />
        </head>
      </html>
    `);
    expect(getTitleFromElement(el)).toBe("Example: Home");
  });

  it("returns the twitter:title content if og:title does not exist", () => {
    const el = parse(`
      <html>
        <head>
          <meta name="twitter:title" content="Example: Home" />
        </head>
      </html>
    `);
    expect(getTitleFromElement(el)).toBe("Example: Home");
  });

  it("returns the text content of the title element if neither og:title nor twitter:title exist", () => {
    const el = parse(`
      <html>
        <head>
          <title>Example: Home</title>
        </head>
      </html>
    `);
    expect(getTitleFromElement(el)).toBe("Example: Home");
  });

  it("returns undefined if none of the title elements exist", () => {
    const el = parse(`
      <html>
        <head>
        </head>
      </html>
    `);
    expect(getTitleFromElement(el)).toBeUndefined();
  });
});

describe("getDescriptionFromElement", () => {
  it("returns the og:description content if it exists", () => {
    const el = parse(`
      <html>
        <head>
          <meta property="og:description" content="Artificial intelligence research lab and business" />
        </head>
      </html>
    `);
    expect(getDescriptionFromElement(el)).toBe(
      "Artificial intelligence research lab and business"
    );
  });

  it("returns the twitter:description content if og:description does not exist", () => {
    const el = parse(`
      <html>
        <head>
          <meta name="twitter:description" content="Artificial intelligence research lab and business" />
        </head>
      </html>
    `);
    expect(getDescriptionFromElement(el)).toBe(
      "Artificial intelligence research lab and business"
    );
  });

  it("returns the description content if neither og:description nor twitter:description exist", () => {
    const el = parse(`
      <html>
        <head>
          <meta name="description" content="Artificial intelligence research lab and business" />
        </head>
      </html>
    `);
    expect(getDescriptionFromElement(el)).toBe(
      "Artificial intelligence research lab and business"
    );
  });

  it("returns undefined if none of the description elements exist", () => {
    const el = parse(`
      <html>
        <head>
        </head>
      </html>
    `);
    expect(getDescriptionFromElement(el)).toBeUndefined();
  });
});

describe("getIconUrlFromElement", () => {
  it('returns the href of the link rel="icon" element if it exists', () => {
    const el = parse(`
      <html>
        <head>
          <link rel="icon" href="https://example.com/static/images/favicon.ico" />
        </head>
      </html>
    `);
    expect(getIconUrlFromElement(el)).toBe(
      "https://example.com/static/images/favicon.ico"
    );
  });

  it('returns the href of the link rel="shortcut icon" element if link rel="icon" does not exist', () => {
    const el = parse(`
      <html>
        <head>
          <link rel="shortcut icon" href="https://example.com/static/images/favicon.ico" />
        </head>
      </html>
    `);
    expect(getIconUrlFromElement(el)).toBe(
      "https://example.com/static/images/favicon.ico"
    );
  });

  it('returns the href of the link rel="apple-touch-icon" element if neither link rel="icon" nor link rel="shortcut icon" exist', () => {
    const el = parse(`
      <html>
        <head>
          <link rel="apple-touch-icon" href="https://example.com/static/images/favicon.ico" />
        </head>
      </html>
    `);
    expect(getIconUrlFromElement(el)).toBe(
      "https://example.com/static/images/favicon.ico"
    );
  });

  it("returns undefined if none of the icon elements exist", () => {
    const el = parse(`
      <html>
        <head>
        </head>
      </html>
    `);
    expect(getIconUrlFromElement(el)).toBeUndefined();
  });
});

describe("getThumbnailUrlFromElement", () => {
  it("returns the content of the og:image element if it exists", () => {
    const el = parse(`
      <html>
        <head>
          <meta property="og:image" content="https://example.com/static/images/share.png" />
        </head>
      </html>
    `);
    expect(getThumbnailUrlFromElement(el)).toBe(
      "https://example.com/static/images/share.png"
    );
  });

  it("returns the content of the twitter:image element if og:image does not exist", () => {
    const el = parse(`
      <html>
        <head>
          <meta name="twitter:image" content="https://example.com/static/images/share.png" />
        </head>
      </html>
    `);
    expect(getThumbnailUrlFromElement(el)).toBe(
      "https://example.com/static/images/share.png"
    );
  });

  it("returns undefined if neither og:image nor twitter:image exist", () => {
    const el = parse(`
      <html>
        <head>
        </head>
      </html>
    `);
    expect(getThumbnailUrlFromElement(el)).toBeUndefined();
  });
});
