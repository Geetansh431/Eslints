export const requireErrorHandling = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require every async function to have a try/catch block or return a handled Promise (.catch()).',
    },
    messages: {
      missingErrorHandling:
        'Async function "{{name}}" must have a try/catch block or a .catch() on the returned Promise.',
    },
  },
  create(context) {
    function getFunctionName(node) {
      if (node.id?.name) return node.id.name
      if (node.parent?.type === 'VariableDeclarator' && node.parent.id?.name)
        return node.parent.id.name
      if (node.parent?.type === 'Property' && node.parent.key?.name)
        return node.parent.key.name
      if (node.parent?.type === 'MethodDefinition' && node.parent.key?.name)
        return node.parent.key.name
      return '<anonymous>'
    }

    function bodyHasTryCatch(node) {
      if (!node.body || node.body.type !== 'BlockStatement') return false
      return node.body.body.some((stmt) => stmt.type === 'TryStatement')
    }

    function bodyReturnsCaughtPromise(node) {
      if (!node.body || node.body.type !== 'BlockStatement') return false
      return node.body.body.some((stmt) => {
        const expr =
          stmt.type === 'ReturnStatement'
            ? stmt.argument
            : stmt.type === 'ExpressionStatement'
              ? stmt.expression
              : null
        return isCaughtPromise(expr)
      })
    }

    function isCaughtPromise(node) {
      if (!node || node.type !== 'CallExpression') return false
      const callee = node.callee
      if (callee.type === 'MemberExpression' && callee.property.name === 'catch')
        return true
      // .then(onFulfilled, onRejected) — two-argument .then counts as handled
      if (
        callee.type === 'MemberExpression' &&
        callee.property.name === 'then' &&
        node.arguments.length >= 2
      )
        return true
      return false
    }

    function isArrowWithExpressionBody(node) {
      return node.type === 'ArrowFunctionExpression' && node.body.type !== 'BlockStatement'
    }

    function checkAsyncFunction(node) {
      if (!node.async) return

      // Arrow functions with expression bodies (e.g. `async () => fetch(...)`)
      // have no block to place try/catch — require a .catch() wrapper at call site,
      // which is outside this node, so we skip them here.
      if (isArrowWithExpressionBody(node)) return

      if (bodyHasTryCatch(node)) return
      if (bodyReturnsCaughtPromise(node)) return

      context.report({
        node,
        messageId: 'missingErrorHandling',
        data: { name: getFunctionName(node) },
      })
    }

    return {
      FunctionDeclaration: checkAsyncFunction,
      FunctionExpression: checkAsyncFunction,
      ArrowFunctionExpression: checkAsyncFunction,
    }
  },
}
