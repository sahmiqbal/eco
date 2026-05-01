import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useCartStore, getBundlePrice } from '@/store/cartStore'
import { getProductImage } from '@/lib/utils'

export function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore()
  const navigate = useNavigate()
  const total = totalPrice()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 max-w-2xl py-20 text-center animate-fade-up">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
          <ShoppingBag className="size-10 text-muted-foreground/50" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Votre panier est vide</h2>
        <p className="text-muted-foreground text-sm mb-6">Découvrez nos produits et commencez votre rituel beauté</p>
        <Button className="rounded-xl gap-2" asChild>
          <Link to="/shop">
            <ShoppingBag className="size-4" /> Découvrir nos produits
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl py-8 animate-fade-up">
      <h1 className="text-2xl font-bold text-foreground mb-6">Mon Panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map(({ product, quantity }) => {
            const unitPrice = getBundlePrice(product, quantity)
            const subtotal = unitPrice * quantity
            return (
              <div key={product.id} className="bg-card border border-border rounded-2xl p-4 flex gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-secondary shrink-0">
                  {getProductImage(product) ? (
                    <img src={getProductImage(product)!} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="size-8 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-sm text-foreground line-clamp-2">{product.name}</h3>
                      {product.category === 'pack' && (
                        <Badge className="bg-gold/10 text-gold border-0 text-[10px] mt-0.5">Pack</Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(product.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                      >
                        <Minus className="size-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                      >
                        <Plus className="size-3" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{subtotal} MAD</p>
                      <p className="text-[10px] text-muted-foreground">{unitPrice} MAD/u</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-5 sticky top-24">
            <h3 className="font-semibold text-foreground mb-4">Récapitulatif</h3>

            <div className="space-y-2 mb-4">
              {items.map(({ product, quantity }) => {
                const unitPrice = getBundlePrice(product, quantity)
                return (
                  <div key={product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">{product.name} ×{quantity}</span>
                    <span className="font-medium shrink-0">{unitPrice * quantity} MAD</span>
                  </div>
                )
              })}
            </div>

            <Separator className="my-3" />

            <div className="flex justify-between items-center mb-5">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold text-primary">{total} MAD</span>
            </div>

            <Button
              size="lg"
              className="w-full rounded-xl gap-2 shadow-md"
              onClick={() => navigate('/checkout')}
            >
              Commander <ArrowRight className="size-4" />
            </Button>

            <Button variant="ghost" size="sm" className="w-full mt-2 text-muted-foreground" asChild>
              <Link to="/shop">Continuer les achats</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
