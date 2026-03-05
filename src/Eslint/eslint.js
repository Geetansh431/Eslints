import { ERROR, WARN } from './constants/constants.js'
import { noDefaultOrNamespaceImportExport } from './Custom-Rules/no-default-or-namespace-import-export.js'
import { noBarrelFiles } from './Custom-Rules/no-barrel-files.js'
import { noDeepRelativeImports } from './Custom-Rules/no-deep-relative-imports.js'
import { enforceConstantNaming } from './Custom-Rules/enforce-constant-naming.js'
import { enforceComponentFilenameMatch } from './Custom-Rules/enforce-component-filename-match.js'
import { requireErrorHandling } from './Custom-Rules/require-error-handling.js'
import { noNestedTernary } from './Custom-Rules/no-nested-ternary.js'

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
    'custom/enforce-constant-naming': ERROR,
    'custom/enforce-component-filename-match': ERROR,
    'custom/require-error-handling': ERROR,
    'custom/no-nested-ternary': ERROR,
  }
}

export const customPlugin = {
  rules: {
    'no-default-or-namespace-import-export': noDefaultOrNamespaceImportExport,
    'no-barrel-files': noBarrelFiles,
    'no-deep-relative-imports': noDeepRelativeImports,
    'enforce-constant-naming': enforceConstantNaming,
    'enforce-component-filename-match': enforceComponentFilenameMatch,
    'require-error-handling': requireErrorHandling,
    'no-nested-ternary': noNestedTernary,
  },
}

export function getBaseRules() {
  return {
    ...getTypeScriptRules(),
    ...getBaseEslintRules(),
    ...getCustomRules(),
  }
}