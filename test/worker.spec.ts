import { handleRequest } from '../src/worker';
import { HttpError } from '@curveball/http-errors';

const env = getMiniflareBindings();

describe('handleRequest', () => {
  test('redirects to fallback page when no key matches', async () => {
    env.FALLBACK_URL = 'https://test.dev/'
    const request = new Request('http://localhost/asdf')

    const result = await handleRequest(request, env)

    expect(result.status).toBe(301)
    expect(result.headers.get("Location")).toBe("https://test.dev/")
  })

  test('redirects to destination when key matches', async () => {
    const destination: Destination = { url: 'https://domain.xyz/yes' }
    await env.KV.put('/aaa', JSON.stringify(destination))
    const request = new Request('http://localhost/aaa')

    const result = await handleRequest(request, env)

    expect(result.status).toBe(301)
    expect(result.headers.get('Location')).toBe('https://domain.xyz/yes')
  })

  test('returns a 501 error when the method is unsupported', async () => {
    const request = new Request('http://localhost/asdf', { method: 'POST' })
    let thrownError;

    try {
      await handleRequest(request, env)
      fail('No Exception Thrown')
    } catch(error) {
      thrownError = error as HttpError;
      expect(thrownError.httpStatus).toBe(501)
    }
  })
})
