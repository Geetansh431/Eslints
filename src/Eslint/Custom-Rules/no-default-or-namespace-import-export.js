export const noDefaultOrNamespaceImportExport = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow wildcard (import/export *) and default object exports - they block tree-shaking and bloat bundles.",
    },
    messages: {
      noStarExport:
        'Avoid `export *` re-exports - tree-shaking cannot drop unused code. Re-export only what you need: `export { Foo, Bar } from "./module";`.',
      noStarImport:
        'Avoid `import * as foo` namespace imports - they pull in the whole module and defeat tree-shaking. Import only the names you use: `import { Foo } from "module";`.',
      noDefaultObjectExport:
        "Avoid anonymous object default exports - they hide member names and block tree-shaking. Use named exports instead: `export const Foo = { ... };`.",
    },
  },
  create(context) {
    // Helper to reduce repetition of context.report calls
    const reportViolation = (node, messageId) => {
      context.report({ node, messageId });
    };

    return {
      // export * from './fileName' => Handle Star Exports
      ExportAllDeclaration(node) {
        reportViolation(node, "noStarExport");
      },

      // import * as foo => Handle Star Imports
      ImportDeclaration(node) {
        const hasNamespaceSpecifier = node.specifiers.some(
          (specifier) => specifier.type === "ImportNamespaceSpecifier",
        );

        if (hasNamespaceSpecifier) {
          reportViolation(node, "noStarImport");
        }
      },

      // export default { ... } - hides member names from tree-shaking
      ExportDefaultDeclaration(node) {
        if (node.declaration.type === "ObjectExpression") {
          reportViolation(node, "noDefaultObjectExport");
        }
      },
    };
  },
};
