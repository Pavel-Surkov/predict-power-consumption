import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { readFileSync } from "fs";

export default defineConfig({
  assetsInclude: ["**/*.numbers"],
  plugins: [
    sveltekit(),
    {
      // this plugin handles ?b64 tags
      name: "vite-b64-plugin",
      transform(_, id) {
        if (!id.match(/\?b64$/)) return;
        var path = id.replace(/\?b64/, "");
        var data = readFileSync(path, "base64");
        return `export default '${data}'`;
      },
    },
  ],
});
