import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Package, Sparkles, Star, CircleCheck as CheckCircle, Truck, Shield } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { ProductCard } from '../../components/shop/ProductCard'
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

        <div className="relative container mx-auto px-4 max-w-6xl py-28 md:py-40">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 items-center">
            <div className="md:col-span-6 lg:col-span-5">
              <Badge className="bg-gold/90 text-gold-foreground mb-4 text-xs px-3 py-1 inline-flex items-center">
                {t('heroBadge')}
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 max-w-xl">
                {t('heroTitleLine1')}
                <br />
                <span className="gold-text">{t('heroTitleLine2')}</span>
              </h1>
              <p className="text-white/85 text-lg md:text-xl leading-relaxed mb-8 max-w-prose">
                {t('heroDescription')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="rounded-xl gap-2 shadow-lg bg-gold text-gold-foreground hover:brightness-95" asChild>
                  <Link to="/shop">
                    {t('discoverPacks')} <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-xl border-white/30 text-white hover:bg-white/10" asChild>
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

      {/* ── Testimonials ── */}
      <section className="container mx-auto px-4 max-w-6xl py-16">
        <div className="text-center mb-10">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{t('trustTitle')}</p>
          <h2 className="text-2xl font-bold text-foreground">{t('trustHeading')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { name: 'Fatima Z.', city: 'Casablanca', textKey: 'review1Text' as const, rating: 5 },
            { name: 'Samira B.', city: 'Marrakech', textKey: 'review2Text' as const, rating: 5 },
            { name: 'Nadia K.', city: 'Rabat', textKey: 'review3Text' as const, rating: 5 },
          ].map((review) => (
            <div key={review.name} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex gap-1.5 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="size-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">"{t(review.textKey)}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{review.name[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white py-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center rounded-[2rem] border border-primary/20 bg-primary/5 px-6 py-14 text-center shadow-[0_10px_40px_-15px_rgba(213,82,163,0.15)]">
          <div className="relative z-10 flex flex-col items-center gap-5">
            <Sparkles className="size-10 text-primary mx-auto" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              {t('orderNowSectionTitle')}
            </h2>
            <p className="max-w-xl text-foreground/80 text-sm md:text-base">
              {t('orderNowSectionText')}
            </p>
            <Button size="lg" className="rounded-3xl bg-primary px-8 py-4 text-white shadow-[0_10px_30px_-10px_rgba(213,82,163,0.3)] transition hover:bg-primary/90" asChild>
              <Link to="/shop" className="flex items-center gap-2">
                <Package className="size-4" />
                {t('viewOurPacks')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
