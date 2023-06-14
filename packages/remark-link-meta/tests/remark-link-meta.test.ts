import { unified } from "unified";
import remarkLinkMeta, { RemarkLinkMetaOptions } from "../src";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { rest } from "msw";
import { setupServer } from "msw/node";

const getProcessor = (options?: RemarkLinkMetaOptions) =>
  unified()
    .use(remarkParse)
    .use(remarkLinkMeta, options)
    .use(remarkRehype)
    .use(rehypeStringify);

const TEST_SITE_URL = "https://example.com";
const TEST_SITE_TITLE = "Test Site For Sor4chi Unified Plugins";
const TEST_SITE_DESCRIPTION =
  "This is a test site for Sor4chi unified plugins. This site is used for testing purposes only.";
const TEST_SITE_ICON_URL = "https://example.com/statics/images/favicon.ico";
const TEST_SITE_THUMBNAIL_URL =
  "https://example.com/statics/images/thumbnail.png";

describe("remarkLinkMeta", () => {
  const server = setupServer(
    rest.get(TEST_SITE_URL, (_, res, ctx) => {
      return res(
        ctx.set("Content-Type", "text/html"),
        ctx.body(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${TEST_SITE_TITLE}</title>
  <meta name="description" content="${TEST_SITE_DESCRIPTION}">
  <link rel="shortcut icon" href="${TEST_SITE_ICON_URL}" type="image/x-icon">
  <meta property="og:image" content="${TEST_SITE_THUMBNAIL_URL}">
</head>
<body>
  <h1>Hello World!</h1>
</body>
</html>
`)
      );
    })
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test("adds metadata to link nodes", async () => {
    const input = `
[test site](${TEST_SITE_URL})
    `;
    const processor = getProcessor();
    const result = await processor.process(input);
    const html = result.toString();
    expect(html).toContain(`href="${TEST_SITE_URL}"`);
    expect(html).toContain(`title="${TEST_SITE_TITLE}"`);
    expect(html).toContain(`description="${TEST_SITE_DESCRIPTION}"`);
    expect(html).toContain(`iconUrl="${TEST_SITE_ICON_URL}"`);
    expect(html).toContain(`thumbnailUrl="${TEST_SITE_THUMBNAIL_URL}"`);
  });

  test("does not add metadata to inline link nodes when inline option is false", async () => {
    const input = `
This is an [test site](${TEST_SITE_URL})
    `;
    const processor = getProcessor({ inline: false });
    const result = await processor.process(input);
    const html = result.toString();
    expect(html).toContain(`href="${TEST_SITE_URL}"`);
    expect(html).not.toContain(`title="${TEST_SITE_TITLE}"`);
    expect(html).not.toContain(`description="${TEST_SITE_DESCRIPTION}"`);
    expect(html).not.toContain(`iconUrl="${TEST_SITE_ICON_URL}"`);
    expect(html).not.toContain(`thumbnailUrl="${TEST_SITE_THUMBNAIL_URL}"`);
  });

  test("adds metadata to inline link nodes when inline option is true", async () => {
    const input = `
This is an [test site](${TEST_SITE_URL})
      `;
    const processor = getProcessor({ inline: true });
    const result = await processor.process(input);
    const html = result.toString();
    expect(html).toContain(`href="${TEST_SITE_URL}"`);
    expect(html).toContain(`title="${TEST_SITE_TITLE}"`);
    expect(html).toContain(`description="${TEST_SITE_DESCRIPTION}"`);
    expect(html).toContain(`iconUrl="${TEST_SITE_ICON_URL}"`);
    expect(html).toContain(`thumbnailUrl="${TEST_SITE_THUMBNAIL_URL}"`);
  });
});
