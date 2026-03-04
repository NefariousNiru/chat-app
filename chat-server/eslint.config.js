import js from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";

export default [
  // Ignore build artifacts
  { ignores: ["dist/**", "node_modules/**", "coverage/**"] },

  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript recommended rules (no type-checking)
  ...tseslint.configs.recommended,

  // Your project rules
  {
    files: ["src/**/*.ts"],
    plugins: { prettier: prettierPlugin },
    rules: {
      // Make formatting issues show up as lint errors
      "prettier/prettier": "error",

      // Practical TS hygiene
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
