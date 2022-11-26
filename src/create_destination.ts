import { nanoid } from "nanoid"
import { env } from "./worker.js"

export async function createDestination(request: DestinationRequest) {
  const { url } = request
  const length: number = parseInt(env.KEY_LENGTH) || 10
  const key: string = await generateKey(length)

  const destination: Destination = {
    url: url
  }

  await env.KV.put(key, JSON.stringify(destination))
  return { response: key, status: 200 }
}

async function generateKey(length: number): Promise<string> {
  const key: string = `/${nanoid(length)}`

  if (await env.KV.get(key) === null) {
    return key
  } else {
    return await generateKey(length + 1)
  }
}
