import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, existsSync, mkdirSync } from 'fs';

export default defineConfig({
  base: '/dist/',
  plugins: [
    {
      name: 'mirror-devtools-html',
      closeBundle() {
        const srcPanel = resolve(__dirname, 'dist/src/devtools/panel.html');
        const targetPanel = resolve(__dirname, 'dist/panel.html');
        if (existsSync(srcPanel)) {
          copyFileSync(srcPanel, targetPanel);
        }

        // Copy icons to dist/icons
        const distIconsDir = resolve(__dirname, 'dist/icons');
        if (!existsSync(distIconsDir)) {
          mkdirSync(distIconsDir, { recursive: true });
        }
        for (const size of [16, 32, 48, 128]) {
          const srcIcon = resolve(__dirname, `icons/icon-${size}.png`);
          const dstIcon = resolve(__dirname, `dist/icons/icon-${size}.png`);
          if (existsSync(srcIcon)) {
            copyFileSync(srcIcon, dstIcon);
          }
        }
      }
    }
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background/background.ts'),
        content: resolve(__dirname, 'src/content/content.ts'),
        'webmcp-bridge': resolve(__dirname, 'src/content/webmcp-bridge.ts'),
        devtools: resolve(__dirname, 'src/devtools/devtools.html'),
        panel: resolve(__dirname, 'src/devtools/panel.html')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
});
