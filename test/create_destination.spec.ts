import { jest } from '@jest/globals';
import { HttpError } from '@curveball/http-errors';
import { createDestination, generateKey } from '../src/create_destination';

jest.unstable_mockModule('nanoid', () => ({
  nanoid: (length: number) => { return 'x'.repeat(length) },
}));

beforeEach(() => {
  const env = getMiniflareBindings();
  globalThis.KV = env.KV
  globalThis.FALLBACK_URL = env.FALLBACK_URL
  globalThis.KEY_LENGTH = parseInt(env.KEY_LENGTH)
  globalThis.WRITE_KEY = env.WRITE_KEY
});

describe('createDestination', () => {
  test('throws an error when the write key is incorrect', async () => {
    globalThis.WRITE_KEY = "aaa"
    const request: DestinationRequest = { url: "https://test.com",
                                          writeKey: "bbb" }
    let thrownError;

    try {
      await createDestination(request)
      fail('No Exception Thrown')
    } catch(error) {
      thrownError = error as HttpError;
      expect(thrownError.httpStatus).toBe(401)
    }
  })

  test('throws an error when the write key has not been changed', async () => {
    const request: DestinationRequest = { url: "https://test.com",
                                          writeKey: "bbb" }
    let thrownError;

    try {
      await createDestination(request)
      fail('No Exception Thrown')
    } catch(error) {
      thrownError = error as HttpError;
      expect(thrownError.httpStatus).toBe(503)
    }
  })

  test('creates a destination in the KV store', async () => {
    globalThis.WRITE_KEY = "aaa"
    const request: DestinationRequest = { url: "https://test.com",
                                          writeKey: "aaa" }

    const destination: Destination = await createDestination(request)
    const result: string | null = await globalThis.KV.get(destination.key as string)
    const resultJson: Destination = JSON.parse(result as string)

    expect(resultJson.url).toBe("https://test.com")
  })

  test('returns a destination response', async () => {
    globalThis.WRITE_KEY = "aaa"
    const request: DestinationRequest = { url: "https://test.com",
                                          writeKey: "aaa" }

    const result: Destination = await createDestination(request)

    expect(result.url).toBe("https://test.com")
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
