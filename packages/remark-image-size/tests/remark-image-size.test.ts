import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

import remarkImageSize from '../src';

const processor = unified()
  .use(remarkParse)
  .use(remarkImageSize)
  .use(remarkRehype)
  .use(rehypeStringify);

const getImage = (w: number, h: number) => `https://placehold.co/${w}x${h}`;

describe('remarkImageSize', () => {
  it('should add width and height to single image node', async () => {
    const IMAGE = { w: 100, h: 200 };
    const markdown = `![alt text](${getImage(IMAGE.w, IMAGE.h)})`;
    const result = await processor.process(markdown);
    const html = result.toString();

    expect(html).toContain(`width="${IMAGE.w}"`);
    expect(html).toContain(`height="${IMAGE.h}"`);
  });

  it('should add width and height to multiple image nodes', async () => {
    const IMAGE_1 = { w: 100, h: 200 };
    const IMAGE_2 = { w: 300, h: 400 };
    const markdown = `
![alt text](${getImage(IMAGE_1.w, IMAGE_1.h)})
![alt text](${getImage(IMAGE_2.w, IMAGE_2.h)})
`;
    const result = await processor.process(markdown);
    const html = result.toString();

    const IMAGE_TAG_RE = /<img[^>]+>/g;
    const images = html.match(IMAGE_TAG_RE);
    expect(images).toHaveLength(2);
    expect(images![0]).toContain(`width="${IMAGE_1.w}"`);
    expect(images![0]).toContain(`height="${IMAGE_1.h}"`);
    expect(images![1]).toContain(`width="${IMAGE_2.w}"`);
    expect(images![1]).toContain(`height="${IMAGE_2.h}"`);
  });
});
