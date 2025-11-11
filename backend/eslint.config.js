import globals from "globals";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Reglas básicas
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "no-console": "off",
      "prefer-const": "warn",
      "no-var": "error",

      // Permitir console.log en backend
      "no-undef": "error",
    },
  },
  {
    ignores: ["node_modules/", "dist/"],
  },
];
