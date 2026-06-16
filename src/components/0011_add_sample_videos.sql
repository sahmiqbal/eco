-- Add sample videos from Pexels (free stock videos with proper CORS headers)

INSERT INTO public.videos (id, title, thumbnail_path, video_path, mp4_path)
VALUES
  (
    gen_random_uuid(),
    'Forest waterfall',
    'https://images.pexels.com/photos/1822285/pexels-photo-1822285.jpeg?w=400&h=600&fit=crop',
    'https://videos.pexels.com/video-files/7686/7686-hd_720_1280_30fps.mp4',
    'https://videos.pexels.com/video-files/7686/7686-hd_720_1280_30fps.mp4'
  ),
  (
    gen_random_uuid(),
    'Ocean beach sunset',
    'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?w=400&h=600&fit=crop',
    'https://videos.pexels.com/video-files/5732514/5732514-hd_720_1280_30fps.mp4',
    'https://videos.pexels.com/video-files/5732514/5732514-hd_720_1280_30fps.mp4'
  ),
  (
    gen_random_uuid(),
    'City life motion',
    'https://images.pexels.com/photos/943862/pexels-photo-943862.jpeg?w=400&h=600&fit=crop',
    'https://videos.pexels.com/video-files/5365622/5365622-hd_720_1280_30fps.mp4',
    'https://videos.pexels.com/video-files/5365622/5365622-hd_720_1280_30fps.mp4'
  ),
  (
    gen_random_uuid(),
    'Mountain landscape',
    'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?w=400&h=600&fit=crop',
    'https://videos.pexels.com/video-files/4898317/4898317-hd_720_1280_30fps.mp4',
    'https://videos.pexels.com/video-files/4898317/4898317-hd_720_1280_30fps.mp4'
  );
