import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";
import html from "@html-eslint/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"]
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.browser }
  },
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"]
  },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"]
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"]
  },
  {
    // @html-eslint/eslint-plugin
    ...html.configs["flat/recommended"],
    files: ["**/*.html"],
    rules: {
      // ...html.configs["flat/recommended"].rules,
      "@html-eslint/no-duplicate-id": "warn",
      "@html-eslint/no-obsolete-tags": "error", // default
      "@html-eslint/require-button-type": "warn",
      "@html-eslint/require-closing-tags": ["error", { selfClosing: "always" }],
      "@html-eslint/use-baseline": ["warn", { available: "newly" }],
      "@html-eslint/no-multiple-h1": "error", // default
      "@html-eslint/lowercase": "error",
      "@html-eslint/no-extra-spacing-attrs": [
        "error",
        {
          enforceBeforeSelfClose: true,
          disallowMissing: true,
          disallowTabs: true,
          disallowInAssignment: true
        }
      ],
      "@html-eslint/no-multiple-empty-lines": ["error", { max: 1 }],
      "@html-eslint/no-trailing-spaces": "error"
    }
  },
  eslintConfigPrettier,
  {
    rules: {
      "prefer-const": "warn",
      eqeqeq: ["warn", "smart"], // "always", { null: "ignore" }],
      "no-var": "error",
      "default-case": "warn",
      "no-unused-vars": "warn"
    }
  },
  {
    ignores: ["package-lock.json"]
  }
]);
