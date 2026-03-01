import { RuleTester } from 'eslint'
import { test } from 'vitest'
import { noDeepRelativeImports } from '../Custom-Rules/no-deep-relative-imports.js'

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

test('no-deep-relative-imports', () => {
  tester.run('no-deep-relative-imports', noDeepRelativeImports, {
    valid: [
      // Same-directory import — allowed
      {
        code: `import { foo } from './foo'`,
      },
      // One level up — allowed
      {
        code: `import { foo } from '../foo'`,
      },
      // Package/alias import — allowed
      {
        code: `import { foo } from '@/utils/foo'`,
      },
      // Node built-in — allowed
      {
        code: `import { readFile } from 'fs'`,
      },
    ],

    invalid: [
      // Two levels up
      {
        code: `import { foo } from '../../foo'`,
        errors: [{ messageId: 'noDeepRelativeImport' }],
      },
      // Three levels up
      {
        code: `import { bar } from '../../../utils/bar'`,
        errors: [{ messageId: 'noDeepRelativeImport' }],
      },
      // Deep with nested path
      {
        code: `import { baz } from '../../components/baz'`,
        errors: [{ messageId: 'noDeepRelativeImport' }],
      },
    ],
  })
})
