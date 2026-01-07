import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSvgr } from '@rsbuild/plugin-svgr';

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginSvgr({
      svgrOptions: {
        svgo: true,
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                },
              },
            },
          ],
        },
      },
    }),
  ],
  html: {
    title: 'subway',
    favicon: './public/favicon.svg',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'source'),
      '@components': resolve(__dirname, 'context/components'),
      '@store': resolve(__dirname, 'context/store'),
      '@context': resolve(__dirname, 'context/context'),
      '@assets': resolve(__dirname, 'context/assets'),
    },
  },
});