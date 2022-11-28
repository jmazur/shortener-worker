# shortener-worker
![example workflow](https://github.com/jmazur/shortener-worker/actions/workflows/node.js.yml/badge.svg?label=build)
[![Maintainability](https://api.codeclimate.com/v1/badges/376c353a95648ddeb416/maintainability)](https://codeclimate.com/github/jmazur/shortener-worker/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/376c353a95648ddeb416/test_coverage)](https://codeclimate.com/github/jmazur/shortener-worker/test_coverage)

A self-managed url shortener deployed to a Cloudflare Worker. Uses Cloudflare KV for storage.

## Deploy
1. Clone into a new private repo (you will be adding keys to the config)
1. Run `npm install` to install packages
1. Log into wrangler using your Cloudflare Account `npx wrangler login`
1. Use wranger to create a new KV store `wrangler kv:namespace create <NAMESPACE_NAME>`
1. Update wrangler.toml using the KV ID generated above. See other configuration options below
1. Run `npm run deploy`

## Setting Up
Once the worker is deployed you will need to bind a domain name. https://developers.cloudflare.com/workers/platform/triggers/custom-domains/. Visit your bound domain name to verify installation, you should be redirected to your fallback URL.

### Configuration Options
The worker has several environemnt variables that change the bahaviour. It is highly recommended you adjust settings before deploying to production.

`FALLBACK_URL` - Used when a short url key doesnt exist

`KEY_LENGTH` - The minimum short url key length. Longer is better but we are fighting length here. You can use this ID size calculator to help find the write short-url key size https://zelark.github.io/nano-id-cc/

`WRITE_KEY` - the secret key used by your clients to create new short URLs. Make it hard to guess.

## Create Short URLs
The shortener-worker uses a simple API to create new short URLs. You can either use a package already made for your language of choice or write your own. Basic operation is a PUT request with a body containing a `url` and a `writeKey` that matches your worker `WRITE_KEY`.
