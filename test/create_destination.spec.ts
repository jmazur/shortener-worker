import { expect, jest, test } from '@jest/globals';
import { createDestination, generateKey } from '../src/create_destination';

jest.unstable_mockModule('nanoid', () => ({
  nanoid: (length: number) => { return 'x'.repeat(length) },
}));

const nanoid = await import('nanoid');

beforeEach(() => {
  const env = getMiniflareBindings();
  globalThis.KV = env.KV
  globalThis.FALLBACK_URL = env.FALLBACK_URL
  globalThis.KEY_LENGTH = parseInt(env.KEY_LENGTH)
  globalThis.WRITE_KEY = env.WRITE_KEY
});

describe('createDestination', () => {
  test('returns the default destination when no key matches', async () => {

  })
})

describe('generateKey', () => {
  test('creates a key for the specified length', async () => {
    const length: number = 5

    const result: string = await generateKey(length)

    expect(result.length).toBe(5)
  })

  test('creates a longer key if the first key is already taken', async () => {
    const length: number = 5
    await globalThis.KV.put('xxxxx', "")

    const result: string = await generateKey(length)

    expect(result.length).toBe(6)
  })
})
