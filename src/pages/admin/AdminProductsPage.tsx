import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Save, Package, Loader as Loader2, Star, CircleAlert as AlertCircle, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel
} from '@/components/ui/alert-dialog'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types'

type ProductForm = Omit<Product, 'id' | 'created_at'>

const emptyForm: ProductForm = {
  name: '', slug: '', price: 0, price_2: null, price_3plus: null,
  image_url: '', description: '', ingredients: '',
  category: 'individual', stock: 0, is_featured: false,
}

function toSlug(name: string) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-')
}

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof ProductForm, string>>>({})

  useEffect(() => {
    supabase.from('products').select('*').order('created_at', { ascending: false })
      .then(({ data }) => {
        setProducts((data as Product[]) ?? [])
        setLoading(false)
      })
  }, [])

  const openNew = () => {
    setEditProduct(null)
    setForm(emptyForm)
    setErrors({})
    setDialogOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditProduct(p)
    setForm({
      name: p.name, slug: p.slug, price: p.price,
      price_2: p.price_2 ?? null, price_3plus: p.price_3plus ?? null,
      image_url: p.image_url ?? '', description: p.description,
      ingredients: p.ingredients, category: p.category,
      stock: p.stock, is_featured: p.is_featured,
    })
    setErrors({})
    setDialogOpen(true)
  }

  const validate = () => {
    const errs: Partial<Record<keyof ProductForm, string>> = {}
    if (!form.name.trim()) errs.name = 'Nom requis'
    if (!form.slug.trim()) errs.slug = 'Slug requis'
    if (form.price <= 0) errs.price = 'Prix invalide'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const save = async () => {
    if (!validate()) return
    setSaving(true)
    if (editProduct) {
      const { data } = await supabase.from('products').update(form).eq('id', editProduct.id).select().single()
      if (data) setProducts((prev) => prev.map((p) => p.id === editProduct.id ? data as Product : p))
    } else {
      const { data } = await supabase.from('products').insert(form).select().single()
      if (data) setProducts((prev) => [data as Product, ...prev])
    }
    setSaving(false)
    setDialogOpen(false)
  }

  const deleteProduct = async () => {
    if (!deleteTarget) return
    await supabase.from('products').delete().eq('id', deleteTarget.id)
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Produits</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{products.length} produit(s)</p>
        </div>
        <Button size="sm" className="rounded-xl gap-2 shadow-sm" onClick={openNew}>
          <Plus className="size-4" /> Nouveau
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input placeholder="Rechercher..." className="pl-9 rounded-xl" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Package className="size-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-semibold">Aucun produit</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((product) => (
            <div key={product.id} className="bg-card border border-border rounded-2xl flex items-center gap-3 p-3 hover:shadow-sm transition-shadow">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-secondary shrink-0">
                {product.image_url
                  ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><Package className="size-6 text-muted-foreground/40" /></div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-semibold text-sm truncate">{product.name}</p>
                  {product.is_featured && <Star className="size-3.5 fill-gold text-gold shrink-0" />}
                  <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                    {product.category === 'pack' ? 'Pack' : 'Individuel'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-xs font-bold text-primary">{product.price} MAD</span>
                  {product.price_2 && <span className="text-xs text-muted-foreground">×2: {product.price_2}</span>}
                  {product.price_3plus && <span className="text-xs text-muted-foreground">×3+: {product.price_3plus}</span>}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  {product.stock === 0
                    ? <span className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="size-3" /> Rupture</span>
                    : <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>
                  }
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button size="icon" variant="ghost" className="size-8 rounded-xl" onClick={() => openEdit(product)}>
                  <Pencil className="size-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="size-8 rounded-xl text-destructive hover:text-destructive" onClick={() => setDeleteTarget(product)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editProduct ? 'Modifier le produit' : 'Nouveau produit'}</DialogTitle>
            <DialogDescription>Remplissez les informations du produit</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label className="text-xs mb-1.5 block">Nom *</Label>
                <Input
                  className="rounded-xl"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value, slug: toSlug(e.target.value) })}
                  placeholder="Nom du produit"
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label className="text-xs mb-1.5 block">Slug *</Label>
                <Input className="rounded-xl font-mono text-xs" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} aria-invalid={!!errors.slug} />
                {errors.slug && <p className="text-xs text-destructive mt-1">{errors.slug}</p>}
              </div>
              <div>
                <Label className="text-xs mb-1.5 block">Catégorie</Label>
                <select
                  className="h-9 w-full rounded-xl border border-input bg-transparent px-3 text-sm"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as 'pack' | 'individual' })}
                >
                  <option value="individual">Individuel</option>
                  <option value="pack">Pack</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs mb-1.5 block">Prix (MAD) *</Label>
                <Input type="number" className="rounded-xl" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} aria-invalid={!!errors.price} />
                {errors.price && <p className="text-xs text-destructive mt-1">{errors.price}</p>}
              </div>
              <div>
                <Label className="text-xs mb-1.5 block">Prix ×2</Label>
                <Input type="number" className="rounded-xl" value={form.price_2 ?? ''} onChange={(e) => setForm({ ...form, price_2: e.target.value ? +e.target.value : null })} placeholder="Optionnel" />
              </div>
              <div>
                <Label className="text-xs mb-1.5 block">Prix ×3+</Label>
                <Input type="number" className="rounded-xl" value={form.price_3plus ?? ''} onChange={(e) => setForm({ ...form, price_3plus: e.target.value ? +e.target.value : null })} placeholder="Optionnel" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs mb-1.5 block">Stock</Label>
                <Input type="number" className="rounded-xl" value={form.stock} onChange={(e) => setForm({ ...form, stock: +e.target.value })} />
              </div>
              <div>
                <Label className="text-xs mb-1.5 block">URL Image</Label>
                <Input className="rounded-xl text-xs" value={form.image_url ?? ''} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="/image.webp" />
              </div>
            </div>

            <div>
              <Label className="text-xs mb-1.5 block">Description</Label>
              <Textarea className="rounded-xl min-h-[70px] text-sm" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <div>
              <Label className="text-xs mb-1.5 block">Ingrédients</Label>
              <Input className="rounded-xl text-sm" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded" />
              <Label htmlFor="featured" className="text-sm cursor-pointer flex items-center gap-1">
                <Star className="size-3.5 text-gold" /> Produit en vedette (page d'accueil)
              </Label>
            </div>

            <Separator />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
              <Button className="flex-1 rounded-xl gap-2 shadow-sm" onClick={save} disabled={saving}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce produit ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement <strong>{deleteTarget?.name}</strong>. Cette opération est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Annuler</AlertDialogCancel>
            <AlertDialogAction className="rounded-xl bg-destructive text-white hover:bg-destructive/90" onClick={deleteProduct}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
