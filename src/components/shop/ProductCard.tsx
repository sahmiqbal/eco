import { Link } from 'react-router-dom'
import { ShoppingBag, Package, CircleAlert as AlertCircle, Star } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../ui/carousel'
import { useCartStore } from '../../store/cartStore'
import { useLanguage } from '../../lib/language'
import type { Product } from '../../types'
import { cn, getProductImages } from '../../lib/utils'

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { t } = useLanguage()
  const addItem = useCartStore((s) => s.addItem)
  const isOutOfStock = product.stock === 0
  const isPack = product.category === 'pack'

  const discount = product.price_2
    ? Math.round(((product.price - product.price_2) / product.price) * 100)
    : null
  const slides = getProductImages(product)
  const carouselSlides = slides.length
    ? Array.from({ length: 4 }, (_, index) => slides[index % slides.length])
    : []

  return (
    <div className={cn(
      'animated-card-border group relative flex flex-col overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl',
      className
    )}>
      {isOutOfStock && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[2rem] bg-background/70 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-2xl px-4 py-3 flex items-center gap-2 shadow-sm">
            <AlertCircle className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">{t('outOfStock')}</span>
          </div>
        </div>
      )}

      <Link to={`/shop/${product.slug}`} className="block overflow-hidden rounded-t-[2rem]">
        <div className="relative bg-card">
          <Carousel opts={{ loop: true }} className="relative">
            <CarouselContent className="w-full">
              {carouselSlides.length > 0 ? (
                carouselSlides.map((src, index) => (
                  <CarouselItem key={`${product.id}-slide-${index}`}>
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[2rem] bg-muted">
                        <img
                          src={src}
                          alt={`${product.name} image ${index + 1}`}
                          loading="lazy"
                          className="h-full w-full object-contain"
                        />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem>
                  <div className="relative aspect-[4/3] w-full flex items-center justify-center bg-muted rounded-t-[2rem]">
                    <Package className="size-12 text-muted-foreground/30" />
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
          <div className="absolute inset-x-0 top-3 flex items-start justify-between w-full">
            <div className="flex flex-wrap gap-2">
              {isPack && (
                <Badge className="bg-gold/15 text-gold text-[10px] font-bold rounded-full px-3 py-1.5 shadow-sm">
                  {t('packBadge')}
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              {isPack && (
                <Badge className="bg-gold/15 text-gold text-[10px] font-semibold rounded-full px-3 py-1.5 flex items-center gap-1 shadow-sm">
                  <Star className="size-3.5 fill-gold" />
                  {t('bestseller')}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-4 p-2 text-center md:p-2">
        <div>
          <Link to={`/shop/${product.slug}`} className="block">
            <h3 className="font-semibold text-sm text-foreground transition-colors hover:text-primary line-clamp-2 leading-snug md:text-base">
              {product.name}
            </h3>
          </Link>

          {product.description && (
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-2 md:text-sm">
              {product.description}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary md:text-xl">{product.price} MAD</span>
              {discount && !isPack && (
                <Badge variant="secondary" className="text-xs px-2 py-1 rounded-full">-{discount}%</Badge>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 text-[11px] text-muted-foreground sm:grid-cols-2">
              {product.price_2 && (
                <div className="rounded-2xl border border-pink-300 bg-muted/10 px-3 py-2 text-[11px]">
                  {t('twoUnits', { price: product.price_2 })}
                </div>
              )}
              {product.price_3plus && (
                <div className="rounded-2xl border border-pink-300 bg-muted/10 px-3 py-2 text-[11px]">
                  {t('threePlusUnits', { price: product.price_3plus })}
                </div>
              )}
            </div>
          </div>

          <Button
            type="button"
            size="sm"
            className="w-full rounded-full gap-2 text-xs md:text-sm"
            disabled={isOutOfStock}
            onClick={() => addItem(product, 1)}
          >
            <ShoppingBag className="size-4" />
            {t('addToCart')}
          </Button>
        </div>
      </div>
    </div>
  )
}
