interface Bindings {
  KV: KVNamespace
  FALLBACK_URL: string
  KEY_LENGTH: string
  WRITE_KEY: string
}

interface Destination {
  url: string
}

interface DestinationRequest {
  url: string,
  key: string
}
