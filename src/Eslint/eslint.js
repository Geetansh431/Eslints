import { ERROR, WARN } from './constants/constants.js'
import { noDefaultOrNamespaceImportExport } from './Custom-Rules/no-default-or-namespace-import-export.js'
import { noBarrelFiles } from './Custom-Rules/no-barrel-files.js'
import { noDeepRelativeImports } from './Custom-Rules/no-deep-relative-imports.js'

export function getTypeScriptRules() {
  return {
    '@typescript-eslint/no-explicit-any': ERROR,
    '@typescript-eslint/consistent-type-imports': ERROR,
    '@typescript-eslint/consistent-type-exports': ERROR,
    '@typescript-eslint/no-non-null-assertion': ERROR,
    '@typescript-eslint/prefer-nullish-coalescing': ERROR,
  }
}

export function getBaseEslintRules() {
  return {
    'import/no-duplicates': ERROR,
    'import/first': ERROR,
    'import/newline-after-import': ERROR,
    'consistent-return': ERROR,
    'no-unreachable': ERROR,
    'no-var': ERROR,
    'prefer-const': ERROR,
    'no-undef-init': ERROR,
    'no-console': WARN,
  }
}

export function getCustomRules() {
  return {
    'custom/no-default-or-namespace-import-export': ERROR,
    'custom/no-barrel-files': ERROR,
    'custom/no-deep-relative-imports': ERROR,
  }
}

export const customPlugin = {
  rules: {
    'no-default-or-namespace-import-export': noDefaultOrNamespaceImportExport,
    'no-barrel-files': noBarrelFiles,
    'no-deep-relative-imports': noDeepRelativeImports,
  },
}

export function getBaseRules() {
  return {
    ...getTypeScriptRules(),
    ...getBaseEslintRules(),
    ...getCustomRules(),
  }
}