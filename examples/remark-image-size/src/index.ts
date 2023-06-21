import rehypeStringify from 'rehype-stringify';
import remarkImageSize from 'remark-image-size';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const processor = unified()
  .use(remarkParse)
  .use(remarkImageSize)
  .use(remarkRehype)
  .use(rehypeStringify);

processor.process('![alt text](https://placehold.co/100x200)');
