import { RuleTester } from 'eslint'
import { test } from 'vitest'
import { preferTypeOverInterface } from '../Custom-Rules/prefer-type-over-interface'
import parser from '@typescript-eslint/parser'

const tester = new RuleTester({
    languageOptions: {
        parser,
        ecmaVersion: 2020,
        sourceType: 'module',
    },
})

test('prefer-type-over-interface', () => {
    tester.run('prefer-type-over-interface', preferTypeOverInterface, {
        valid: [
            { code: `type User = { name: string; age: number }` },
            { code: `type ID = string | number` },
        ],
        invalid: [
            {
                code: `interface User { name: string; age: number }`,
                output: `type User = { name: string; age: number }`,
                errors: [{ message: 'Prefer `type` over `interface`. Use a type alias instead.' }],
            },
            {
                code: `interface Empty {}`,
                output: `type Empty = {}`,
                errors: [{ message: 'Prefer `type` over `interface`. Use a type alias instead.' }],
            },
            {
                code: `interface WithGenerics<T> { value: T }`,
                output: `type WithGenerics<T> = { value: T }`,
                errors: [{ message: 'Prefer `type` over `interface`. Use a type alias instead.' }],
            },
        ],
    })
})
