-- Seed example rows for the `videos` table
-- Adjust `thumbnail_path` and `video_path` to match uploaded storage object keys

INSERT INTO public.videos (id, title, thumbnail_path, video_path, mp4_path)
VALUES
  (gen_random_uuid(), 'Daily skincare ritual', 'sample-thumb.jpg', 'sample-video.mp4', 'sample-video.mp4'),
  (gen_random_uuid(), 'Organic ingredients in action', 'sample-thumb-2.jpg', 'sample-video-2.mp4', 'sample-video-2.mp4'),
  (gen_random_uuid(), 'Customer wellness story', 'sample-thumb-3.jpg', 'sample-video-3.mp4', 'sample-video-3.mp4');
