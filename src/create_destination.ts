import cryptoRandomString from 'crypto-random-string'
import { KV, KEY_LENGTH, Destination } from "./worker"


interface DestinationRequest {
  url: string,
  key?: string,
  expires_in?: number
}

export async function createDestination(request: DestinationRequest) {
  const { url, expires_in } = request
  let { key } = request

  key = await generateKey(key)

  if (key === null) {
    return { response: "Key Unavailable", status: 409 }
  }

  const destination: Destination = {
    url: url,
    timesVisited: 0,
    createdOn: new Date()
  }
  await KV.put(key, JSON.stringify(destination))
  return { response: key, status: 200 }
}

async function generateKey(key:string | null = null): Promise<string> {
  let retry = false

  if (key === null) {
    retry = true
    key = cryptoRandomString({length: KEY_LENGTH, type: 'url-safe'});
  }

  if (await KV.get(key) === null) {
    return key
  } else if (retry) {
    return await generateKey()
  } else {
    throw new Error("Unable to generate key")
  }
}
