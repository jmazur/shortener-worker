export async function findDestination(key: string): Promise<Destination> {
  const data: string | null = await globalThis.KV.get(key)

  if (data === null) {
    return {
      url: globalThis.FALLBACK_URL
    }
  } else {
    const destination: Destination = JSON.parse(data)
    return destination
  }
}
