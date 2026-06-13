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
          <div className="absolute inset-0 flex flex-col items-start justify-between p-3 pointer-events-none">
            <div className="flex justify-between w-full">
              {isPack && (
                <>
                  <Badge className="bg-gold/15 text-gold text-[10px] font-bold rounded-lg px-3 py-1.5 shadow-md">
                    {t('packBadge')}
                  </Badge>
                  <Badge className="bg-gold/15 text-gold text-[9px] font-semibold rounded-lg px-3 py-1.5 flex items-center gap-1">
                    <Star className="size-3.5 fill-gold" />
                    {t('bestseller')}
                  </Badge>
                  
                </>
                )}
                {discount && !isPack && (
                  <Badge className="bg-primary text-primary-foreground text-[10px] font-bold rounded-lg px-3 py-1.5 shadow-md">
                    -{discount}%
                  </Badge>
                )}
            </div>
            
          </div>
        </div>
      </Link>

      <div className="p-3 flex flex-col items-center justify-between text-center" style={{ minHeight: '240px' }}>
        <Link to={`/shop/${product.slug}`} className="w-full">
          <h3 className="font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="flex flex-col items-center gap-3 mt-1 w-full">
          <div className="flex flex-col items-center gap-3 w-full">
            
            <div className="flex items-center gap-2">
              
              <span className="text-lg font-bold text-primary">{product.price} MAD</span>
              {discount && !isPack && (
                <Badge variant="secondary" className="text-xs px-2 py-1 rounded-full">-{discount}%</Badge>
              )}
            </div>

            <div className="flex justify-center w-full gap-2 text-[11px] text-muted-foreground sm:grid-cols-2">
              {product.price_2 && (
                <div className="rounded-2xl border border-pink-300 bg-muted/10 px-2 py-2 flex items-center justify-between">
                  <span>{t('twoUnits', { price: product.price_2 })}</span>
                 
                </div>
              )}
              {product.price_3plus && (
                <div className="rounded-2xl border border-pink-300 bg-muted/10 px-2 py-2 flex items-center justify-between">
                  <span>{t('threePlusUnits', { price: product.price_3plus })}</span>
                  
                </div>
              )}
            </div>
          </div>

          <Button
            type="button"
            size="sm"
            className="w-full rounded-xl gap-1.5 text-xs"
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
