import { createDestination } from "./create_destination.js"
import { findDestination } from "./find_destination.js"
import { NotImplemented } from '@curveball/http-errors';

declare global {
  var KV: KVNamespace
  var FALLBACK_URL: string
  var KEY_LENGTH: number
  var WRITE_KEY: string
}

export default {
  async fetch(request: Request, env: Bindings) {
    globalThis.KV = env.KV
    globalThis.FALLBACK_URL = env.FALLBACK_URL
    globalThis.KEY_LENGTH = parseInt(env.KEY_LENGTH) || 10
    globalThis.WRITE_KEY = env.WRITE_KEY

    return await handleRequest(request).catch(
      (err) => new Response(err.title, { status: err.status })
    )
  }
}

export async function handleRequest(request: Request) {
  const { method, url } = request
  const { pathname } = new URL(url)

  if (method === 'GET') {
    const destination = await findDestination(pathname)
    return Response.redirect(destination.url, 301)
  } else if (method === 'PUT') {
    const { response, status } = await createDestination(await request.json())
    return new Response(response, { status: status })
  } else {
    throw new NotImplemented
  }
}
