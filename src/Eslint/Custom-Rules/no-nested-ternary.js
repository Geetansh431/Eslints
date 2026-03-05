export const noNestedTernary = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Disallow nested ternary expressions',
        },
    },
    create(context) {
        return {
            ConditionalExpression(node) {
                const sourceCode = context.getSourceCode()
                const src = sourceCode.getText()

                const isParenthesized = (child) => {
                    const charBefore = src[child.range[0] - 1]
                    return charBefore === '('
                }

                if (node.consequent.type === 'ConditionalExpression') {
                    context.report({
                        node,
                        message: 'Do not nest ternary expressions',
                    })
                }

                if (
                    node.alternate.type === 'ConditionalExpression' &&
                    !isParenthesized(node.alternate)
                ) {
                    context.report({
                        node,
                        message: 'Do not nest ternary expressions',
                    })
                }
            },
        }
    },
}
