export async function createDestination(request: DestinationRequest) {
  const { url } = request
  const length: number = globalThis.KEY_LENGTH
  const key: string = await generateKey(length)

  const destination: Destination = {
    url: url
  }

  await globalThis.KV.put(key, JSON.stringify(destination))
  return { response: key, status: 200 }
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
