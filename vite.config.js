import react from "@vitejs/plugin-react-swc"
import * as path from "path"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: [
      { find: "assets", replacement: path.resolve(__dirname, "src/assets") },
      { find: "config", replacement: path.resolve(__dirname, "src/config") },
      { find: "guards", replacement: path.resolve(__dirname, "src/guards") },
      { find: "hooks", replacement: path.resolve(__dirname, "src/hooks") },
      { find: "layouts", replacement: path.resolve(__dirname, "src/layouts") },
      { find: "routes", replacement: path.resolve(__dirname, "src/routes") },
      { find: "pages", replacement: path.resolve(__dirname, "src/pages") },
      { find: "providers", replacement: path.resolve(__dirname, "src/providers") },
      { find: "@redux", replacement: path.resolve(__dirname, "src/redux") },
      { find: "theme", replacement: path.resolve(__dirname, "src/theme") },
      { find: "utils", replacement: path.resolve(__dirname, "src/utils") },
    ],
  },
  build: {
    outDir: "build",
  },
})
