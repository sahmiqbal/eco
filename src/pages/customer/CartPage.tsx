import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useCartStore, getBundlePrice } from '@/store/cartStore'
import { getProductImage } from '@/lib/utils'
import { useLanguage } from '@/lib/language'

export function CartPage() {
  const { t } = useLanguage()
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore()
  const navigate = useNavigate()
  const total = totalPrice()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 max-w-2xl py-20 text-center animate-fade-up">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="size-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">{t('emptyCartTitle')}</h2>
        <p className="text-muted-foreground text-sm mb-8">{t('emptyCartText')}</p>
        <Button className="rounded-xl gap-2 bg-primary hover:bg-primary/90 text-white font-semibold" asChild>
          <Link to="/shop">
            <ShoppingBag className="size-4" /> {t('discoverProducts')}
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-5xl py-8 animate-fade-up">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8 text-center">{t('myCart')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => {
            const unitPrice = getBundlePrice(product, quantity)
            const subtotal = unitPrice * quantity
            return (
              <div
  key={product.id}
  className="
    rounded-[32px]
    border border-pink-500/20
    bg-black/60
    backdrop-blur-xl
    p-5
    flex flex-col gap-5
    shadow-[0_0_40px_rgba(236,72,153,0.08)]
    transition-all duration-300
    hover:border-pink-400/30
    hover:shadow-[0_0_60px_rgba(236,72,153,0.12)]
  "
>
  {/* Image */}
  <div className="w-full h-56 rounded-[24px] overflow-hidden bg-muted">
    {getProductImage(product) ? (
      <img
        src={getProductImage(product)!}
        alt={product.name}
        className="
          w-full h-full
          object-cover
          transition-transform duration-700
          hover:scale-105
        "
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center">
        <Package className="size-10 text-muted-foreground/40" />
      </div>
    )}
  </div>

  {/* Title */}
  <div className="flex items-center gap-3 flex-wrap">
    <h3
      className="
        text-white
        text-2xl
        font-semibold
        tracking-tight
        leading-tight
        flex-1
      "
    >
      {product.name}
    </h3>

    {product.category === "pack" && (
      <Badge
        className="
          rounded-full
          bg-pink-500/15
          text-pink-400
          border border-pink-500/20
          px-3 py-1
        "
      >
        {t('packBadge')}
      </Badge>
    )}
  </div>

  {/* Quantity + Delete */}
  <div className="flex items-center gap-3">
    <div
      className="
        flex-1
        h-14
        rounded-full
        border border-pink-500/20
        bg-white/[0.03]
        backdrop-blur-md
        flex items-center justify-between
        px-3
      "
    >
      <Button
        variant="ghost"
        size="icon"
        className="
          h-10 w-10
          rounded-full
          bg-pink-500/10
          hover:bg-pink-500/20
          text-pink-300
        "
        onClick={() => updateQuantity(product.id, quantity - 1)}
      >
        <Minus className="size-4" />
      </Button>

      <span className="text-lg font-semibold text-white">
        {quantity}
      </span>

      <Button
        variant="ghost"
        size="icon"
        className="
          h-10 w-10
          rounded-full
          bg-pink-500/10
          hover:bg-pink-500/20
          text-pink-300
        "
        onClick={() => updateQuantity(product.id, quantity + 1)}
      >
        <Plus className="size-4" />
      </Button>
    </div>

    <Button
      variant="ghost"
      size="icon"
      className="
        h-14 w-14
        rounded-full
        border border-red-500/20
        bg-red-500/5
        text-red-400
        hover:bg-red-500/10
      "
      onClick={() => removeItem(product.id)}
    >
      <Trash2 className="size-5" />
    </Button>
  </div>

  {/* Price */}
  <div>
    <p
      className="
      text-center
        text-5xl
        font-black
        tracking-tight
        bg-gradient-to-r
        from-pink-500
        via-pink-300
        to-amber-300
        bg-clip-text
        text-transparent
      "
    >
      {subtotal} MAD
    </p>

    <p className="text-zinc-200 font-bold text-center text-sm mt-1">
      {unitPrice} MAD each
    </p>
  </div>
</div>
            )
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="border border-primary/20 rounded-[2rem] p-6 shadow-[0_10px_40px_-15px_rgba(213,82,163,0.15)] lg:sticky lg:top-24">
            <h3 className="font-bold text-2xl text-foreground mb-5 text-center">{t('orderSummary')}</h3>
            {items.map(({ product, quantity }) => {
              const unitPrice = getBundlePrice(product, quantity)
              return (
                <div key={product.id} className="flex flex-col gap-1 text-sm">
                  <span className="text-primary text-center font-bold line-clamp-2">{product.name}</span>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-foreground/70 font-bold">× {quantity}</span>
                    <span className="font-semibold text-foreground">{unitPrice * quantity} MAD</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid gap-3 py-4 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/70">{t('subtotal')}</span>
              <span className="font-semibold text-foreground">{total} MAD</span>
            </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">{t('deliveryFee')}</span>
                <span className="font-semibold text-green-600">{t('free') ?? 'Free'}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-foreground">{t('total')}</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-primary">{total} MAD</span>
            </div>

            <Button
              size="lg"
              className="w-full rounded-[1.5rem] gap-2 shadow-md bg-primary hover:bg-primary/90 text-white font-semibold"
              onClick={() => navigate('/checkout')}
            >
              {t('checkout')} <ArrowRight className="size-4" />
            </Button>

            <Button variant="ghost" size="sm" className="w-full mt-3 text-primary hover:text-primary hover:bg-primary/5" asChild>
              <Link to="/shop">{t('continueShopping')}</Link>
            </Button>
          </div>
        </div>
      </div>
    
  )
}
