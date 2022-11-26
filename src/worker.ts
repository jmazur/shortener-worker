import { createDestination } from "./create_destination.js"
import { findDestination } from "./find_destination.js"
import { NotImplemented } from '@curveball/http-errors';

export let env: Bindings

export default {
  async fetch(request: Request, environment: Bindings) {
    return await handleRequest(request, environment).catch(
      (err) => new Response(err.title, { status: err.status })
    )
  }
}

export async function handleRequest(request: Request, environment: Bindings) {
  const { method, url } = request
  const { pathname } = new URL(url)
  env = environment

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
