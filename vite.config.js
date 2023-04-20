import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import * as path from "path"
import envCompatible from "vite-plugin-env-compatible"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), envCompatible],
  resolve: {
    alias: [
      { find: "assets", replacement: path.resolve(__dirname, "src/assets") },
      { find: "config", replacement: path.resolve(__dirname, "src/config") },
      { find: "guards", replacement: path.resolve(__dirname, "src/guards") },
      { find: "hooks", replacement: path.resolve(__dirname, "src/hooks") },
      { find: "layouts", replacement: path.resolve(__dirname, "src/layouts") },
      { find: "routes", replacement: path.resolve(__dirname, "src/routes") },
      { find: "pages", replacement: path.resolve(__dirname, "src/pages") },
      { find: "@redux", replacement: path.resolve(__dirname, "src/redux") },
      { find: "theme", replacement: path.resolve(__dirname, "src/theme") },
      { find: "utils", replacement: path.resolve(__dirname, "src/utils") },
    ],
  },
})
