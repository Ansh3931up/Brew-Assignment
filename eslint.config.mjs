import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Additional ignores
    "scripts/**",
  ]),
  // Custom rules
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "no-console": "warn",
    },
  },
  // Override rules for scripts directory
  {
    files: ["scripts/**/*"],
    rules: {
      "import/extensions": "off",
      "import/no-unresolved": "off",
    },
  },
]);

export default eslintConfig;
