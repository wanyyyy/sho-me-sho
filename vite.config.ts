import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), tsconfigPaths(), svgr()],
  ...(mode === "dev" && {
    build: {
      sourcemap: true,
    },
  }),
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    port: 5173,
  },
  test: {
    include: ["**/*.{test,spec}.(ts|tsx)"],
    maxWorkers: "25%",
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./src/shared/lib/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov", "json"],
      reportsDirectory: "./coverage",
      include: ["src/entities/**", "src/features/**", "src/shared/**"],
      exclude: ["**/*.d.ts", "**/index.ts", "src/shared/lib/test/**"],
    },
  },
}));
