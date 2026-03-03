import path from 'path'

export const enforceComponentFilenameMatch = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce that the default-exported React component name matches the filename.',
    },
    messages: {
      mismatch:
        'Component name "{{componentName}}" does not match the filename "{{filename}}". Rename one to match the other.',
    },
  },
  create(context) {
    const filename = context.getFilename()
    const ext = path.extname(filename)

    // Only apply to .jsx and .tsx files
    if (ext !== '.jsx' && ext !== '.tsx') return {}

    const fileBaseName = path.basename(filename, ext)

    return {
      ExportDefaultDeclaration(node) {
        let componentName = null

        if (
          node.declaration.type === 'FunctionDeclaration' &&
          node.declaration.id
        ) {
          componentName = node.declaration.id.name
        } else if (node.declaration.type === 'Identifier') {
          componentName = node.declaration.name
        } else if (
          node.declaration.type === 'ClassDeclaration' &&
          node.declaration.id
        ) {
          componentName = node.declaration.id.name
        }

        if (componentName && componentName !== fileBaseName) {
          context.report({
            node,
            messageId: 'mismatch',
            data: {
              componentName,
              filename: fileBaseName,
            },
          })
        }
      },
    }
  },
}
