import fs from 'fs/promises'
import path from 'path'
import mime from 'mime'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

// Map local files to destination keys and metadata
const uploads = [
  {
    localVideo: 'public/videos/sample-video.mp4',
    localThumb: 'public/images/placeholder.svg',
    destVideo: 'samples/sample-video.mp4',
    destThumb: 'samples/sample-thumb.jpg',
    title: 'Daily skincare ritual',
  },
]

async function uploadFile(bucket, destPath, localPath) {
  const file = await fs.readFile(localPath)
  const contentType = mime.getType(localPath) || 'application/octet-stream'
  const { data, error } = await supabase.storage.from(bucket).upload(destPath, file, {
    contentType,
    upsert: true,
  })
  if (error) throw error
  return data
}

async function main() {
  console.log('Starting upload to Supabase Storage...')
  for (const u of uploads) {
    try {
      console.log('Uploading', u.localVideo, '->', u.destVideo)
      await uploadFile('videos', u.destVideo, path.resolve(u.localVideo))

      console.log('Uploading', u.localThumb, '->', u.destThumb)
      await uploadFile('videos', u.destThumb, path.resolve(u.localThumb))

      // Insert or upsert DB record
      const { error: dbError } = await supabase.from('videos').upsert(
        {
          title: u.title,
          thumbnail_path: u.destThumb,
          video_path: u.destVideo,
          mp4_path: u.destVideo,
        },
        { onConflict: 'title' }
      )

      if (dbError) throw dbError

      const { data: publicUrl } = supabase.storage.from('videos').getPublicUrl(u.destVideo)
      const { data: thumbUrl } = supabase.storage.from('videos').getPublicUrl(u.destThumb)
      console.log('Uploaded and DB record saved.')
      console.log('Public video URL:', publicUrl?.publicUrl)
      console.log('Public thumb URL:', thumbUrl?.publicUrl)
    } catch (e) {
      console.error('Upload failed for', u.title)
      console.error(e)
    }
  }
  console.log('Done')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
