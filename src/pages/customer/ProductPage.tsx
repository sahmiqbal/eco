import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ShoppingBag, ArrowLeft, Package, Star, Minus, Plus, CircleAlert as AlertCircle } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../../components/ui/carousel'
import { useCartStore, getBundlePrice } from '../../store/cartStore'
import { supabase } from '../../lib/supabase'
import { cn, getProductBeforeAfterImages, getProductImages } from '../../lib/utils'
import { BeforeAfter } from '../../components/shop/BeforeAfter'
import type { Product } from '../../types'

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const { addItem, items } = useCartStore()

  const cartItem = items.find((i) => i.product.id === product?.id)

  const productImages = product ? getProductImages(product) : []
  const carouselSlides = productImages.length
    ? Array.from({ length: 4 }, (_, index) => productImages[index % productImages.length])
    : []
  const beforeAfterImages = product ? getProductBeforeAfterImages(product) : []

  useEffect(() => {
    let isMounted = true

    const loadProduct = async () => {
      setLoading(true)

      if (!slug) {
        if (isMounted) {
          setProduct(null)
          setLoading(false)
        }
        return
      }

      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle() as { data: Product | null }

      if (!isMounted) return

      setProduct(data)
      setLoading(false)
    }

    loadProduct()

    return () => {
      isMounted = false
    }
  }, [slug])

  if (loading) return (
    <div className="container mx-auto px-4 max-w-5xl py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Skeleton className="aspect-square rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-12 w-full mt-6" />
        </div>
      </div>
    </div>
  )

  if (!product) return (
    <div className="container mx-auto px-4 max-w-5xl py-20 text-center">
      <h2 className="text-xl font-semibold mb-2">Produit introuvable</h2>
      <Button variant="outline" asChild className="mt-4">
        <Link to="/shop">Retour à la boutique</Link>
      </Button>
    </div>
  )

  const unitPrice = getBundlePrice(product, qty)
  const total = unitPrice * qty

  const addToCart = () => {
    for (let i = 0; i < qty; i++) addItem(product)
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl py-6 animate-fade-up">
      <Button variant="ghost" size="sm" className="mb-4 gap-2 text-muted-foreground" onClick={() => navigate(-1)}>
        <ArrowLeft className="size-4" /> Retour
      </Button>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-border bg-secondary">
            <Carousel opts={{ loop: true }} className="relative">
              <CarouselContent className="min-h-[320px] sm:min-h-[420px]">
                {carouselSlides.length > 0 ? (
                  carouselSlides.map((src, index) => (
                    <CarouselItem key={`product-slide-${index}`}>
                      <div className="relative h-full w-full overflow-hidden">
                        <img
                          src={src}
                          alt={`${product.name} image ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 text-white">
                          <p className="text-xs uppercase tracking-[0.3em] text-white/80">
                            {product.category === 'pack' ? 'Pack Hammam' : 'Produit individuel'}
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem>
                    <div className="h-[320px] sm:h-[420px] w-full flex items-center justify-center p-8">
                      <Package className="size-20 text-muted-foreground/30" />
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>

              {carouselSlides.length > 1 && (
                <>
                  <CarouselPrevious className="hidden md:flex" />
                  <CarouselNext className="hidden md:flex" />
                </>
              )}
            </Carousel>
          </div>
          {beforeAfterImages.length >= 2 && (
            <div className="rounded-3xl border border-border bg-card p-4">
              
              <BeforeAfter
                beforeImage={beforeAfterImages[0]}
                afterImage={beforeAfterImages[1]}
                beforeLabel="Avant"
                afterLabel="Après"
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {product.category === 'pack' ? 'Pack Hammam' : 'Produit individuel'}
              </Badge>
              {product.category === 'pack' && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {[1,2,3,4,5].map((s) => <Star key={s} className="size-4 fill-gold text-gold" />)}
                  <span>Bestseller</span>
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-foreground leading-tight">{product.name}</h1>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] mb-2">Prix</p>
                <p className="text-2xl font-bold text-primary">{product.price} MAD</p>
                {product.price_2 && <p className="text-xs text-muted-foreground mt-1">2 unités: {product.price_2} MAD</p>}
                {product.price_3plus && <p className="text-xs text-muted-foreground mt-1">3+ unités: {product.price_3plus} MAD</p>}
              </div>
              <div className="rounded-3xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] mb-2">Stock</p>
                <p className={cn('text-sm font-medium', product.stock === 0 ? 'text-destructive' : 'text-foreground')}>
                  {product.stock === 0 ? 'Rupture de stock' : `${product.stock} disponibles`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Commander</p>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-secondary p-4">
                <p className="text-xs text-muted-foreground mb-2">Tarifs dégressifs</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { qty: 1, price: product.price, label: '1 unité' },
                    ...(product.price_2 ? [{ qty: 2, price: product.price_2, label: '2 unités' }] : []),
                    ...(product.price_3plus ? [{ qty: 3, price: product.price_3plus, label: '3+ unités' }] : []),
                  ].map((tier) => (
                    <button
                      key={tier.qty}
                      type="button"
                      onClick={() => setQty(tier.qty)}
                      className={cn(
                        'min-w-[96px] rounded-2xl px-3 py-2 text-xs transition-all',
                        qty >= tier.qty
                          ? 'border border-primary bg-primary/10 text-primary font-semibold'
                          : 'border border-border bg-background text-muted-foreground hover:border-primary/50'
                      )}
                    >
                      <div className="font-semibold">{tier.price} MAD</div>
                      <div>{tier.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-secondary p-4">
                <div className="text-sm text-muted-foreground">Quantité</div>
                <div className="inline-flex items-center rounded-xl border border-border bg-background">
                  <Button variant="ghost" size="icon" className="rounded-l-xl" onClick={() => setQty(Math.max(1, qty - 1))}>
                    <Minus className="size-4" />
                  </Button>
                  <span className="min-w-[2rem] text-center text-sm font-semibold">{qty}</span>
                  <Button variant="ghost" size="icon" className="rounded-r-xl" onClick={() => setQty(qty + 1)}>
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-primary">{total} MAD</p>
              </div>

              {product.stock === 0 ? (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                  <AlertCircle className="size-4 inline-block mr-2" /> Produit temporairement indisponible
                </div>
              ) : (
                <div className="space-y-3">
                  <Button size="lg" className="w-full rounded-2xl gap-2" onClick={addToCart}>
                    <ShoppingBag className="size-5" /> Ajouter au panier
                  </Button>
                  <Button size="lg" variant="outline" className="w-full rounded-2xl" onClick={() => { addToCart(); navigate('/cart') }}>
                    Commander maintenant
                  </Button>
                </div>
              )}
            </div>

            {cartItem && (
              <p className="text-sm text-primary text-center">✓ {cartItem.quantity} dans votre panier</p>
            )}
          </div>

          {product.ingredients && (
            <div className="rounded-3xl border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Ingrédients</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{product.ingredients}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
