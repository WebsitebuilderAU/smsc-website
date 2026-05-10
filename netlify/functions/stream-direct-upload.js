// Returns a Cloudflare Stream direct-upload URL the browser can POST a video to.
// Requires Netlify env: CF_ACCOUNT_ID, CF_API_TOKEN

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'POST only' }
  }
  try {
    const acct = process.env.CF_ACCOUNT_ID
    const token = process.env.CF_API_TOKEN
    const r = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${acct}/stream/direct_upload`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxDurationSeconds: 7200 }),
      }
    )
    const data = await r.json()
    if (!data.success) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: data.errors?.[0]?.message || 'Stream error', detail: data }),
      }
    }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploadURL: data.result.uploadURL, uid: data.result.uid }),
    }
  } catch (e) {
    return { statusCode: 500, body: e.message }
  }
}
