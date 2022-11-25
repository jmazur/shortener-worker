import { createDestination } from "./create_destination.js"
import { findDestination } from "./find_destination.js"

export interface Destination {
  url: string
}

export let KV: KVNamespace
export let FALLBACK_URL: string
export let KEY_LENGTH: number

export default {
  async fetch(request: Request, environment: Bindings) {
    return await handleRequest(request, environment).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  }
}

export async function handleRequest(request: Request, environment: Bindings) {
  KV = environment.KV
  FALLBACK_URL = environment.FALLBACK_URL
  KEY_LENGTH = parseInt(environment.KEY_LENGTH) || 10

  const { method, url } = request
  const { pathname } = new URL(url)

  if (method === 'GET') {
    const destination = await findDestination(pathname)
    return Response.redirect(destination.url, 301)
  } else if (method === 'PUT') {
    const { response, status } = await createDestination(await request.json())
    return new Response(response, { status: status })
  } else {
    return new Response("Bad Request", { status: 400 })
  }
}
