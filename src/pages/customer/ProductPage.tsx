import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ShoppingBag, ArrowLeft, Package, ShieldCheck, Truck, Star, Minus, Plus, CircleAlert as AlertCircle } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import { Tag, Sparkles } from "lucide-react";
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
    className="h-full w-full object-contain"
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
          {/* Premium Luxury Card Container with Neon Border and Glow */}
          <div 
            className="relative rounded-[28px] overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 131, 208, 0.08) 0%, rgba(247, 209, 112, 0.06) 100%), rgba(17, 16, 23, 0.8)',
              boxShadow: '0 0 40px rgba(255, 131, 208, 0.15), inset 0 0 1px rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 131, 208, 0.2)',
            }}
          >
            {/* Soft Outer Glow */}
            <div 
              className="absolute inset-0 rounded-[28px]"
              style={{
                background: 'radial-gradient(circle at top right, rgba(255, 131, 208, 0.1) 0%, transparent 50%), radial-gradient(circle at bottom left, rgba(247, 209, 112, 0.08) 0%, transparent 50%)',
                pointerEvents: 'none',
              }}
            />

            <div className="relative space-y-5 p-5 sm:p-6">
              {/* TIER PRICING HEADER */}
              <div className="space-y-4">
                <div className="flex justify-center">
                   <div className="flex items-center gap-2 sm:gap-3">
    <Tag
      size={18}
      className="text-primary -rotate-12 drop-shadow-[0_0_8px_rgba(255,131,208,0.7)]"
      fill="currentColor"
    />

    <h2
      className="
        text-sm
        sm:text-lg
        md:text-xl
        font-extrabold
        uppercase
        tracking-[0.15em]
        text-white
        whitespace-nowrap
      "
      style={{
        textShadow: "0 0 12px rgba(255,255,255,0.12)",
      }}
    >
      {t("tierPricing")}
    </h2>

    <Sparkles
      size={16}
      className="text-primary drop-shadow-[0_0_8px_rgba(255,131,208,0.7)]"
      fill="currentColor"
    />
    
  </div>
                </div>

                {/* Pricing Tier Selection Cards */}
                <div className="flex flex-col gap-2.5">
                  {[
                    { qty: 1, price: product.price, label: '1 unité', discount: 0 },
                    ...(product.price_2 ? [{ 
                      qty: 2, 
                      price: product.price_2, 
                      label: '2 unités', 
                      discount: Math.round(((product.price - product.price_2) / product.price) * 100)
                    }] : []),
                    ...(product.price_3plus ? [{ 
                      qty: 3, 
                      price: product.price_3plus, 
                      label: '3+ unités', 
                      discount: Math.round(((product.price - product.price_3plus) / product.price) * 100),
                      badge: true
                    }] : []),
                  ].map((tier) => (
                    <button
                      key={tier.qty}
                      type="button"
                      onClick={() => setQty(tier.qty)}
                      className="relative group/tier transition-all duration-300 ease-out"
                    >
                      {/* Selected Tier - Premium Gradient */}
                      {qty >= tier.qty && (
                        <div 
                          className="absolute inset-0 rounded-[18px]"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255, 131, 208, 0.25) 0%, rgba(247, 209, 112, 0.2) 100%)',
                            boxShadow: '0 12px 40px -8px rgba(255, 131, 208, 0.35), inset 0 0 1px rgba(255, 255, 255, 0.15)',
                            animation: 'pulse 3s ease-in-out infinite',
                          }}
                        />
                      )}

                      <div
                        className={cn(
                          'relative px-4 py-3.5 rounded-[18px] border transition-all duration-300 ease-out flex items-center justify-between gap-3',
                          qty >= tier.qty
                            ? 'border-primary/60 bg-gradient-to-r from-primary/15 to-gold/10 shadow-[0_8px_24px_rgba(255,131,208,0.25)]'
                            : 'border-border/40 bg-card/30 hover:border-primary/30 hover:bg-card/50'
                        )}
                      >
                        {/* Radio Indicator */}
                        <div className={cn(
                          'relative w-5 h-5 rounded-full border-2 transition-all duration-300 flex-shrink-0',
                          qty >= tier.qty
                            ? 'border-primary bg-primary/20'
                            : 'border-border/60 group-hover/tier:border-primary/40'
                        )}>
                          {qty >= tier.qty && (
                            <div 
                              className="absolute inset-2 rounded-full"
                              style={{
                                background: 'var(--primary)',
                                boxShadow: '0 0 12px rgba(255, 131, 208, 0.6)',
                              }}
                            />
                          )}
                        </div>

                        {/* Pricing Info */}
                        <div className="flex-1 text-left">
                          <div className="text-sm font-bold tracking-tight text-foreground">
                            {tier.price} <span className="text-xs font-semibold text-muted-foreground">MAD</span>
                          </div>
                          <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                            {tier.label}
                          </div>
                        </div>

                        {/* Discount Badge & Best Value Badge */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {tier.badge && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.1em]" 
                              style={{
                                background: 'linear-gradient(135deg, rgba(255, 131, 208, 0.2) 0%, rgba(247, 209, 112, 0.15) 100%)',
                                color: 'var(--gold)',
                                border: '1px solid rgba(247, 209, 112, 0.3)',
                              }}>
                              ⭐ Best Value
                            </span>
                          )}
                          {tier.discount > 0 && !tier.badge && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-[9px] font-bold"
                              style={{
                                background: 'rgba(255, 131, 208, 0.15)',
                                color: 'var(--primary)',
                                border: '1px solid rgba(255, 131, 208, 0.3)',
                              }}>
                              -{tier.discount}%
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* QUANTITY SELECTOR - Modern Capsule */}
              <div className="space-y-2.5 pt-2">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground text-center">
                  {t('quantity')}
                </p>
                <div 
                  className="inline-flex w-full items-center justify-center gap-3 rounded-full border px-6 py-3"
                  style={{
                    background: 'rgba(17, 16, 23, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 131, 208, 0.15)',
                    boxShadow: '0 0 20px rgba(255, 131, 208, 0.1), inset 0 0 1px rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full h-9 w-9 hover:bg-primary/20 transition-all duration-200"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                  >
                    <Minus className="size-4 text-primary" />
                  </Button>
                  <span className="min-w-[2rem] text-center text-base font-bold text-foreground tracking-wide">
                    {qty}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full h-9 w-9 hover:bg-primary/20 transition-all duration-200"
                    onClick={() => setQty(qty + 1)}
                  >
                    <Plus className="size-4 text-primary" />
                  </Button>
                </div>
              </div>

              {/* TOTAL SECTION - Large Glass Card */}
              <div 
                className="rounded-[18px] border text-center backdrop-blur-md"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 131, 208, 0.1) 0%, rgba(247, 209, 112, 0.08) 100%)',
                  border: '1px solid rgba(247, 209, 112, 0.25)',
                  boxShadow: '0 8px 32px rgba(255, 131, 208, 0.15), inset 0 0 1px rgba(255, 255, 255, 0.1)',
                }}
              >
                <p className="text-[10px] uppercase font-bold tracking-[0.25em] text-muted-foreground">
                  {t('total')}
                </p>
                <div 
                  className="text-3xl font-black tracking-tight"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--gold) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 0 20px rgba(255, 131, 208, 0.2)',
                  }}
                >
                  {total} <span className="text-lg font-bold text-muted-foreground">MAD</span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              {product.stock === 0 ? (
                <div 
                  className="rounded-[18px] border px-4 py-3.5 text-sm font-semibold text-center flex items-center justify-center gap-2"
                  style={{
                    background: 'rgba(255, 131, 208, 0.08)',
                    border: '1px solid rgba(255, 131, 208, 0.22)',
                    color: 'var(--primary)',
                  }}
                >
                  <AlertCircle className="size-4" /> {t('temporarilyUnavailable')}
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Primary CTA - Add to Cart */}
                  <button
                    onClick={addToCart}
                    className="relative w-full group/btn overflow-hidden rounded-[18px] px-2 py-2 font-bold uppercase tracking-[0.1em] text-sm transition-all duration-300 flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, var(--primary) 0%, rgba(255, 131, 208, 0.8) 45%, var(--gold) 100%)',
                      backgroundSize: '200% 200%',
                      color: '#111011',
                      boxShadow: '0 12px 40px -8px rgba(255, 131, 208, 0.4)',
                      border: '1px solid rgba(255, 131, 208, 0.2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 20px 50px -10px rgba(255, 131, 208, 0.5), inset 0 0 20px rgba(255, 131, 208, 0.12)';
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 12px 40px -8px rgba(255, 131, 208, 0.4)';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    }}
                  >
                    <ShoppingBag className="size-5" />
                    {t('addToCart')}
                  </button>

                  {/* Secondary CTA - Order Now */}
                  <button
                    onClick={() => { addToCart(); navigate('/cart') }}
                    className="relative w-full group/btn overflow-hidden rounded-[18px] px-1 py-1 font-bold uppercase tracking-[0.1em] text-sm transition-all duration-300 flex items-center justify-center gap-2"
                    style={{
                      background: 'rgba(255, 131, 208, 0.05)',
                      color: 'var(--primary)',
                      border: '1.5px solid rgba(255, 131, 208, 0.4)',
                      boxShadow: '0 0 20px rgba(255, 131, 208, 0.15)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 131, 208, 0.12)';
                      e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 131, 208, 0.25)';
                      e.currentTarget.style.borderColor = 'rgba(255, 131, 208, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 131, 208, 0.05)';
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 131, 208, 0.15)';
                      e.currentTarget.style.borderColor = 'rgba(255, 131, 208, 0.4)';
                    }}
                  >
                    ⚡ {t('orderNow')}
                  </button>
                </div>
              )}

              {cartItem && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-center"
                    style={{
                      background: 'linear-gradient(135deg, var(--primary) 0%, var(--gold) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                    ✓ {cartItem.quantity} {t('inYourCart')}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-1 text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                    <div 
                      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-semibold"
                      style={{
                        background: 'rgba(247, 209, 112, 0.12)',
                        color: 'var(--gold)',
                        border: '1px solid rgba(247, 209, 112, 0.25)',
                        boxShadow: '0 0 16px rgba(247, 209, 112, 0.14)',
                      }}
                    >
                      <Package className="size-3" />
                      {product.stock} {t('available')}
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-card/55 px-3 py-1">
                      <ShieldCheck className="size-3 text-primary" />
                      Secure checkout
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-card/55 px-3 py-1">
                      <Truck className="size-3 text-primary" />
                      Fast delivery
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {product.ingredients && (
            <div 
              className="rounded-[18px] border px-5 py-4 backdrop-blur-md"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 131, 208, 0.08) 0%, rgba(247, 209, 112, 0.06) 100%)',
                border: '1px solid rgba(255, 131, 208, 0.15)',
                boxShadow: '0 0 20px rgba(255, 131, 208, 0.1)',
              }}
            >
              <p className="text-xs text-center uppercase tracking-[0.2em] text-muted-foreground mb-3 font-bold">
                ✨ {t('ingredients')}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">{product.ingredients}</p>
            </div>
          )}
        </div>
      </div>

      {product.comparatives_images && product.comparatives_images.length > 0 && (
  <div className="mt-10 flex gap-3 overflow-x-auto">
    {(product.comparatives_images ?? []).map((src, i) => (
      <div
        key={src + i}
        className="min-w-[72%] sm:min-w-[48%] md:min-w-[32%] aspect-[4/5] rounded-2xl overflow-hidden bg-muted"
      >
        <img
          src={src}
          alt={`Comparative ${i + 1}`}
          className="w-full h-full object-contain"
        />
      </div>
    ))}
  </div>
)}

      {product.others_images && product.others_images.length > 0 && (
  <div className="flex flex-col gap-3">
    {(product.others_images ?? []).map((src, i) => (
      <div
        key={src + i}
        className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-muted"
      >
        <img
          src={src}
          alt={`Others ${i + 1}`}
          className="w-full h-full object-contain"
        />
      </div>
    ))}
  </div>
)}

    </div>
  )
}
