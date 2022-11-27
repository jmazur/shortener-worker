import { Unauthorized, ServiceUnavailable } from '@curveball/http-errors';

export async function createDestination(request: DestinationRequest) {
  const { url, writeKey } = request

  if (globalThis.WRITE_KEY === "<GENERATE KEY>") {
    throw new ServiceUnavailable
  }

  if (writeKey != globalThis.WRITE_KEY) {
    throw new Unauthorized
  }

  const length: number = globalThis.KEY_LENGTH
  const key: string = await generateKey(length)

  const destination: Destination = { url: url, key: key }

  await globalThis.KV.put(key, JSON.stringify(destination))
  return destination
}

export async function generateKey(length: number): Promise<string> {
  const { nanoid } = await import("nanoid");
  const key: string = nanoid(length)

  if (await globalThis.KV.get(key) === null) {
    return key
  } else {
    return await generateKey(length + 1)
  }
}
