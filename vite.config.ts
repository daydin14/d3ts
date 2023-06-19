import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    cors: true,
  },
  base: "/",
  build: {
    outDir: "build",
    minify: false,
    sourcemap: true,
    rollupOptions: {
      input: "src/main.tsx",
      plugins: [react()],
    },
    modulePreload: {
      polyfill: true,
    },
    // watch: {
    //   include: 'src/**',
    //   exclude: 'node_modules/**',
    // },
  },
  preview: {
    host: "localhost",
    port: 8000,
    strictPort: true,
    https: false,
    cors: true,
  },
});
