export const noDeepRelativeImports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow deep relative imports (more than one level up) — use path aliases instead.',
    },
    messages: {
      noDeepRelativeImport:
        'Avoid deep relative imports like "{{source}}". Use a path alias instead.',
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const source = node.source.value
        if (source.startsWith('../../')) {
          context.report({
            node,
            messageId: 'noDeepRelativeImport',
            data: { source },
          })
        }
      },
    }
  },
}
