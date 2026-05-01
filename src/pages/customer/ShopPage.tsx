import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, ShoppingBag } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/shop/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types'

const CATEGORIES = [
  { value: 'all', label: 'Tout' },
  { value: 'pack', label: '✦ Packs' },
  { value: 'individual', label: 'Individuels' },
]

export function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') ?? 'all'

  useEffect(() => {
    setLoading(true)
    let query = supabase.from('products').select('*').order('is_featured', { ascending: false }).order('created_at')
    if (category !== 'all') query = query.eq('category', category)
    query.then(({ data }) => {
      setProducts((data as Product[]) ?? [])
      setLoading(false)
    })
  }, [category])

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 animate-fade-up">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Notre Boutique</h1>
        <p className="text-muted-foreground text-sm">Découvrez nos soins naturels marocains</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit..."
            className="pl-9 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <Button
              key={c.value}
              size="sm"
              variant={category === c.value ? 'default' : 'outline'}
              className="rounded-xl"
              onClick={() => {
                const params = new URLSearchParams()
                if (c.value !== 'all') params.set('category', c.value)
                setSearchParams(params)
                setSearch('')
              }}
            >
              {c.label}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-card rounded-2xl border overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-8 w-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="size-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Aucun produit trouvé</h3>
          <p className="text-sm text-muted-foreground">Essayez une autre recherche</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-muted-foreground mb-4">
            {filtered.length} produit{filtered.length > 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
