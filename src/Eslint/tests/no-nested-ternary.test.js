import { RuleTester } from 'eslint'
import { test } from 'vitest'
import { noNestedTernary } from '../Custom-Rules/no-nested-ternary'

const tester = new RuleTester({
    languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
})

test('no-nested-ternary', () => {
    tester.run('no-nested-ternary', noNestedTernary, {
        valid: [
            // Simple ternary
            { code: `const x = a ? b : c` },
            // If/else instead of nested ternary
            { code: `const x = a ? b : (c ? d : e)` },
        ],
        invalid: [
            // Nested ternary in consequent
            {
                code: `const x = a ? b ? c : d : e`,
                errors: [{ message: 'Do not nest ternary expressions' }],
            },
            // Nested ternary in alternate
            {
                code: `const x = a ? b : c ? d : e`,
                errors: [{ message: 'Do not nest ternary expressions' }],
            },
            // Double nesting — two errors
            {
                code: `const x = a ? b ? c : d : e ? f : g`,
                errors: [
                    { message: 'Do not nest ternary expressions' },
                    { message: 'Do not nest ternary expressions' },
                ],
            },
        ],
    })
})
