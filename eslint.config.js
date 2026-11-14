import js from "@eslint/js";
import reactQueryPlugin from "@tanstack/eslint-plugin-query";
import vitest from "@vitest/eslint-plugin";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginImport from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import testingLibrary from "eslint-plugin-testing-library";
import globals from "globals";
import tseslint from "typescript-eslint";

/** baseConfig */
const baseConfig = defineConfig(
  { ignores: ["dist", "coverage", "node_modules"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    files: ["**/*.js"],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    files: ["scripts/**/*.mjs", "api/**/*.ts", "vite.api-routes.ts"],
    languageOptions: { globals: globals.node },
  },
);

/** reactConfig */
const reactConfig = defineConfig(
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    ...react.configs.flat.recommended,
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      "react-hooks": reactHooks,
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      // React Compiler rules off
      "react-hooks/refs": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/incompatible-library": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
);

/** reactQueryConfig */
const reactQueryConfig = defineConfig(
  ...reactQueryPlugin.configs["flat/recommended"],
);

/** fsdImportConfig */
const fsdImportConfig = defineConfig({
  ...pluginImport.flatConfigs.recommended,
  settings: {
    "import/resolver": {
      typescript: true,
      node: true,
    },
  },
  rules: {
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "object",
        ],
        pathGroups: [
          { pattern: "@/shared/**", group: "internal", position: "before" },
          { pattern: "@/entities/**", group: "internal", position: "before" },
          { pattern: "@/features/**", group: "internal", position: "before" },
          { pattern: "@/widgets/**", group: "internal", position: "before" },
          { pattern: "@/pages/**", group: "internal", position: "before" },
        ],
        pathGroupsExcludedImportTypes: ["builtin"],
        "newlines-between": "never",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [
              "@/shared/*/*/**",
              "@/entities/*/**",
              "@/features/*/**",
              "@/widgets/*/**",
              "@/pages/*/**",
              "@/app/**",
            ],
            message:
              "Direct access to the internal parts of the module is prohibited",
          },
          {
            group: [
              "../**/shared",
              "../**/entities",
              "../**/features",
              "../**/widgets",
              "../**/pages",
              "../**/app",
            ],
            message: "Prefer absolute imports instead of relatives",
          },
        ],
      },
    ],
  },
});

/** apiConfig — 서버 함수는 FSD 바깥. src 의 계약·샘플을 상대 경로로 가져오는 것이 의도된 사용 */
const apiConfig = defineConfig({
  files: ["api/**/*.ts"],
  rules: { "no-restricted-imports": "off" },
});

/**
 * apiReachableConfig — api/ 가 가져오는 src 파일. Vercel 함수는 Node ESM 그대로 돌아서
 * @/ 별칭·확장자 없는 경로를 못 찾고 500 이 난다. 상대 경로 + .ts 만 허용
 */
const apiReachableConfig = defineConfig({
  files: [
    "src/entities/certificate/certificate.contracts.ts",
    "src/entities/certificate/certificate.types.ts",
    "src/features/*/*.model.ts",
    "src/features/*/*.mock.ts",
    "src/shared/lib/template/*.ts",
    "src/shared/lib/file/file-kind.lib.ts",
  ],
  ignores: ["**/*.test.ts"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            regex: "^@/",
            message:
              "api/ 가 가져오는 파일입니다. Vercel 런타임이 별칭을 못 풀어 500 이 나므로 상대 경로 + .ts 확장자로 import 하세요",
          },
          {
            regex: "^\\.{1,2}/(?!.*\\.ts$)",
            message:
              "api/ 가 가져오는 파일입니다. 상대 import 에 .ts 확장자를 붙이세요 (Node ESM)",
          },
        ],
      },
    ],
  },
});

/** vitestConfig */
const vitestConfig = defineConfig({
  files: ["**/?(*.)+(test|spec).{js,jsx,ts,tsx}"],
  plugins: { vitest },
  languageOptions: {
    globals: {
      ...vitest.environments.env.globals,
    },
  },
  rules: {
    ...vitest.configs.recommended.rules,
    "import/namespace": "off",
  },
});

/** reactTestingLibraryConfig */
const reactTestingLibraryConfig = defineConfig({
  files: ["**/?(*.)+(test|spec).{js,jsx,ts,tsx}"],
  ...testingLibrary.configs["flat/react"],
});

/** prettierConfig */
const prettierConfig = defineConfig(eslintConfigPrettier, {
  rules: {
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
  },
});

export default defineConfig(
  ...baseConfig,
  ...reactConfig,
  ...reactQueryConfig,
  ...fsdImportConfig,
  ...apiConfig,
  ...apiReachableConfig,
  ...vitestConfig,
  ...reactTestingLibraryConfig,
  ...prettierConfig,
);
