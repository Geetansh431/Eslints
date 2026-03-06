export const preferTypeOverInterface = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Prefer type aliases over interfaces',
        },
        fixable: 'code',
    },
    create(context) {
        return {
            TSInterfaceDeclaration(node) {
                context.report({
                    node,
                    message: 'Prefer `type` over `interface`. Use a type alias instead.',
                    fix(fixer) {
                        const sourceCode = context.getSourceCode()
                        const src = sourceCode.getText(node)

                        const name = node.id.name
                        const typeParams = node.typeParameters
                            ? sourceCode.getText(node.typeParameters)
                            : ''
                        const body = sourceCode.getText(node.body)

                        const extendsClause =
                            node.extends && node.extends.length > 0
                                ? ' & ' +
                                  node.extends
                                      .map((e) => sourceCode.getText(e))
                                      .join(' & ')
                                : ''

                        const replacement = `type ${name}${typeParams} = ${body.replace(/;(\s*)$/, '$1')}${extendsClause}`

                        return fixer.replaceText(node, replacement)
                    },
                })
            },
        }
    },
}
