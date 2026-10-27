import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
      // Ensure single React instance
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "@emotion/react": path.resolve(__dirname, "./node_modules/@emotion/react"),
      "@emotion/styled": path.resolve(__dirname, "./node_modules/@emotion/styled"),
    },
    dedupe: ["react", "react-dom", "@emotion/react", "@emotion/styled"],
  },
  server: {
    port: 3000,
    open: true,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "@emotion/react", "@emotion/styled"],
  },
});
