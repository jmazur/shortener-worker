import { findDestination } from '../src/find_destination';

beforeEach(() => {
  const env = getMiniflareBindings();
  globalThis.KV = env.KV
  globalThis.FALLBACK_URL = env.FALLBACK_URL
  globalThis.KEY_LENGTH = parseInt(env.KEY_LENGTH)
  globalThis.WRITE_KEY = env.WRITE_KEY
});

describe('findDestination', () => {
  test('returns the default destination when no key matches', async () => {
    globalThis.FALLBACK_URL = "https://fallback.dev/"
    const key: string = "/aaa"

    const result: Destination = await findDestination(key)

    expect(result.url).toBe("https://fallback.dev/")
  })

  test('redirects to destination when key matches', async () => {
    const destination: Destination = { url: 'https://domain.xyz/yes' }
    await globalThis.KV.put('/bbb', JSON.stringify(destination))
    const key: string = "/bbb"

    const result: Destination = await findDestination(key)

    expect(result.url).toBe("https://domain.xyz/yes")
  })
})
