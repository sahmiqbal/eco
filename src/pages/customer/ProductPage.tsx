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
import { useLanguage } from '../../lib/language'
import { cn, getProductBeforeAfterImages, getProductImages } from '../../lib/utils'
import { BeforeAfter } from '../../components/shop/BeforeAfter'
import type { Product } from '../../types'

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [carouselApi, setCarouselApi] = useState<any>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { addItem, items } = useCartStore()

  const cartItem = items.find((i) => i.product.id === product?.id)

  const productImages = product ? getProductImages(product) : []
  const carouselSlides = productImages.length > 0 ? productImages : []
  const beforeAfterImages = product ? getProductBeforeAfterImages(product) : []

  useEffect(() => {
    if (!carouselApi) return
    const onSelect = () => {
      setSelectedIndex(carouselApi.selectedScrollSnap())
    }
    carouselApi.on('select', onSelect)
    onSelect()
    return () => {
      carouselApi.off('select', onSelect)
    }
  }, [carouselApi])

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
      <h2 className="text-xl font-semibold mb-2">{t('productNotFound')}</h2>
      <Button variant="outline" asChild className="mt-4">
        <Link to="/shop">{t('returnToShop')}</Link>
      </Button>
    </div>
  )

  const unitPrice = getBundlePrice(product, qty)
  const total = unitPrice * qty

  const addToCart = () => {
    addItem(product, qty)
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl py-6 animate-fade-up">
      <Button variant="ghost" size="sm" className="mb-4 gap-2 text-muted-foreground" onClick={() => navigate(-1)}>
        <ArrowLeft className="size-4" /> {t('back')}
      </Button>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-background">
            <Carousel opts={{ loop: true }} className="relative" setApi={setCarouselApi}>
              <CarouselContent className="w-full">
                {carouselSlides.length > 0 ? (
                  carouselSlides.map((src, index) => (
                    <CarouselItem key={`product-slide-${index}`}>
                      <div className="relative h-full w-full overflow-hidden">
                        <img
                          src={src}
                          alt={`${product.name} image ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem>
                    <div className="relative h-full w-full flex items-center justify-center p-8">
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
            <div className="absolute inset-0 z-10 flex flex-col justify-between gap-3 p-3 sm:p-4 pointer-events-none">
              <div className="flex justify-between items-center gap-2">
                {product.category === 'pack' && (
                  <>
                    <Badge className="bg-gold/15 text-gold text-[10px] sm:text-[11px] font-bold rounded-lg px-3 py-1.5 shadow-md">
                      {t('packBadge')}
                    </Badge>
                   
                  </>
                )}
                
                 <Badge className="bg-gold/15 text-gold text-[9px] sm:text-[10px] font-semibold rounded-lg px-3 py-1.5 flex items-center gap-1">
                      <Star className="size-3.5 fill-gold" />
                      {t('bestseller')}
                    </Badge>
              </div>
            </div>
          </div>
          {productImages.length > 0 && (
            <div>
              <div className="flex flex-wrap justify-center gap-2">
                {productImages.map((src, index) => (
                  <button
                    key={`product-thumb-${index}`}
                    onClick={() => carouselApi?.scrollTo(index)}
                    className={cn(
                      'h-16 w-20 sm:h-20 sm:w-28 min-w-[5rem] sm:min-w-[7rem] overflow-hidden rounded-3xl transition-all flex-shrink-0',
                      selectedIndex === index
                        ? 'border-2 border-primary shadow-md scale-105'
                        : 'border-2 border-transparent bg-card/80 shadow-sm hover:border-border'
                    )}
                  >
                    <img
                      src={src}
                      alt={`Product thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
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
            <div>
              <h1 className="text-3xl font-bold text-foreground leading-tight">{product.name}</h1>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-3 sm:p-4 shadow-sm">
            <div className="space-y-3 text-center">
              <div className="rounded-3xl border border-border bg-background p-4 sm:p-5">
                
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground pb-3">{t('tierPricing')}</p>
                
                <div className="flex flex-wrap justify-center gap-3 px-2 pb-3">
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
                        'min-w-[96px] max-w-[12rem] rounded-3xl px-4 py-3 text-sm transition-all text-center flex-1 sm:flex-none',
                        qty >= tier.qty
                          ? 'border border-primary bg-primary/10 text-primary font-semibold shadow-sm'
                          : 'border border-border bg-white text-foreground hover:border-primary/50'
                      )}
                    >
                      <div className="font-semibold leading-tight">{tier.price} MAD</div>
                      <div className="leading-tight text-xs text-muted-foreground">{tier.label}</div>
                    </button>
                  ))}
                </div>
              </div>
                      {product.stock > 0 && (
                <Badge className="bg-emerald-100/95 text-emerald-700 text-[10px] font-bold rounded-lg px-3 py-1.5 shadow-md">
                  {product.stock} {t('available')}
                </Badge>
              )}
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t('quantity')}</p>
                <div className="inline-flex items-center justify-center rounded-full border border-border bg-background gap-3">
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setQty(Math.max(1, qty - 1))}>
                    <Minus className="size-4" />
                  </Button>
                  <span className="min-w-[2rem] text-center text-sm font-semibold">{qty}</span>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setQty(qty + 1)}>
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="self-end">
            
            </div>
              <div className="mx-auto max-w-[200px] space-y-1 rounded-3xl bg-white text-center">
                <p className="text-xs uppercase font-bold tracking-[0.3em] text-muted-foreground">Total</p>
                <p className="text-xl font-bold text-primary">{total} MAD</p>
              </div>

              {product.stock === 0 ? (
                <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                  <AlertCircle className="size-4 inline-block mr-2" /> {t('temporarilyUnavailable')}
                </div>
              ) : (
                <div className="space-y-3">
                  <Button size="lg" className="w-full rounded-3xl gap-2" onClick={addToCart}>
                    <ShoppingBag className="size-5" /> {t('addToCart')}
                  </Button>
                  <Button size="lg" variant="outline" className="w-full rounded-3xl" onClick={() => { addToCart(); navigate('/cart') }}>
                    {t('orderNow')}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {cartItem && (
            <p className="text-sm text-primary text-center">✓ {cartItem.quantity} {t('inYourCart')}</p>
          )}

          {product.ingredients && (
            <div className="rounded-3xl border border-border bg-card p-5">
              <p className="text-xs text-center uppercase tracking-[0.3em] text-muted-foreground mb-3">{t('ingredients')}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{product.ingredients}</p>
            </div>
          )}
        </div>
      </div>

      {product.comparatives_images && product.comparatives_images.length > 0 && (
        <div className="mt-10 flex gap-3 overflow-x-auto">
          {(product.comparatives_images ?? []).map((src, i) => (
            <img key={src + i} src={src} alt={`Comparative ${i + 1}`} className="min-w-[72%] sm:min-w-[48%] md:min-w-[32%] h-auto rounded-2xl" />
          ))}
        </div>
      )}

      {product.others_images && product.others_images.length > 0 && (
        <div className=" flex gap-3 overflow-x-auto">
          {(product.others_images ?? []).map((src, i) => (
            <img key={src + i} src={src} alt={`Others ${i + 1}`} className="w-full h-auto rounded-2xl" />
          ))}
        </div>
      )}

    </div>
  )
}
