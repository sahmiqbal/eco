import { useState, useRef, useEffect } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
} from './ui/carousel'
import { Volume2, VolumeX } from 'lucide-react'

interface Video {
  id: string
  thumbnail: string
  title: string
  videoUrl: string
  mp4Url?: string
}

// Add your local videos here - update paths to match your /public/videos folder
const VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Reel Video 1',
    thumbnail: '',
    videoUrl: '/videos/sample-video.mp4',
    mp4Url: '/videos/sample-video.mp4',
  },
  {
    id: '2',
    title: 'Reel Video 2',
    thumbnail: '',
    videoUrl: '/videos/adlibrarydownloader.com-50641.mp4',
    mp4Url: '/videos/adlibrarydownloader.com-50641.mp4',
  },
  {
    id: '3',
    title: 'Reel Video 1',
    thumbnail: '',
    videoUrl: '/videos/sample-video.mp4',
    mp4Url: '/videos/sample-video.mp4',
  },
  {
    id: '4',
    title: 'Reel Video 2',
    thumbnail: '',
    videoUrl: '/videos/adlibrarydownloader.com-50641.mp4',
    mp4Url: '/videos/adlibrarydownloader.com-50641.mp4',
  },
  {
    id: '5',
    title: 'Reel Video 1',
    thumbnail: '',
    videoUrl: '/videos/sample-video.mp4',
    mp4Url: '/videos/sample-video.mp4',
  },
  {
    id: '6',
    title: 'Reel Video 2',
    thumbnail: '',
    videoUrl: '/videos/adlibrarydownloader.com-50641.mp4',
    mp4Url: '/videos/adlibrarydownloader.com-50641.mp4',
  },
  {
    id: '7',
    title: 'Reel Video 1',
    thumbnail: '',
    videoUrl: '/videos/sample-video.mp4',
    mp4Url: '/videos/sample-video.mp4',
  },
]

const VIDEO_URLS = Array.from(new Set(VIDEOS.map((video) => video.mp4Url ?? video.videoUrl)))

async function captureVideoPoster(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.src = url
    video.crossOrigin = 'anonymous'
    video.muted = true
    video.playsInline = true
    video.preload = 'metadata'

    const cleanup = () => {
      video.pause()
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('seeked', handleSeeked)
      video.removeEventListener('error', handleError)
      video.removeAttribute('src')
      video.load()
    }

    let captured = false

    const finishCapture = () => {
      if (captured) return
      captured = true
      const width = video.videoWidth || 640
      const height = video.videoHeight || 360
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        cleanup()
        resolve(null)
        return
      }

      try {
        ctx.drawImage(video, 0, 0, width, height)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
        cleanup()
        resolve(dataUrl)
      } catch (error) {
        cleanup()
        resolve(null)
      }
    }

    const handleLoadedMetadata = () => {
      const targetTime = Math.min(0.1, Math.max(0, (video.duration || 0) * 0.01))
      if (targetTime === 0) {
        finishCapture()
        return
      }
      video.currentTime = targetTime
    }

    const handleTimeUpdate = () => {
      if (video.currentTime > 0) {
        finishCapture()
      }
    }

    const handleSeeked = () => {
      finishCapture()
    }

    const handleError = () => {
      cleanup()
      resolve(null)
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('seeked', handleSeeked)
    video.addEventListener('error', handleError)
  })
}

export function VideoCarouselSection() {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})
  const [unmuteState, setUnmuteState] = useState<Record<string, boolean>>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [posters, setPosters] = useState<Record<string, string>>({})
  const isRTL = typeof document !== 'undefined' && document.documentElement.dir === 'rtl'

  useEffect(() => {
    let isMounted = true

    async function loadPosters() {
      const nextPosters: Record<string, string> = {}
      await Promise.all(
        VIDEO_URLS.map(async (url) => {
          const poster = await captureVideoPoster(url)
          if (poster && isMounted) {
            nextPosters[url] = poster
          }
        })
      )

      if (isMounted) {
        setPosters(nextPosters)
      }
    }

    loadPosters()

    return () => {
      isMounted = false
    }
  }, [])

  // Pause any playing videos on unmount
  useEffect(() => {
    return () => {
      Object.values(videoRefs.current).forEach((el) => {
        try { el?.pause(); if (el) el.currentTime = 0 } catch (e) {}
      })
    }
  }, [])

  function SlideContent({ video }: { video: Video }) {
    const { pauseAutoplay, resumeAutoplay } = useCarousel()
    const mp4 = video.mp4Url ?? video.videoUrl
    const isUnmuted = !!unmuteState[video.id]
    const isActive = playingId === video.id
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const videoSrc = isActive ? mp4 : undefined
    const poster = video.thumbnail || posters[mp4] || undefined

    useEffect(() => {
      const videoElement = videoRef.current
      if (!videoElement) return

      videoRefs.current[video.id] = videoElement

      const shouldIgnoreError = (error: any) =>
        error?.name === 'AbortError' || error?.message?.includes('AbortError')

      if (isActive) {
        pauseAutoplay()

        try {
          videoElement.muted = !isUnmuted
        } catch (e) {}

        if (videoElement.src !== mp4) {
          videoElement.src = mp4
        }

        const playPromise = videoElement.play()
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.then(() => {
            setErrorMessage(null)
          }).catch((error: any) => {
            if (shouldIgnoreError(error)) return
            console.error('Video playback failed:', error)
            setErrorMessage(error?.message ?? 'Failed to play video')
            setPlayingId(null)
            resumeAutoplay()
          })
        }
      } else {
        videoElement.pause()
      }
    }, [isActive, mp4, isUnmuted, pauseAutoplay, resumeAutoplay])

    const [isVideoReady, setIsVideoReady] = useState(false)

    const activateVideo = () => {
      setPlayingId(video.id)
      setIsVideoReady(false)
    }

    const handleVideoEnded = () => {
      if (isActive) {
        setPlayingId(null)
        setIsVideoReady(false)
        resumeAutoplay()
      }
    }

    const handleVideoPlaying = () => {
      setIsVideoReady(true)
      setErrorMessage(null)
    }

    return (
      <div
        className="group overflow-hidden rounded-2xl shadow-xl transition-shadow transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl transform-gpu will-change-transform"
        style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
      >
        <div
          className="relative aspect-[9/16] overflow-hidden transform-gpu will-change-transform"
          style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
        >
          <video
            ref={videoRef}
            controls={isActive}
            muted={!isUnmuted}
            playsInline
            preload={isActive ? 'auto' : 'metadata'}
            poster={poster}
            src={videoSrc}
            className="absolute inset-0 w-full h-full object-cover transform-gpu will-change-transform bg-transparent"
            style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
            onEnded={handleVideoEnded}
            onPlaying={handleVideoPlaying}
            onLoadedData={() => {
              if (!isActive) return
              setIsVideoReady(true)
            }}
            onError={() => {
              setErrorMessage('Failed to load video source')
              setPlayingId(null)
              setIsVideoReady(false)
              resumeAutoplay()
            }}
          />

          {(!isActive || !isVideoReady) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={activateVideo}
                className="flex items-center justify-center w-16 h-16 rounded-full bg-white/95 text-slate-950 border border-slate-200 shadow-lg shadow-slate-900/10 transition-transform duration-300 hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path d="M8 5.14v14l11-7-11-7z" />
                </svg>
              </button>
            </div>
          )}

          {isActive && (
            <button
              onClick={() => {
                const videoEl = videoRef.current

                setUnmuteState((prev) => {
                  const nextMuted = !!prev[video.id]

                  if (videoEl) {
                    try {
                      videoEl.muted = nextMuted
                    } catch {}
                  }

                  return {
                    ...prev,
                    [video.id]: !prev[video.id],
                  }
                })
              }}
              className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/90 text-slate-950 shadow-lg shadow-slate-900/10 transition-colors duration-300 hover:bg-white"
            >
              {isUnmuted ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <section className="py-1 md:py-6 dark:bg-slate-950 overflow-visible">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight animate-fade-up gold-text">
            Trusted By 50,000+ Happy Customers
          </h2>
          {errorMessage && (
            <p className="mt-4 text-sm text-red-500">{errorMessage}</p>
          )}
        </div>

        <div className="relative px-4 md:px-12 min-h-[420px] overflow-hidden">
          {VIDEOS.length === 0 ? (
            <div className="w-full py-20 flex items-center justify-center text-sm text-slate-500">No videos available</div>
          ) : (
            <Carousel
              opts={{ loop: true, align: 'center' }}
              className="w-full"
            >
              <CarouselContent className="flex h-full gap-3 md:gap-4 box-border" containerClassName="px-2 md:pl-4">
                {VIDEOS.map((video) => (
                  <CarouselItem key={video.id} className="box-border px-3 basis-[75%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 shrink-0">
                    <SlideContent video={video} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className={isRTL ? 'right-2 md:-right-12 z-50' : 'left-2 md:-left-12 z-50'} />
              <CarouselNext className={isRTL ? 'left-2 md:-left-12 z-50' : 'right-2 md:-right-12 z-50'} />
            </Carousel>
          )}
        </div>
      </div>
    </section>
  )
}
