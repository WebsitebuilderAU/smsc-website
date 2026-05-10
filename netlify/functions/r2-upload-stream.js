// Streams the raw request body into R2 via Cloudflare API.
// Called by the browser AFTER getting the URL from r2-upload.

export const handler = async (event) => {
  if (event.httpMethod !== 'PUT' && event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'PUT or POST only' }
  }
  const key = event.queryStringParameters?.key
  const ct  = event.queryStringParameters?.ct || 'application/octet-stream'
  if (!key) return { statusCode: 400, body: 'key required' }

  const acct = process.env.CF_ACCOUNT_ID
  const token = process.env.CF_API_TOKEN
  const bucket = process.env.R2_BUCKET || 'smsc-media'

  const body = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64')
    : Buffer.from(event.body || '', 'utf8')

  const r = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${acct}/r2/buckets/${bucket}/objects/${encodeURIComponent(key)}`,
    { method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': ct }, body }
  )
  const out = await r.json()
  return {
    statusCode: r.ok ? 200 : 500,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(out),
  }
}
