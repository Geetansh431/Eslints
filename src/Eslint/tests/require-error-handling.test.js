import { RuleTester } from 'eslint'
import { test } from 'vitest'
import { requireErrorHandling } from '../Custom-Rules/require-error-handling.js'

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

test('require-error-handling', () => {
  tester.run('require-error-handling', requireErrorHandling, {
    valid: [
      // Named async function with try/catch
      {
        code: `async function fetchData() { try { await fetch('/api') } catch (e) { console.error(e) } }`,
      },
      // Async arrow function assigned to variable, with try/catch
      {
        code: `const load = async () => { try { await getData() } catch (err) { handleError(err) } }`,
      },
      // Async function returning a .catch() Promise
      {
        code: `async function getData() { return fetch('/api').catch(console.error) }`,
      },
      // Async function returning .then(onFulfilled, onRejected)
      {
        code: `async function getData() { return fetch('/api').then(res => res.json(), err => null) }`,
      },
      // Non-async function — should be ignored
      {
        code: `function syncFn() { return 42 }`,
      },
      // Async arrow with expression body — skipped (no block to place try/catch)
      {
        code: `const fn = async () => fetch('/api')`,
      },
      // Async method in object with try/catch
      {
        code: `const obj = { async save() { try { await db.save() } catch(e) {} } }`,
      },
      // Async class method with try/catch
      {
        code: `class Svc { async load() { try { await api.get() } catch(e) {} } }`,
      },
      // Expression-body arrow nested inside a block — the outer block-body arrow has try/catch
      {
        code: `const run = async () => { try { await Promise.all([1,2].map(async (x) => x)) } catch(e) {} }`,
      },
    ],

    invalid: [
      // Named async function without try/catch
      {
        code: `async function fetchData() { await fetch('/api') }`,
        errors: [{ messageId: 'missingErrorHandling' }],
      },
      // Async arrow (block body) without try/catch
      {
        code: `const load = async () => { await getData() }`,
        errors: [{ messageId: 'missingErrorHandling' }],
      },
      // Async function returning bare promise (no .catch)
      {
        code: `async function getData() { return fetch('/api') }`,
        errors: [{ messageId: 'missingErrorHandling' }],
      },
      // Async method in object without try/catch
      {
        code: `const obj = { async save() { await db.save() } }`,
        errors: [{ messageId: 'missingErrorHandling' }],
      },
      // Async class method without try/catch
      {
        code: `class Svc { async load() { await api.get() } }`,
        errors: [{ messageId: 'missingErrorHandling' }],
      },
      // .then with only one argument — not fully handled
      {
        code: `async function getData() { return fetch('/api').then(res => res.json()) }`,
        errors: [{ messageId: 'missingErrorHandling' }],
      },
    ],
  })
})
