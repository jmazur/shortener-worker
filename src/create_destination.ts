import { nanoid } from "nanoid"
import { KV, KEY_LENGTH, Destination } from "./worker.js"

interface DestinationRequest {
  url: string,
  expires_in?: number
}

export async function createDestination(request: DestinationRequest) {
  const { url, expires_in } = request

  const key: string = await generateKey()

  const destination: Destination = {
    url: url
  }

  await KV.put(key, JSON.stringify(destination))
  return { response: key, status: 200 }
}

async function generateKey(): Promise<string> {
  const key: string = nanoid(KEY_LENGTH)

  if (await KV.get(key) === null) {
    return key
  } else {
    return await generateKey()
  }
}
