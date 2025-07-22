import { defineConfig } from 'vite';
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [cloudflare()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  server: {
    port: 5173,
  },
});