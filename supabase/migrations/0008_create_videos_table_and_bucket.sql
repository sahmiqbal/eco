-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true);

-- Create videos table
CREATE TABLE IF NOT EXISTS public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  thumbnail_path text,
  video_path text,
  mp4_path text,
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.videos IS 'Video carousel records with storage paths for thumbnail and video files.';
COMMENT ON COLUMN public.videos.thumbnail_path IS 'Path inside the videos bucket or a full URL to the thumbnail image.';
COMMENT ON COLUMN public.videos.video_path IS 'Path inside the videos bucket or a full URL to the video file.';
COMMENT ON COLUMN public.videos.mp4_path IS 'Optional MP4-specific path if stored separately.';
