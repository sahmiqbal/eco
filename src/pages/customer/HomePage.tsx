import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CircleCheck as CheckCircle, Truck, Shield } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { ProductCard } from '../../components/shop/ProductCard'
import { CtaFaqSection } from '../../components/CtaFaqSection'
import { TestimonialsSection } from '../../components/TestimonialsSection'
import { VideoCarouselSection } from '../../components/VideoCarouselSection'
import { supabase } from '../../lib/supabase'
import { useLanguage } from '../../lib/language'
import type { Product } from '../../types'
import { Skeleton } from '../../components/ui/skeleton'

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
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/hero-banner.webp"
            alt="Dar Nour"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/55 to-transparent" />
          <div className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-foreground/98/40 to-transparent opacity-60" />
        </div>

        <div className="relative container mx-auto px-4 max-w-6xl py-20 md:py-28">
          <div className="relative z-10 grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-6 lg:col-span-5 text-center md:text-left">
              <Badge className="bg-gold/90 text-gold-foreground mb-4 text-[11px] tracking-[0.32em] rounded-full px-3 py-1 inline-flex items-center">
                {t('heroBadge')}
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 max-w-xl mx-auto md:mx-0">
                {t('heroTitleLine1')}
                <br />
                <span className="gold-text">{t('heroTitleLine2')}</span>
              </h1>
              <p className="mx-auto max-w-2xl text-white/85 text-base md:text-lg leading-relaxed mb-8 md:max-w-none">
                {t('heroDescription')}
              </p>

              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-center md:justify-start">
                <Button size="lg" className="w-full rounded-full gap-2 shadow-lg bg-gold text-gold-foreground hover:brightness-95 sm:w-auto" asChild>
                  <Link to="/shop">
                    {t('discoverPacks')} <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full rounded-full border-white/30 text-white hover:bg-white/10 sm:w-auto" asChild>
                  <Link to="/shop?category=individual">
                    {t('individualProducts')}
                  </Link>
                </Button>
              </div>
            </div>

            <div className="hidden md:block md:col-span-6 lg:col-span-7" aria-hidden>
              {/* decorative spacing column to keep image visible and composition balanced */}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="container mx-auto px-4 max-w-6xl py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{t('featuredSub')}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {t('packsPopular')}
            </h2>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-primary hidden sm:flex" asChild>
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
          <Button variant="outline" className="rounded-xl gap-2" asChild>
            <Link to="/shop">{t('viewAllProductsShort')} <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
      </section>

      {/* ── Perks ── */}
      <section className="bg-primary/5 border-y border-primary/10 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {perks.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="size-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">{title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <VideoCarouselSection />

      <CtaFaqSection />
    </div>
  )
}
