# Cloudflare Workers deployment

This fork is configured for `https://tv.stillshadow.com` using OpenNext for Cloudflare.

## Workers Builds settings

- Worker name: `libretv-stillshadow`
- Production branch: `main`
- Build command: leave empty
- Deploy command: `npm run deploy`

## Runtime secrets

Configure these in **Workers & Pages → libretv-stillshadow → Settings → Variables and Secrets**:

- `PASSWORD`: required LibreTV login password
- `PROXY_SECRET`: required random session-signing secret
- `DEFAULT_SOURCES`: the non-adult source JSON array

`COOKIE_SECURE=true`, request timeouts, retry count, and debug mode are already defined as
non-secret values in `wrangler.jsonc`.

Do not commit secret values or source URLs to GitHub.

The `wrangler.jsonc` custom-domain route creates the DNS record and TLS certificate for
`tv.stillshadow.com` when the Worker is first deployed.
