import execa from 'execa'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
// import reset from '../../commands/reset'

// test.beforeEach(() => reset({ schemas: true }), 120000)

test('push a basic schema', () => {
  const cwd = resolve(fileURLToPath(new URL(`../../examples/basic`, import.meta.url)))

  const { stdout, stderr, exitCode } = execa.sync('node', ['../../cli.js', 'push-schema'], {
    env: { DEBUG: 'faugra:*' },
    cwd,
  })

  const mergedSchema = `The resulting merged schema:
\ttype User {
\t  username: String! @unique
\t}
\t
\ttype Query {
\t  allUsers: [User!]
\t}`

  expect(stderr).toEqual(expect.not.stringMatching(/error/i))
  expect(stdout).toEqual(expect.not.stringMatching(/error/i))

  expect(stderr).toEqual(expect.stringContaining(mergedSchema))
  expect(stdout.split('\n')[0]).toBe(`Schema imported successfully.`)

  expect(exitCode).toBe(0)
}, 35000)

test('push a modular schema', () => {
  const cwd = resolve(fileURLToPath(new URL(`../../examples/modularized`, import.meta.url)))

  const { stdout, stderr, exitCode } = execa.sync('node', ['../../cli.js', 'push-schema'], {
    env: { DEBUG: 'faugra:*' },
    cwd,
  })

  const mergedSchema = `The resulting merged schema:
\ttype Query {
\t  allPosts: [Post!]
\t
\t
\t  sayHello(name: String!): String! @resolver(name: "sayHello")
\t
\t}
\t
\ttype User {
\t  name: String!
\t}
\t
\t
\ttype Post {
\t  title: String!
\t  content: String!
\t  author: User!
\t}`

  expect(stderr).toEqual(expect.not.stringMatching(/error/i))
  expect(stdout).toEqual(expect.not.stringMatching(/error/i))

  expect(stderr).toEqual(expect.stringContaining(mergedSchema))
  expect(stdout.split('\n')[0]).toBe(`Schema imported successfully.`)

  expect(exitCode).toBe(0)
}, 35000)
