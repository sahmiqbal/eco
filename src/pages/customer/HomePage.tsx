import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CircleCheck as CheckCircle, Truck, Shield } from 'lucide-react'

import { ProductCard } from '../../components/shop/ProductCard'
import { CtaFaqSection } from '../../components/CtaFaqSection'
import { TestimonialsSection } from '../../components/TestimonialsSection'
import { VideoCarouselSection } from '../../components/VideoCarouselSection'
import { HeroSection } from '../../components/HeroSection'
import { supabase } from '../../lib/supabase'
import { useLanguage } from '../../lib/language'
import type { Product } from '../../types'
import { Skeleton } from '../../components/ui/skeleton'
import { Button } from '@/components/ui/button'

export function HomePage() {
  const { t } = useLanguage()
  const [featured, setFeatured] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: true })
      .then(({ data }: { data: Product[] | null }) => {
        setFeatured((data as Product[]) ?? [])
        setLoading(false)
      })
  }, [])

  const perks = [
    { icon: Truck, title: t('delivery'), desc: t('deliveryDesc') },
    { icon: Shield, title: t('natural'), desc: t('naturalDesc') },
    { icon: CheckCircle, title: t('quality'), desc: t('qualityDesc') },
  ]

  return (
    <div className="animate-fade-up">
      <HeroSection />

      {/* ── Featured Products ── */}
      <section className="container mx-auto px-4 max-w-6xl py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 rounded-full bg-primary/40" />
              <p className="text-[11px] uppercase tracking-[0.35em] font-semibold text-muted-foreground">
                {t('featuredSub')}
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground max-w-3xl">
              {t('packsPopular')}
            </h2>
          </div>
          <Button variant="uiverse" size="sm" className="gap-1 hidden sm:flex" asChild>
            <Link to="/shop">
              {t('viewAllProducts')} <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-2xl border overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-8 w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-8 sm:hidden">
          <Button variant="uiverse" className="rounded-xl gap-2" asChild>
            <Link to="/shop">{t('viewAllProductsShort')} <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
      </section>

      {/* ── Perks ── */}
      <section className="bg-primary/5 border-y border-primary/10 py-6 overflow-hidden flex w-full">
  {/* L'container li fih l'animation, w drna lih hover bach yw9ef ila 7tit 3lih l'asouris */}
  <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
    
    {/* Kanbdaw l'boucle 3la l'perks (m3awda 2 mrat) */}
    {[...perks, ...perks].map(({ icon: Icon, title, desc }, index) => (
      <div key={index} className="flex items-center gap-3 mx-3 shrink-0">
        
        {/* L'icon w l'ktba dyalek */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="size-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-foreground">{title}</h4>
            <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
          </div>
        </div>

        {/* L'khat li kayfre9 binat'hom (Separator) */}
        <span className="text-primary/20 text-3xl font-light ml-2">|</span>
        
      </div>
    ))}
  </div>
</section>

      <TestimonialsSection />

      <VideoCarouselSection />

      <CtaFaqSection />
    </div>
  )
}
