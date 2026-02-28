import { RuleTester } from 'eslint'
import { test } from 'vitest'
import { noBarrelFiles } from '../Custom-Rules/no-barrel-files'

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

test('no-barrel-files', () => {
  tester.run('no-barrel-files', noBarrelFiles, {
    valid: [
      // Regular import — not a barrel
      {
        code: `import { foo } from './foo'`,
      },
      // Named export of a local declaration — not a barrel
      {
        code: `export const foo = 1`,
      },
      // Importing something and NOT re-exporting it
      {
        code: `import { foo } from './foo'; const bar = foo + 1; export { bar }`,
      },
      // Export default of a value (not re-export) — allowed by this rule
      {
        code: `export default function foo() {}`,
      },
    ],

    invalid: [
      // export { foo } from './fileName' — direct re-export (barrel)
      {
        code: `export { foo } from './foo'`,
        errors: [{ message: 'Avoid using barrel files' }],
      },
      // import then immediately re-export the same name
      {
        code: `import { foo } from './foo'; export { foo }`,
        errors: [{ message: 'Avoid using barrel files' }],
      },
      // Multiple names re-exported from source
      {
        code: `export { foo, bar } from './utils'`,
        errors: [{ message: 'Avoid using barrel files' }],
      },
      // import multiple, re-export one of them
      {
        code: `import { foo, bar } from './utils'; export { foo }`,
        errors: [{ message: 'Avoid using barrel files' }],
      },
    ],
  })
})
