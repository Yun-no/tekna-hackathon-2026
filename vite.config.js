import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // For GitHub Pages: change 'skogkontroll' to your repo name
  // For custom domain or root deploy, set base: '/'
  base: "/skogkontroll/",
});
