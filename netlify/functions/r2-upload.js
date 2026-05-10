// Netlify Function — accepts a small JSON {filename, contentType} and returns
// a one-shot upload URL that the browser can PUT to directly.
// Avoids putting the Cloudflare token in the browser.
//
// Required Netlify env vars:
//   CF_ACCOUNT_ID, CF_API_TOKEN, R2_BUCKET (defaults to "smsc-media"),
//   R2_PUBLIC_BASE (e.g. https://pub-xxx.r2.dev)

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors(), body: '' }
  }
  if (event.httpMethod !== 'POST') {
    return resp(405, { error: 'POST only' })
  }
  try {
    const { filename, contentType, prefix = '' } = JSON.parse(event.body || '{}')
    if (!filename) return resp(400, { error: 'filename required' })

    const safe = filename.replace(/[^a-z0-9.\-_]+/gi, '_').toLowerCase()
    const key = `${prefix ? prefix.replace(/\/+$/,'') + '/' : ''}${Date.now()}_${safe}`
    const bucket = process.env.R2_BUCKET || 'smsc-media'
    const acct = process.env.CF_ACCOUNT_ID
    const token = process.env.CF_API_TOKEN
    if (!acct || !token) return resp(500, { error: 'CF env not configured' })

    // Upload directly through Cloudflare API on the user's behalf —
    // the browser will POST the file to THIS function which streams to R2.
    // Returning the key + public URL the browser can render after upload.
    return resp(200, {
      uploadUrl: `/.netlify/functions/r2-upload-stream?key=${encodeURIComponent(key)}&ct=${encodeURIComponent(contentType || 'application/octet-stream')}`,
      publicUrl: `${process.env.R2_PUBLIC_BASE}/${key}`,
      key,
    })
  } catch (e) {
    return resp(500, { error: e.message })
  }
}

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}
function resp(code, body) {
  return { statusCode: code, headers: { ...cors(), 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
}
