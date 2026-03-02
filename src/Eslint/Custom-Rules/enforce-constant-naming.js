export const enforceConstantNaming = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce that module-level constants follow UPPER_SNAKE_CASE naming convention',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode

    return {
      VariableDeclaration(node) {
        // Only check const declarations at module scope
        if (node.kind !== 'const') return
        if (sourceCode.getScope(node).type !== 'module') return

        node.declarations.forEach((declaration) => {
          if (!declaration.id || declaration.id.type !== 'Identifier') return

          const name = declaration.id.name
          const value = declaration.init

          // Skip function declarations and class declarations
          if (
            value?.type === 'FunctionExpression' ||
            value?.type === 'ArrowFunctionExpression' ||
            value?.type === 'ClassExpression'
          ) {
            return
          }

          // Check if the constant follows UPPER_SNAKE_CASE
          const isValidConstantName = /^[A-Z][A-Z0-9_]*$/.test(name)

          if (!isValidConstantName && !name.startsWith('_')) {
            context.report({
              node: declaration.id,
              message: `Constant '${name}' should follow UPPER_SNAKE_CASE naming convention (e.g., MAX_SIZE, API_KEY)`,
            })
          }
        })
      },
    }
  },
}
