/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  trailingComma: "all",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  printWidth: 80,
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
