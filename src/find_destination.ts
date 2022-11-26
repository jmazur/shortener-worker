import { env } from "./worker.js"

export async function findDestination(key: string) {
  const data: string | null = await env.KV.get(key)

  if (data === null) {
    return {
      url: env.FALLBACK_URL
    }
  } else {
    const destination: Destination = JSON.parse(data)
    return destination
  }
}
