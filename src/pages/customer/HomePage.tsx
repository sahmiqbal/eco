import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Package, Sparkles, Star, CircleCheck as CheckCircle, Truck, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductCard } from '@/components/shop/ProductCard'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'

export function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setFeatured((data as Product[]) ?? [])
        setLoading(false)
      })
  }, [])

  const packIncludes = [
    'Savon Beldi naturel',
    'Tebrima (Kessa)',
    'Gommage Corps',
    'Huile Capillaire',
    'Crème Éclaircissante',
    'Cadeau Surprise 🎁',
  ]

  const perks = [
    { icon: Truck, title: 'Livraison Maroc', desc: 'Partout au Maroc en 2–4 jours' },
    { icon: Shield, title: '100% Naturel', desc: 'Formules authentiques marocaines' },
    { icon: CheckCircle, title: 'Qualité Garantie', desc: 'Satisfaite ou remboursée' },
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
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/40 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 max-w-6xl py-24 md:py-36">
          <div className="max-w-lg">
            <Badge className="bg-gold/90 text-gold-foreground mb-4 text-xs px-3 py-1">
              ✦ Cosmétiques Marocains Authentiques
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Le Rituel Hammam
              <br />
              <span className="gold-text">de Luxe</span>
            </h1>
            <p className="text-white/80 text-base md:text-lg leading-relaxed mb-8">
              Redécouvrez la tradition du hammam marocain avec nos soins naturels
              formulés à base des trésors de beauté du Maroc.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="rounded-xl gap-2 shadow-lg" asChild>
                <Link to="/shop">
                  Découvrir nos packs <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white" asChild>
                <Link to="/shop?category=individual">
                  Produits individuels
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pack includes ── */}
      <section className="bg-secondary/50 py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Chaque pack comprend</p>
            <h2 className="text-xl font-bold text-foreground">6 produits soins complets</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {packIncludes.map((item) => (
              <div key={item} className="bg-card rounded-xl p-3 text-center border border-border shadow-sm">
                <p className="text-xs font-medium text-foreground leading-snug">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="container mx-auto px-4 max-w-6xl py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Nos bestsellers</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Packs <span className="text-primary">Populaires</span>
            </h2>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-primary hidden sm:flex" asChild>
            <Link to="/shop">
              Tout voir <ArrowRight className="size-4" />
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
            <Link to="/shop">Voir tous les produits <ArrowRight className="size-4" /></Link>
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
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="container mx-auto px-4 max-w-6xl py-16">
        <div className="text-center mb-10">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Elles nous font confiance</p>
          <h2 className="text-2xl font-bold text-foreground">Avis de nos clientes</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { name: 'Fatima Z.', city: 'Casablanca', text: 'Le pack Aker Fassi est incroyable ! Ma peau n\'a jamais été aussi douce et lumineuse. Je recommande vivement.', rating: 5 },
            { name: 'Samira B.', city: 'Marrakech', text: 'Qualité exceptionnelle, produits 100% naturels. Le gommage est le meilleur que j\'ai utilisé. Livraison rapide!', rating: 5 },
            { name: 'Nadia K.', city: 'Rabat', text: 'J\'achète le pack Nila chaque mois. L\'huile capillaire a transformé mes cheveux. Merci Dar Nour!', rating: 5 },
          ].map((review) => (
            <div key={review.name} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex gap-0.5 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="size-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{review.text}"</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{review.name[0]}</span>
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
      <section className="bg-primary py-16 text-center">
        <div className="container mx-auto px-4 max-w-lg">
          <Sparkles className="size-8 text-primary-foreground/60 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
            Commandez Maintenant
          </h2>
          <p className="text-primary-foreground/80 mb-6 text-sm">
            Profitez de nos offres bundle exclusives — Plus vous commandez, plus vous économisez.
          </p>
          <Button size="lg" variant="outline" className="rounded-xl border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary gap-2" asChild>
            <Link to="/shop">
              <Package className="size-4" />
              Voir nos packs
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
