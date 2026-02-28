export const noBarrelFiles = {
  meta: {
    type: 'problem', // Categorizes this as a problem rule (not style/suggestion)
    docs: {
      description:
        'Avoid barrel files, they slow down performance, and cause large module graphs with modules that go unused',
    },
  },
  create(context) {
    const importedNames = new Set()
    const reportBarrel = (node, message = 'Avoid using barrel files') => {
      context.report({ node, message })
    }

    return {
      ImportDeclaration(node) {
        node.specifiers?.forEach((spec) => {
          if (spec.local?.name) importedNames.add(spec.local.name)
        })
      },

      ExportNamedDeclaration(node) {
        if (node.source) {
          // export {foo} from './fileName'
          reportBarrel(node)
        } else if (node.specifiers?.some((spec) => importedNames.has(spec.local?.name))) {
          // import {foo}; export {foo}
          reportBarrel(node)
        }
      },
    }
  },
}