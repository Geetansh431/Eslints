import { RuleTester } from 'eslint'
import { test } from 'vitest'
import { enforceComponentFilenameMatch } from '../Custom-Rules/enforce-component-filename-match.js'

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
})

test('enforce-component-filename-match', () => {
  tester.run('enforce-component-filename-match', enforceComponentFilenameMatch, {
    valid: [
      // Named function matches filename
      {
        code: `export default function Button() { return null }`,
        filename: 'Button.tsx',
      },
      // Identifier reference matches filename
      {
        code: `const Card = () => null; export default Card`,
        filename: 'Card.tsx',
      },
      // Class component matches filename
      {
        code: `export default class Modal extends React.Component { render() { return null } }`,
        filename: 'Modal.tsx',
      },
      // Non-jsx/tsx file — rule does not apply
      {
        code: `export default function anything() {}`,
        filename: 'utils.js',
      },
      // Arrow function without an identifier (anonymous) — not reported
      {
        code: `export default () => null`,
        filename: 'Header.tsx',
      },
    ],

    invalid: [
      // Function name doesn't match filename
      {
        code: `export default function Foo() { return null }`,
        filename: 'Button.tsx',
        errors: [{ messageId: 'mismatch' }],
      },
      // Identifier doesn't match filename
      {
        code: `const Card = () => null; export default Card`,
        filename: 'Button.tsx',
        errors: [{ messageId: 'mismatch' }],
      },
      // Class name doesn't match filename
      {
        code: `export default class Sidebar extends React.Component { render() { return null } }`,
        filename: 'Modal.tsx',
        errors: [{ messageId: 'mismatch' }],
      },
    ],
  })
})