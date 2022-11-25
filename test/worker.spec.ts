import worker, { handleRequest, Destination } from '../src/worker';

const env = getMiniflareBindings();

describe('handleRequest', () => {
  test('should redirect to example page when no key matches', async () => {
    env.FALLBACK_URL = 'https://test.dev/'
    const request = new Request('http://localhost/asdf')

    const result = await handleRequest(request, env)

    expect(result.status).toBe(301)
    expect(result.headers.get("Location")).toBe("https://test.dev/")
  })

  test('should redirect to destination when key matches', async () => {
    const destination: Destination = { url: 'https://domain.xyz/yes' }
    await env.KV.put('/aaa', JSON.stringify(destination))
    const request = new Request('http://localhost/aaa')

    const result = await handleRequest(request, env)

    expect(result.status).toBe(301)
    expect(result.headers.get("Location")).toBe("https://domain.xyz/yes")
  })
})
