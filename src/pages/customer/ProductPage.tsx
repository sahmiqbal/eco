import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ShoppingBag, ArrowLeft, Package, Star, CircleCheck as CheckCircle, Minus, Plus, CircleAlert as AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useCartStore, getBundlePrice } from '@/store/cartStore'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types'
import { cn } from '@/lib/utils'

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const { addItem, items } = useCartStore()

  const cartItem = items.find((i) => i.product.id === product?.id)

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data }) => {
        setProduct(data as Product | null)
        setLoading(false)
      })
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
    <div className="container mx-auto px-4 max-w-5xl py-8 animate-fade-up">
      <Button variant="ghost" size="sm" className="mb-6 gap-2 text-muted-foreground" onClick={() => navigate(-1)}>
        <ArrowLeft className="size-4" /> Retour
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="relative">
          <div className="aspect-square rounded-2xl overflow-hidden bg-secondary border border-border">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="size-20 text-muted-foreground/30" />
              </div>
            )}
          </div>
          {product.category === 'pack' && (
            <Badge className="absolute top-4 left-4 bg-gold text-gold-foreground shadow-md">
              ✦ PACK COMPLET
            </Badge>
          )}
        </div>

        <div className="flex flex-col">
          <div className="mb-2">
            <Badge variant="outline" className="text-xs mb-2">
              {product.category === 'pack' ? 'Pack Hammam' : 'Produit individuel'}
            </Badge>
            {product.category === 'pack' && (
              <div className="flex gap-0.5 mb-2">
                {[1,2,3,4,5].map((s) => <Star key={s} className="size-4 fill-gold text-gold" />)}
                <span className="text-xs text-muted-foreground ml-1">Bestseller</span>
              </div>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{product.name}</h1>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed mb-4">{product.description}</p>

          {product.category === 'pack' && (
            <div className="bg-secondary/60 rounded-xl p-4 mb-4">
              <p className="text-xs font-semibold text-foreground mb-2">Ce pack comprend :</p>
              <ul className="grid grid-cols-2 gap-1">
                {['Savon Beldi', 'Tebrima', 'Gommage Corps', 'Huile Capillaire', 'Crème Éclaircissante', 'Cadeau 🎁'].map((item) => (
                  <li key={item} className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <CheckCircle className="size-3 text-primary shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Separator className="my-4" />

          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Tarifs dégressifs :</p>
            <div className="flex gap-2 flex-wrap">
              {[
                { qty: 1, price: product.price, label: '1 unité' },
                ...(product.price_2 ? [{ qty: 2, price: product.price_2, label: '2 unités' }] : []),
                ...(product.price_3plus ? [{ qty: 3, price: product.price_3plus, label: '3+ unités' }] : []),
              ].map((tier) => (
                <button
                  key={tier.qty}
                  onClick={() => setQty(tier.qty)}
                  className={cn(
                    'px-3 py-2 rounded-xl text-xs border transition-all',
                    qty >= tier.qty
                      ? 'border-primary bg-primary/5 text-primary font-semibold'
                      : 'border-border text-muted-foreground hover:border-primary/50'
                  )}
                >
                  <span className="block font-bold">{tier.price} MAD</span>
                  <span>{tier.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-border rounded-xl">
              <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setQty(Math.max(1, qty - 1))}>
                <Minus className="size-4" />
              </Button>
              <span className="w-10 text-center text-sm font-semibold">{qty}</span>
              <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setQty(qty + 1)}>
                <Plus className="size-4" />
              </Button>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{total} MAD</p>
              <p className="text-xs text-muted-foreground">{unitPrice} MAD / unité</p>
            </div>
          </div>

          {product.stock === 0 ? (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-xl text-muted-foreground text-sm">
              <AlertCircle className="size-4" /> Rupture de stock
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="flex-1 rounded-xl gap-2 shadow-md" onClick={addToCart}>
                <ShoppingBag className="size-5" />
                Ajouter au panier
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl" onClick={() => { addToCart(); navigate('/cart') }}>
                Commander maintenant
              </Button>
            </div>
          )}

          {cartItem && (
            <p className="text-xs text-primary mt-2 text-center">
              ✓ {cartItem.quantity} dans votre panier
            </p>
          )}

          {product.ingredients && (
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs font-semibold text-foreground mb-1">Ingrédients</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{product.ingredients}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
