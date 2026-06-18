import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, ShoppingBag } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/shop/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage } from '@/lib/language'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types'

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'pack', label: '✦ Packs' },
  { value: 'individual', label: 'Individual' },
]

export function ShopPage() {
  const { t } = useLanguage()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') ?? 'all'

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    let query = supabase.from('products').select('*').order('is_featured', { ascending: false }).order('created_at')
    if (category !== 'all') query = query.eq('category', category)
    if (search.trim()) {
      const searchValue = `%${search.trim()}%`
      query = query.or(`name.ilike.${searchValue},description.ilike.${searchValue}`)
    }

    query.then(({ data, error: queryError }) => {
      if (!isMounted) return
      if (queryError) {
        setError(queryError.message)
        setProducts([])
      } else {
        setProducts((data as Product[]) ?? [])
      }
      setLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [category, search])

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 animate-fade-up">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">{t('shopTitle')}</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search for a product..."
            className="pl-10 rounded-2xl border border-primary/20 bg-background/80 text-foreground shadow-[inset_0_0_20px_rgba(255,131,208,0.05)]"
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
              className="rounded-2xl bg-[linear-gradient(to_right,rgba(255,131,208,0.12)_1%,transparent_40%,transparent_60%,rgba(255,131,208,0.12)_100%)] border-2 border-primary px-4 py-2 text-sm font-medium shadow-[inset_0_0_10px_rgba(255,131,208,0.1),0_0_8px_rgba(255,131,208,0.08)] transition duration-300 hover:border-primary hover:text-primary"
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
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="size-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">{t('noProductsFound')}</h3>
          <p className="text-sm text-muted-foreground">{t('tryAnotherSearch' as any)}</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-muted-foreground mb-4">
            {products.length === 1
              ? t('productCountSingular')
              : t('productCountPlural', { count: products.length })}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
