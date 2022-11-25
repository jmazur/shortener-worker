import { KV, FALLBACK_URL, Destination } from "./worker.js"

export async function findDestination(key: string) {
  const data: string | null = await KV.get(key)

  if (data === null) {
    return {
      url: FALLBACK_URL
    }
  } else {
    const destination: Destination = JSON.parse(data)
    return destination
  }
}
