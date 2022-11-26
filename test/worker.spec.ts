import { handleRequest } from '../src/worker';
import { HttpError } from '@curveball/http-errors';

beforeEach(() => {
  const env = getMiniflareBindings();
  globalThis.KV = env.KV
  globalThis.FALLBACK_URL = env.FALLBACK_URL
  globalThis.KEY_LENGTH = parseInt(env.KEY_LENGTH)
  globalThis.WRITE_KEY = env.WRITE_KEY
});

describe('handleRequest', () => {
  test('redirects to fallback page when no key matches', async () => {
    globalThis.FALLBACK_URL = 'https://test.dev/'
    const request = new Request('http://localhost/asdf')

    const result = await handleRequest(request)

    expect(result.status).toBe(301)
    expect(result.headers.get("Location")).toBe("https://test.dev/")
  })

  test('redirects to destination when key matches', async () => {
    const destination: Destination = { url: 'https://domain.xyz/yes' }
    await globalThis.KV.put('/aaa', JSON.stringify(destination))
    const request = new Request('http://localhost/aaa')

    const result = await handleRequest(request)

    expect(result.status).toBe(301)
    expect(result.headers.get('Location')).toBe('https://domain.xyz/yes')
  })

  test('returns a 501 error when the method is unsupported', async () => {
    const request = new Request('http://localhost/asdf', { method: 'POST' })
    let thrownError;

    try {
      await handleRequest(request)
      fail('No Exception Thrown')
    } catch(error) {
      thrownError = error as HttpError;
      expect(thrownError.httpStatus).toBe(501)
    }
  })
})
