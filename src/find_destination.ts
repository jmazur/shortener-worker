import { KV, FALLBACK_URL } from "./worker"

export async function findDestination(key: string) {
  let destination = JSON.parse(await KV.get(key))

  if (destination === null) {
    return {
      url: FALLBACK_URL
    }
  } else {
    destination.timesVisited++
    destination.lastVistiedOn = new Date()
    KV.put(key, destination)
    return destination
  }
}
