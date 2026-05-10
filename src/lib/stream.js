// Browser helper — request a Cloudflare Stream direct-upload URL via Netlify
// Function, then upload a video File to it.
// Returns { uid, thumbnail, playback } for storing on the gallery item.

export async function uploadVideoToStream(file) {
  const r = await fetch('/.netlify/functions/stream-direct-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: file.name, sizeBytes: file.size }),
  })
  if (!r.ok) throw new Error('Could not get Stream upload URL')
  const { uploadURL, uid } = await r.json()

  const form = new FormData()
  form.append('file', file)
  const up = await fetch(uploadURL, { method: 'POST', body: form })
  if (!up.ok) throw new Error('Stream upload failed')

  return {
    uid,
    playback: `https://customer-${import.meta.env.VITE_CF_STREAM_CUSTOMER}.cloudflarestream.com/${uid}/iframe`,
    thumbnail: `https://customer-${import.meta.env.VITE_CF_STREAM_CUSTOMER}.cloudflarestream.com/${uid}/thumbnails/thumbnail.jpg`,
  }
}
