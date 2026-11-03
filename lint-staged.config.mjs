// @ts-check

/**
 * @type {Record<string, (filenames: string[]) => string | string[]>}
 */
const rules = {
  "**/*.{json,md,css,html,yml,yaml,mjs}": (filenames) => [
    `pnpm prettier --write ${filenames.join(" ")}`,
  ],
  "**/*.{js,jsx,ts,tsx}": (filenames) => [
    `pnpm prettier --write ${filenames.join(" ")}`,
    `eslint --cache --fix --fix-type layout --max-warnings=25 ${filenames.map((f) => `"${f}"`).join(" ")}`,
  ],
};

export default rules;
