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
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8 text-center">Your Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => {
            const unitPrice = getBundlePrice(product, quantity)
            const subtotal = unitPrice * quantity
            return (
              <div key={product.id} className="bg-white border border-border rounded-[2rem] p-5 sm:p-6 flex flex-col gap-4 hover:shadow-lg transition sm:flex-row sm:items-center">
                <div className="w-full sm:w-32 h-52 sm:h-32 rounded-[1.5rem] overflow-hidden bg-muted shrink-0">
                  {getProductImage(product) ? (
                    <img src={getProductImage(product)!} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="size-10 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between gap-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-bold text-lg sm:text-xl text-foreground leading-tight tracking-tight line-clamp-2">{product.name}</h3>
                      {product.category === 'pack' && (
                        <Badge className="bg-primary/10 text-primary border-0 text-xs mt-2">Pack</Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0 text-muted-foreground hover:text-primary"
                      onClick={() => removeItem(product.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center sm:justify-between">
                    <div className="flex items-center border border-border rounded-2xl bg-background overflow-hidden">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-none"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <span className="w-10 text-center text-sm font-semibold text-foreground">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-none"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                    <div className="text-center">
                      <p className="font-extrabold text-primary text-3xl sm:text-2xl">{subtotal} MAD</p>
                      <p className="text-xs text-muted-foreground mt-1">{unitPrice} MAD each</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-primary/20 rounded-[2rem] p-6 shadow-[0_10px_40px_-15px_rgba(213,82,163,0.15)] lg:sticky lg:top-24">
            <h3 className="font-bold text-2xl text-foreground mb-5 text-center">Order Summary</h3>

            <div className="space-y-4 mb-4 bg-background rounded-[1.5rem] p-4">
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
                <span className="text-foreground/70">Subtotal</span>
                <span className="font-semibold text-foreground">{total} MAD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">Delivery</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-foreground">Total</span>
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
    </div>
  )
}
