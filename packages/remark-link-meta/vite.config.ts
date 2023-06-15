import path from 'path';

import { defineConfig } from 'vite';
import Dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    Dts({
      entryRoot: path.resolve(__dirname, 'src'),
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'remark-link-meta',
      fileName: (format) => `remark-link-meta.${format}.js`,
    },
  },
});
