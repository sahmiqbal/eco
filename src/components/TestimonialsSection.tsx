import { Star } from 'lucide-react'
import { useLanguage } from '../lib/language'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel'

const reviews = [
  {
    name: 'Fatima Z.',
    city: 'Casablanca',
    textKey: 'review1Text' as const,
    rating: 5,
  },
  {
    name: 'Samira B.',
    city: 'Marrakech',
    textKey: 'review2Text' as const,
    rating: 5,
  },
  {
    name: 'Nadia K.',
    city: 'Rabat',
    textKey: 'review3Text' as const,
    rating: 5,
  },
  {
    name: 'Latifa M.',
    city: 'Fès',
    textKey: 'review4Text' as const,
    rating: 5,
  },
  {
    name: 'Yasmine A.',
    city: 'Tanger',
    textKey: 'review5Text' as const,
    rating: 5,
  },
  {
    name: 'Amina S.',
    city: 'Agadir',
    textKey: 'review6Text' as const,
    rating: 5,
  },
  {
    name: 'Hania R.',
    city: 'Oujda',
    textKey: 'review7Text' as const,
    rating: 5,
  },
]

export function TestimonialsSection() {
  const { t } = useLanguage()

  return (
    <section className="container max-w-7xl px-4 py-2 overflow-hidden">
      <div className="mb-12 text-center">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {t('trustTitle')}
        </p>

        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          {t('trustHeading')}
        </h2>
      </div>

      <div className="relative perspective-3d">
        <Carousel
          opts={{
            loop: true,
            align: 'center',
            dragFree: true,
            containScroll: 'trimSnaps',
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-3 flex items-stretch gap-4" containerClassName="w-full">
            {reviews.map((review) => (
              <CarouselItem
                key={review.name}
                className="
                  pl-3
                  basis-[90%]
                  sm:basis-[55%]
                  md:basis-[38%]
                  lg:basis-[28%]
                  xl:basis-[22%]
                "
              >
                <div
                  className="
                    testimonial-3d-card
                    group
                    flex
                    flex-col
                    rounded-[2rem]
                    border
                    border-border/60
                    bg-card
                    p-4
                    shadow-xl
                    transition-all
                    duration-500
                    hover:-translate-y-2
                    hover:shadow-2xl
                    hover:shadow-primary/15
                  "
                >
                  <div className="mb-3 flex gap-1 text-gold">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="size-4 fill-gold text-gold" />
                    ))}
                  </div>

                  <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                    "{t(review.textKey)}"
                  </p>

                  <div className="flex items-center gap-3 border-t border-border/60 pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 font-semibold text-primary">
                      {review.name[0]}
                    </div>

                    <div>
                      <p className="font-semibold text-foreground">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.city}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious
            className="
          
              left-2
              top-1/2
              -translate-y-1/2
              hidden
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-border/70
              bg-background/90
              text-foreground
              shadow-lg
              backdrop-blur
              md:flex
            "
          />

          <CarouselNext
            className="
              right-2
              top-1/2
              -translate-y-1/2
              hidden
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-border/70
              bg-background/90
              text-foreground
              shadow-lg
              backdrop-blur
              md:flex
            "
          />
        </Carousel>
      </div>
    </section>
  )
}