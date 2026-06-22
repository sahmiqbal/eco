import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

import { useLanguage } from '@/lib/language'

export function HeroSection() {
  const { t } = useLanguage()

  return (
<section className="relative min-h-[80vh] md:min-h-[90vh] overflow-hidden flex items-center">

  {/* 1. IMAGE MOBILE (Ratio 5:4) - Katban ghir f mobile */}
{/* 1. IMAGE MOBILE (Ratio 5:4) */}
  <div className="absolute inset-0 block md:hidden">
    <img
      src="/imageheromobile.png" 
      alt="LAHLINO Hero Mobile"
      
      className="w-full h-full object-cover object-top"
    />
  </div>

  {/* 2. IMAGE DESKTOP (Ratio 16:9) - Katban ghir f PC */}
  <div className="absolute inset-0 hidden md:block">
    <img
      src="/heroimage1.png" // Hna dir smyt tsawira li fiha ratio 16:9
      alt="LAHLINO Hero Desktop"
      className="w-full h-full object-cover object-center"
    />
  </div>

  {/* OVERLAYS */}
 

  {/* LUXURY GLOWS */}
  

  {/* CONTENT */}
  <div className="relative z-10 container mx-auto px-0 md:px-6 max-w-7xl w-full">
    <div className="grid md:grid-cols-12 items-center">

      {/* LEFT CARD */}
      <div className="md:col-span-6 lg:col-span-5 flex w-full justify-center md:justify-start">
        <div className="
          w-[92%] sm:w-[85%] md:w-full max-w-md mx-auto md:mx-0
          rounded-[32px]
          border border-white/10
          
          backdrop-blur-sm
          p-2 md:p-4
          
          text-center md:text-left
        ">

          {/* BADGE */}
          <Badge className="bg-gradient-to-r from-pink-400 to-rose-300 text-black font-semibold mb-5 rounded-full px-4 py-1 tracking-[0.25em]">
            {t('heroBadge')}
          </Badge>

          {/* TITLE */}
          <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-[1.1] mb-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] animate-shimmer-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text text-transparent">
            {t('heroTitleLine2')}
          </h1>

          {/* DESCRIPTION */}
          <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed max-w-md mx-auto md:mx-0 mb-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            {t('heroDescription')}
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-full bg-gradient-to-r from-pink-500 to-rose-400 hover:scale-105 transition-all duration-300 text-white border-0 shadow-lg"
              asChild
            >
              <Link to="/shop">
                {t('discoverPacks')}
                <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto rounded-full border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10"
              asChild
            >
              <Link to="/shop?category=individual">
                {t('individualProducts')}
              </Link>
            </Button>
          </div>

        </div>
      </div>

      {/* RIGHT SPACE */}
      <div className="hidden md:block md:col-span-6 lg:col-span-7" />
    </div>
  </div>
</section>
  )
}
