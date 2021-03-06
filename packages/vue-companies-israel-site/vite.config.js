import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import markdown, { Mode } from "vite-plugin-markdown";

console.log(path.resolve(__dirname, "./src"));

// https://vitejs.dev/config/
// https://github.com/Tarektouati/vue-use-web/issues/345
// https://github.com/vitejs/vite/issues/279#issuecomment-782871114
export default defineConfig({
  base: "./",
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/variables";`,
      },
    },
  },
  // https://github.com/Tarektouati/vue-use-web/issues/345
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
      {
        find: "@vue/composition-api",
        replacement: "vue",
      },
    ],
  },
  plugins: [vue(), markdown({ mode: Mode.HTML })],
});
