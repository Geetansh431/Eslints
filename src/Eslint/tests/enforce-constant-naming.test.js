import { RuleTester } from 'eslint'
import { test } from 'vitest'
import { enforceConstantNaming } from '../Custom-Rules/enforce-constant-naming'

const tester = new RuleTester({
    languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
})

test('enforce-constant-naming', () => {
    tester.run('enforce-constant-naming', enforceConstantNaming, {
        valid: [
            // Valid UPPER_SNAKE_CASE constants
            {
                code: `const MAX_SIZE = 100`,
            },
            {
                code: `const API_KEY = 'secret'`,
            },
            {
                code: `const DEFAULT_TIMEOUT = 5000`,
            },
            // Function declarations are allowed
            {
                code: `const myFunction = () => {}`,
            },
            {
                code: `const handleClick = function() {}`,
            },
            // Class declarations are allowed
            {
                code: `const MyClass = class {}`,
            },
            // Private constants starting with underscore
            {
                code: `const _INTERNAL_VALUE = 42`,
            },
            // Let and var declarations are ignored
            {
                code: `let myVariable = 10`,
            },
            {
                code: `var someVar = 'test'`,
            },
        ],

        invalid: [
            // camelCase constant
            {
                code: `const maxSize = 100`,
                errors: [
                    {
                        message:
                            "Constant 'maxSize' should follow UPPER_SNAKE_CASE naming convention (e.g., MAX_SIZE, API_KEY)",
                    },
                ],
            },
            // PascalCase constant
            {
                code: `const ApiKey = 'secret'`,
                errors: [
                    {
                        message:
                            "Constant 'ApiKey' should follow UPPER_SNAKE_CASE naming convention (e.g., MAX_SIZE, API_KEY)",
                    },
                ],
            },
            // snake_case constant
            {
                code: `const default_timeout = 5000`,
                errors: [
                    {
                        message:
                            "Constant 'default_timeout' should follow UPPER_SNAKE_CASE naming convention (e.g., MAX_SIZE, API_KEY)",
                    },
                ],
            },
            // Multiple declarations in one statement
            {
                code: `const MAX_SIZE = 100, minSize = 10`,
                errors: [
                    {
                        message:
                            "Constant 'minSize' should follow UPPER_SNAKE_CASE naming convention (e.g., MAX_SIZE, API_KEY)",
                    },
                ],
            },
        ],
    })
})
