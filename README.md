# shortener-worker
![example workflow](https://github.com/jmazur/shortener-worker/actions/workflows/node.js.yml/badge.svg?label=build)

A self-managed url shortener deployed to a Cloudflare Worker. Uses Cloudfalre KV for storage.

## Deploy
### Option 1
Click the deploy link to set up a cloudflare worker.

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/jmazur/shortener-worker)

### Option 2
Install Wranger 2, clone this repo, change the write key, and run `npm deploy`

## Setting Up
Once the worker is deployed you will need to bind a domain name. Follow the workers guides to get it all set up. Visit your bound domain name to verify installation, you should be redirected to your fallback URL

### Configuring Options
The worker has several environemnt variables that change the bahaviour. It is highly recommended you adjust settings before deploying to production.

`FALLBACK_URL` - Used when a short url key doesnt exist

`KEY_LENGTH` - The minimum short url key length. Longer is better but we are fighting length here. 

`WRITE_KEY` - the secret key used by your clients to create new short URLs. Make it hard to guess.
