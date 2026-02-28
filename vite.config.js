import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/met": {
        target: "https://api.met.no",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/met/, ""),
      },
    },
  },
});
