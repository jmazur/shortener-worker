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
    globalThis.KEY_LENGTH = parseInt(env.KEY_LENGTH)
    globalThis.WRITE_KEY = env.WRITE_KEY

    return await handleRequest(request).catch(
      (err) => new Response(err.title, { status: err.httpStatus })
    )
  }
}

export async function handleRequest(request: Request) {
  const { method, url } = request
  const { pathname } = new URL(url)

  if (method === 'GET') {
    const destination: Destination = await findDestination(pathname)
    return Response.redirect(destination.url, 301)
  } else if (method === 'PUT') {
    const destinationRequest: DestinationRequest = await request.json()
    const destination: Destination = await createDestination(destinationRequest)
    return new Response(JSON.stringify(destination), { status: 201 })
  } else {
    throw new NotImplemented
  }
}
