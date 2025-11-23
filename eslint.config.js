export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        document: "readonly",
        window: "readonly",
        localStorage: "readonly",
        console: "readonly",
        marked: "readonly",
        hljs: "readonly",
        DOMPurify: "readonly",
        Logger: "readonly",
        ExportManager: "readonly",
        PrintManager: "readonly",
        MarkdownRenderer: "readonly",
        App: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        confirm: "readonly",
        Event: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "off",
      "no-console": "off"
    }
  }
];
