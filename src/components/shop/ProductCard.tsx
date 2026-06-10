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
      'group relative bg-card rounded-2xl border border-border overflow-hidden',
      'shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1',
      className
    )}>
      {isOutOfStock && (
        <div className="absolute inset-0 bg-background/60 z-20 flex items-center justify-center rounded-2xl">
          <div className="bg-background border border-border rounded-xl px-4 py-2 flex items-center gap-2 shadow-md">
            <AlertCircle className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">{t('outOfStock')}</span>
          </div>
        </div>
      )}

      <Link to={`/shop/${product.slug}`} className="block">
        <div className="relative overflow-hidden bg-card">
          <Carousel opts={{ loop: true }} className="relative">
            <CarouselContent className="w-full">
              {carouselSlides.length > 0 ? (
                carouselSlides.map((src, index) => (
                  <CarouselItem key={`${product.id}-slide-${index}`}>
                    <div className="relative h-full w-full overflow-hidden rounded-t-2xl">
                      <img
                        src={src}
                        alt={`${product.name} image ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem>
                  <div className="relative h-full w-full flex items-center justify-center">
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

          <div className="absolute inset-x-0 top-2 flex items-center justify-between px-3">
            {isPack ? (
              <Badge className="bg-gold text-gold-foreground text-[10px] font-semibold px-2 py-1 shadow-sm">
                {t('packBadge')}
              </Badge>
            ) : discount ? (
              <Badge className="bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-1">
                -{discount}%
              </Badge>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="p-3 flex flex-col justify-between" style={{ minHeight: '220px' }}>
        <div>
          {isPack && (
            <div className="flex items-center gap-1 mb-1">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className="size-3 fill-gold text-gold" />
              ))}
              <span className="text-[10px] text-muted-foreground ml-1">{t('bestseller')}</span>
            </div>
          )}
        </div>
        <Link to={`/shop/${product.slug}`}>
          <h3 className="font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="flex items-end justify-between gap-2 mt-2">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">{product.price} MAD</span>
              {discount && !isPack && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">-{discount}%</Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground space-y-0.5">
              {product.price_2 && (
                <p>{t('twoUnits', { price: product.price_2 })}</p>
              )}
              {product.price_3plus && (
                <p>{t('threePlusUnits', { price: product.price_3plus })}</p>
              )}
              <p>{t('stockAvailability', { count: product.stock })}</p>
            </div>
          </div>

          <Button
            type="button"
            size="sm"
            className="shrink-0 rounded-xl gap-1.5 text-xs"
            disabled={isOutOfStock}
            onClick={() => addItem(product)}
          >
            <ShoppingBag className="size-3.5" />
            {t('addToCart')}
          </Button>
        </div>
      </div>
    </div>
  )
}
