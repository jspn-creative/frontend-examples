import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: { adapter: adapter() },
  vitePlugin: {
    inspector: {
      showToggleButton: "always",
      toggleButtonPos: "bottom-right",

      customStyles: `
        .svelte-inspector-toggle-button {
          background-color: #000;
          color: #fff;
        }
      `,
    },
  },
};

export default config;
