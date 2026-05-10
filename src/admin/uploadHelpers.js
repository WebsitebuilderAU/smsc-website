import { uploadToR2, uploadManyToR2 } from '../lib/r2.js'
import { uploadVideoToStream } from '../lib/stream.js'

/**
 * Upload one File. Videos go to Cloudflare Stream; everything else to R2.
 * `bucket` is kept as a prefix so existing call sites still pass meaningful folders
 * (ship-photos / newsletters / meeting-minutes / event-photos).
 * Returns a public URL (R2) or an iframe playback URL (Stream).
 */
export async function uploadToBucket(bucket, file, prefix = '') {
  const folder = `${bucket}${prefix ? '/' + prefix.replace(/^\/+|\/+$/g,'') : ''}`
  if (file.type?.startsWith('video/')) {
    const v = await uploadVideoToStream(file)
    return v.playback
  }
  return await uploadToR2(file, folder)
}

export async function uploadMany(bucket, files, prefix = '') {
  const urls = []
  for (const f of files) urls.push(await uploadToBucket(bucket, f, prefix))
  return urls
}

export function slugify(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
