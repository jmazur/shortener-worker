import worker, { handleRequest } from '../src/worker';
import { HttpError } from '@curveball/http-errors';

beforeEach(() => {
  const env = getMiniflareBindings()
  globalThis.KV = env.KV
  globalThis.FALLBACK_URL = env.FALLBACK_URL
  globalThis.KEY_LENGTH = parseInt(env.KEY_LENGTH)
  globalThis.WRITE_KEY = env.WRITE_KEY
});

describe('default fetch', () => {
  test('assigns env to global variables', async () => {
    const request = new Request('http://localhost/aaa')
    let env: Bindings = getMiniflareBindings()
    env.FALLBACK_URL = "https://new.dev"
    env.KEY_LENGTH = "44"
    env.WRITE_KEY = "abc"

    await worker.fetch(request, env)

    expect(globalThis.FALLBACK_URL).toBe("https://new.dev")
    expect(globalThis.KEY_LENGTH).toBe(44)
    expect(globalThis.WRITE_KEY).toBe("abc")
  })

  test('returns a valid response', async () => {
    const env: Bindings = getMiniflareBindings()
    const request = new Request('http://localhost/aaa')

    const result: Response = await worker.fetch(request, env)

    expect(result).toBeInstanceOf(Response)
  })

  test('returns an error response with http status', async () => {
    const env: Bindings = getMiniflareBindings()
    const request = new Request('http://localhost/fff', { method: 'POST' })

    const result: Response = await worker.fetch(request, env)

    expect(result).toBeInstanceOf(Response)
    expect(result.status).toBe(501)
  })
})

describe('handleRequest', () => {
  test('redirects to destination for GET requests', async () => {
    const destination: Destination = { url: 'https://domain.xyz/yes' }
    await globalThis.KV.put('/aaa', JSON.stringify(destination))
    const request = new Request('http://localhost/aaa')

    const result = await handleRequest(request)

    expect(result.status).toBe(301)
    expect(result.headers.get('Location')).toBe('https://domain.xyz/yes')
  })

  test('returns a created response for PUT requests', async () => {
    globalThis.WRITE_KEY = "xx"
    const destinationRequest: DestinationRequest = {
      url: "http://localhost/new",
      writeKey: "xx"
    }
    const request = new Request('http://localhost', {
      method: 'PUT',
      body: JSON.stringify(destinationRequest)
    })

    const result = await handleRequest(request)

    expect(result.status).toBe(201)
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
