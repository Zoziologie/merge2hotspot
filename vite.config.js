import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [vue()],
    base: "/merge2hotspot/",
    define: {
      "import.meta.env.MAPBOX_ACCESS_TOKEN": JSON.stringify(env.MAPBOX_ACCESS_TOKEN ?? ""),
      "import.meta.env.EBIRD_API_KEY": JSON.stringify(env.EBIRD_API_KEY ?? ""),
    },
  };
});
