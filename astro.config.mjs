import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  site: "https://mederak.app",
  srcDir: "src",
  outDir: "dist",
  publicDir: "public",
  build: {
    format: "preserve"
  }
});
