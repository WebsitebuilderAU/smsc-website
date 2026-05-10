// Browser helper — upload a File to Cloudflare R2 via Netlify Functions.
// Returns the public URL.

export async function uploadToR2(file, prefix = '') {
  const r1 = await fetch('/.netlify/functions/r2-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      prefix,
    }),
  })
  if (!r1.ok) throw new Error('Could not get upload URL')
  const { uploadUrl, publicUrl } = await r1.json()

  const r2 = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body: file,
  })
  if (!r2.ok) throw new Error('Upload failed')
  return publicUrl
}

export async function uploadManyToR2(files, prefix = '') {
  const urls = []
  for (const f of files) urls.push(await uploadToR2(f, prefix))
  return urls
}
