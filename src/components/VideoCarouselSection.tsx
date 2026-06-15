import { useState, useRef } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
} from './ui/carousel'

interface Video {
  id: string
  thumbnail: string
  title: string
  videoUrl: string
  mp4Url?: string
}

export function VideoCarouselSection() {
  // play inline inside the slide
  const [playingId, setPlayingId] = useState<string | null>(null)
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})
  const [unmuteState, setUnmuteState] = useState<Record<string, boolean>>({})
  
  // Sample video data - replace with actual data from your source
  // Use a same-origin MP4 file to avoid CORS blocking in hosted preview environments.
  const sampleVideoUrl = '/videos/sample-video.mp4'
  const [videos] = useState<Video[]>([
    {
      id: '1',
      thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
      title: 'Daily skincare ritual',
      videoUrl: '',
      mp4Url: sampleVideoUrl,
    },
    {
      id: '2',
      thumbnail: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=900&q=80',
      title: 'Organic ingredients in action',
      videoUrl: '',
      mp4Url: sampleVideoUrl,
    },
    {
      id: '3',
      thumbnail: 'https://images.unsplash.com/photo-1523293831594-d0a8f2933f0f?auto=format&fit=crop&w=900&q=80',
      title: 'Fresh harvest from our fields',
      videoUrl: '',
      mp4Url: sampleVideoUrl,
    },
    {
      id: '4',
      thumbnail: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
      title: 'Customer wellness story',
      videoUrl: '',
      mp4Url: sampleVideoUrl,
    },
    {
      id: '5',
      thumbnail: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
      title: 'Healthy routine highlights',
      videoUrl: '',
      mp4Url: sampleVideoUrl,
    },
    {
      id: '6',
      thumbnail: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
      title: 'Glow from natural care',
      videoUrl: '',
      mp4Url: sampleVideoUrl,
    },
    {
      id: '7',
      thumbnail: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=900&q=80',
      title: 'Self-care ritual with friends',
      videoUrl: '',
      mp4Url: sampleVideoUrl,
    },
    {
      id: '8',
      thumbnail: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&w=900&q=80',
      title: 'Pure botanical nourishment',
      videoUrl: '',
      mp4Url: sampleVideoUrl,
    },
  ])

  function SlideContent({ video }: { video: Video }) {
    const carousel = useCarousel()
    const mp4 = video.mp4Url ?? video.videoUrl
    const isUnmuted = !!unmuteState[video.id]
    const isActive = playingId === video.id

    const pauseOtherVideos = (keepId?: string | null) => {
      Object.keys(videoRefs.current).forEach((k) => {
        if (k === keepId) return
        const other = videoRefs.current[k]
        if (other && !other.paused) {
          try { other.pause() } catch (e) {}
        }
      })
    }

    const activateVideo = (id: string) => {
      const videoElement = videoRefs.current[id]
      pauseOtherVideos(id)
      setPlayingId(id)
      carousel?.pauseAutoplay?.()

      if (!videoElement) return

      const playPromise = videoElement.play()
      if (playPromise?.catch) {
        playPromise.catch(() => {
          setPlayingId(null)
          carousel?.resumeAutoplay?.()
        })
      }
    }

    return (
      <div className="overflow-hidden rounded-2xl bg-slate-950 shadow-xl shadow-slate-900/30 transition-transform duration-500 ease-out hover:-translate-y-1 hover:shadow-2xl">
        <div className="relative aspect-[9/16]">
          <>
            <video
              ref={(el) => {
                if (el) {
                  videoRefs.current[video.id] = el
                } else {
                  delete videoRefs.current[video.id]
                }
              }}
              controls={isUnmuted}
              muted={!isUnmuted}
              playsInline
              preload="metadata"
              poster={video.thumbnail}
              className={`absolute inset-0 w-full h-full object-cover bg-black transition-opacity duration-300 ${isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
              <source src={mp4} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <img
              src={video.thumbnail}
              alt={video.title}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}
            />

            {!isActive && (
              <button
                type="button"
                onClick={() => activateVideo(video.id)}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none"
                aria-label="Play reel inline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-white">
                  <path d="M5 3v18l15-9L5 3z" fill="white" />
                </svg>
              </button>
            )}

            <div className={`absolute inset-x-4 bottom-4 rounded-3xl bg-black/50 px-4 py-3 text-white font-semibold text-sm md:text-base line-clamp-2 backdrop-blur-sm transition-opacity duration-300 ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              {video.title}
            </div>

            {isActive && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  const next = !isUnmuted
                  setUnmuteState((s) => ({ ...s, [video.id]: next }))
                  const v = videoRefs.current[video.id]
                  if (v) {
                    v.muted = !next
                    v.controls = next
                  }
                }}
                className="absolute left-3 top-3 z-30 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 focus:outline-none"
                aria-label={isUnmuted ? 'Mute' : 'Unmute'}
              >
                {isUnmuted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4">
                    <path d="M6 10v4h4l5 5V5l-5 5H6z" fill="white" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4">
                    <path d="M6 10v4h4l5 5V5l-5 5H6z" fill="white" opacity="0.4" />
                    <path d="M19 5l-1 1-2 2 2 2 1 1 1-1-1-1-1-1 1-1z" fill="white" />
                  </svg>
                )}
              </button>
            )}
          </>
        </div>
      </div>
    )
  }

  return (
    <section className="py-12 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Trusted By 50,000+ Happy Customers
          </h2>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{
            loop: true,
            align: 'center',
            containScroll: 'trimSnaps',
            skipSnaps: false,
          }}
          id="video-carousel"
          className="relative w-full"
        >
          <CarouselContent className="-ml-4">
            {videos.map((video) => (
              <CarouselItem
                key={video.id}
                className="
                  pl-4
                  basis-[80%]
                  sm:basis-[55%]
                  md:basis-[33.333%]
                  lg:basis-[25%]
                  xl:basis-[20%]
                "
              >
                <SlideContent video={video} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 md:-left-10" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 md:-right-10" />
        </Carousel>

        {/* Dots are handled automatically by the Carousel component */}

      </div>

      {/* inline playback handled inside slides via `playingId` */}

    </section>
  )
}
