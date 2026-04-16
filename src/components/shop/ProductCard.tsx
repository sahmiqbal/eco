import { Link } from 'react-router-dom'
import { ShoppingBag, Package, CircleAlert as AlertCircle, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const isOutOfStock = product.stock === 0
  const isPack = product.category === 'pack'

  const discount = product.price_2
    ? Math.round(((product.price - product.price_2) / product.price) * 100)
    : null

  return (
    <div className={cn(
      'group relative bg-card rounded-2xl border border-border overflow-hidden',
      'shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1',
      className
    )}>
      {isPack && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-gold text-gold-foreground text-[10px] font-semibold px-2 py-0.5 shadow-sm">
            ✦ PACK
          </Badge>
        </div>
      )}
      {discount && !isPack && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-primary text-primary-foreground text-[10px] font-semibold">
            -{discount}%
          </Badge>
        </div>
      )}
      {isOutOfStock && (
        <div className="absolute inset-0 bg-background/60 z-20 flex items-center justify-center rounded-2xl">
          <div className="bg-background border border-border rounded-xl px-4 py-2 flex items-center gap-2 shadow-md">
            <AlertCircle className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Rupture de stock</span>
          </div>
        </div>
      )}

      <Link to={`/shop/${product.slug}`}>
        <div className="aspect-square overflow-hidden bg-secondary">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="size-16 text-muted-foreground/30" />
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        {isPack && (
          <div className="flex items-center gap-1 mb-1.5">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} className="size-3 fill-gold text-gold" />
            ))}
            <span className="text-[10px] text-muted-foreground ml-1">Bestseller</span>
          </div>
        )}
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

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary">{product.price} MAD</span>
            </div>
            {product.price_2 && (
              <p className="text-[10px] text-muted-foreground">
                2 unités: <span className="font-semibold text-foreground">{product.price_2} MAD</span>
              </p>
            )}
          </div>

          <Button
            size="sm"
            className="shrink-0 rounded-xl gap-1.5 text-xs"
            disabled={isOutOfStock}
            onClick={() => addItem(product)}
          >
            <ShoppingBag className="size-3.5" />
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  )
}
