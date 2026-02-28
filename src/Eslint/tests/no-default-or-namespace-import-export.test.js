import { RuleTester } from 'eslint'
import { test } from 'vitest'
import { noDefaultOrNamespaceImportExport } from '../Custom-Rules/no-default-or-namespace-import-export.js'

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

test('no-default-or-namespace-import-export', () => {
  tester.run('no-default-or-namespace-import-export', noDefaultOrNamespaceImportExport, {
    valid: [
      // Named import — allowed
      {
        code: `import { foo } from './foo'`,
      },
      // Named export — allowed
      {
        code: `export const foo = 1`,
      },
      // Default export of a function — allowed (only object literal is banned)
      {
        code: `export default function foo() {}`,
      },
      // Default export of a class — allowed
      {
        code: `export default class Foo {}`,
      },
      // Default export of an identifier — allowed
      {
        code: `const foo = 1; export default foo`,
      },
      // Named re-export — allowed
      {
        code: `export { foo, bar } from './module'`,
      },
    ],

    invalid: [
      // export * from './module' — star export
      {
        code: `export * from './module'`,
        errors: [{ messageId: 'noStarExport' }],
      },
      // import * as foo — namespace import
      {
        code: `import * as foo from './module'`,
        errors: [{ messageId: 'noStarImport' }],
      },
      // export default { ... } — anonymous object default export
      {
        code: `export default { foo: 1, bar: 2 }`,
        errors: [{ messageId: 'noDefaultObjectExport' }],
      },
      // export default {} — empty object
      {
        code: `export default {}`,
        errors: [{ messageId: 'noDefaultObjectExport' }],
      },
      // import * as with alias
      {
        code: `import * as utils from '../utils'`,
        errors: [{ messageId: 'noStarImport' }],
      },
      // export * with alias (export * as ns from ...)
      {
        code: `export * as ns from './module'`,
        errors: [{ messageId: 'noStarExport' }],
      },
    ],
  })
})
