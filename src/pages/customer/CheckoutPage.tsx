import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CircleCheck as CheckCircle, ChevronRight, MessageCircle, Phone, Package, ShoppingBag, ArrowLeft, User, MapPin, Loader as Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog'
import { useCartStore, getBundlePrice } from '@/store/cartStore'
import { supabase } from '@/lib/supabase'
import type { ContactPreference, CartItem } from '@/types'
import { cn, getProductImage } from '@/lib/utils'
import { toast } from 'sonner'

const MOROCCAN_CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès',
  'Oujda', 'Kenitra', 'Tétouan', 'Nador', 'Temara', 'El Jadida', 'Beni Mellal', 'Autre'
]

const STEPS = [
  { id: 1, label: 'Panier', icon: ShoppingBag },
  { id: 2, label: 'Infos', icon: User },
  { id: 3, label: 'Confirmation', icon: CheckCircle },
]

interface FormData {
  name: string
  phone: string
  city: string
  address: string
  contact_preference: ContactPreference
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, totalPrice, clearCart } = useCartStore()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [showCallDialog, setShowCallDialog] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [form, setForm] = useState<FormData>({
    name: '',
    phone: '',
    city: '',
    address: '',
    contact_preference: 'whatsapp',
  })

  const total = totalPrice()

  if (items.length === 0 && step !== 3) {
    return (
      <div className="container mx-auto px-4 max-w-lg py-20 text-center">
        <ShoppingBag className="size-12 text-muted-foreground/40 mx-auto mb-4" />
        <h2 className="text-lg font-semibold mb-2">Panier vide</h2>
        <Button asChild className="rounded-xl mt-2">
          <Link to="/shop">Retour à la boutique</Link>
        </Button>
      </div>
    )
  }

  const validate = (): boolean => {
    const errs: Partial<FormData> = {}
    if (!form.name.trim()) errs.name = 'Nom requis'
    if (!form.phone.match(/^(\+212|0)[5-7]\d{8}$/)) errs.phone = 'Numéro invalide (ex: 0612345678)'
    if (!form.city) errs.city = 'Ville requise'
    if (!form.address.trim()) errs.address = 'Adresse requise'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }
   
  const submitOrder = async () => {
  if (!validate()) return

  setSubmitting(true)
  setSubmitError(null)

  const orderItems = items.map(({ product, quantity }: CartItem) => ({
    product_id: product.id,
    product_name: product.name,
    quantity,
    unit_price: getBundlePrice(product, quantity),
    subtotal: getBundlePrice(product, quantity) * quantity,
  }))

  const { error } = await supabase
    .from('orders')
    .insert({
      name: form.name,
      phone: form.phone,
      city: form.city,
      address: form.address,
      items: orderItems,
      total,
      status: 'pending',
      contact_preference: form.contact_preference,
    })

  if (error) {
    setSubmitting(false)
    setSubmitError(error.message)
    return
  }

  setOrderId('OK')

  // optional: stock
  try {
    await supabase.rpc('decrement_stock', {
      items: items.map(({ product, quantity }) => ({
        product_id: product.id,
        quantity
      }))
    })
  } catch (_) {}

  setSubmitting(false)
  setStep(3)
}

  const handleConfirm = () => {
    clearCart()
    toast.success('Commande confirmée ! Votre panier a été vidé.')
    if (form.contact_preference === 'whatsapp') {
      const itemsText = items.map(({ product, quantity }: CartItem) =>
        `• ${product.name} ×${quantity} = ${getBundlePrice(product, quantity) * quantity} MAD`
      ).join('\n')
      const message = encodeURIComponent(
        `Bonjour Dar Nour 🌸\nJ'ai passé une commande:\n\n${itemsText}\n\nTotal: ${total} MAD\nNom: ${form.name}\nVille: ${form.city}\nAdresse: ${form.address}`
      )
      window.open(`https://wa.me/212715100043?text=${message}`, '_blank')
      navigate('/shop')
    } else {
      setShowCallDialog(true)
      setTimeout(() => {
        setShowCallDialog(false)
        navigate('/shop')
      }, 3000)
    }
  }

  return (
    <div className="container mx-auto px-4 max-w-2xl py-8 animate-fade-up">
      {/* Steps indicator */}
      <div className="flex items-center justify-center gap-1 mb-8">
        {STEPS.map((s, idx) => (
          <div key={s.id} className="flex items-center gap-1">
            <div className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
              step === s.id ? 'bg-primary text-primary-foreground shadow-sm' :
              step > s.id ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
            )}>
              <s.icon className="size-3.5" />
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <ChevronRight className="size-4 text-muted-foreground/40 mx-0.5" />
            )}
          </div>
        ))}
      </div>

      {/* ── Step 1: Cart Review ── */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Récapitulatif du panier</h2>
          {items.map(({ product, quantity }: CartItem) => {
            const price = getBundlePrice(product, quantity)
            return (
              <div key={product.id} className="flex gap-3 bg-card border border-border rounded-xl p-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-secondary shrink-0">
                  {getProductImage(product)
                    ? <img src={getProductImage(product)!} alt={product.name} className="w-full h-full object-cover" />
                    : <Package className="size-8 m-3 text-muted-foreground/40" />
                  }
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{product.name}</p>
                  <p className="text-xs text-muted-foreground">×{quantity} — {price} MAD/u</p>
                </div>
                <p className="font-bold text-primary text-sm">{price * quantity} MAD</p>
              </div>
            )
          })}
          <Separator />
          <div className="flex justify-between items-center text-sm">
            <span>Sous-total</span>
            <span>{total} MAD</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold">Total</span>
            <span className="text-xl font-bold text-primary">{total} MAD</span>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="rounded-xl" asChild>
              <Link to="/cart"><ArrowLeft className="size-4 mr-1" /> Modifier</Link>
            </Button>
            <Button className="flex-1 rounded-xl gap-2 shadow-md" onClick={() => setStep(2)}>
              Continuer <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 2: Customer Info ── */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold">Vos informations</h2>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium mb-1.5 block">Nom complet *</Label>
              <Input
                id="name"
                placeholder="Votre nom et prénom"
                className="rounded-xl"
                value={form.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium mb-1.5 block">Téléphone *</Label>
              <Input
                id="phone"
                placeholder="0612345678"
                className="rounded-xl"
                value={form.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, phone: e.target.value })}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
            </div>

            <div>
              <Label htmlFor="city" className="text-sm font-medium mb-1.5 block">Ville *</Label>
              <select
                id="city"
                className="h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                aria-invalid={!!errors.city}
              >
                <option value="">Choisir une ville</option>
                {MOROCCAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium mb-1.5 block">Adresse de livraison *</Label>
              <Input
                id="address"
                placeholder="Rue, quartier, numéro..."
                className="rounded-xl"
                value={form.address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, address: e.target.value })}
                aria-invalid={!!errors.address}
              />
              {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Préférence de contact *</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, desc: 'Message automatique' },
                  { value: 'call', label: 'Appel', icon: Phone, desc: 'Nous vous appelons' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, contact_preference: opt.value as ContactPreference })}
                    className={cn(
                      'p-3 rounded-xl border-2 text-left transition-all',
                      form.contact_preference === opt.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/40'
                    )}
                  >
                    <opt.icon className={cn('size-5 mb-1', form.contact_preference === opt.value ? 'text-primary' : 'text-muted-foreground')} />
                    <p className="text-sm font-semibold">{opt.label}</p>
                    <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {submitError && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {submitError}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setStep(1)}>
              <ArrowLeft className="size-4 mr-1" /> Retour
            </Button>
            <Button
              className="flex-1 rounded-xl gap-2 shadow-md"
              onClick={submitOrder}
              disabled={submitting}
            >
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle className="size-4" />}
              {submitting ? 'Enregistrement...' : 'Confirmer la commande'}
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 3: Confirmation ── */}
      {step === 3 && (
        <div className="text-center space-y-5 py-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <CheckCircle className="size-10 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Commande reçue !</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Merci {form.name}, votre commande a bien été enregistrée.
            </p>
            {orderId && (
              <Badge variant="outline" className="mt-2 font-mono text-xs">
                #{orderId.slice(0, 8).toUpperCase()}
              </Badge>
            )}
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 text-left">
            <h3 className="font-semibold text-sm mb-3">Récapitulatif</h3>
            <div className="space-y-2">
              {items.map(({ product, quantity }: CartItem) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{product.name} ×{quantity}</span>
                  <span className="font-medium">{getBundlePrice(product, quantity) * quantity} MAD</span>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary text-lg">{total} MAD</span>
            </div>
            <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-1.5"><User className="size-3" />{form.name}</div>
              <div className="flex items-center gap-1.5"><Phone className="size-3" />{form.phone}</div>
              <div className="flex items-center gap-1.5"><MapPin className="size-3" />{form.city}, {form.address}</div>
            </div>
          </div>

          <Button size="lg" className="w-full rounded-xl gap-2 shadow-md" onClick={handleConfirm}>
            {form.contact_preference === 'whatsapp' ? (
              <><MessageCircle className="size-5" /> Ouvrir WhatsApp</>
            ) : (
              <><Phone className="size-5" /> Confirmer</>
            )}
          </Button>

          <Button variant="ghost" className="w-full" asChild>
            <Link to="/shop">Retour à la boutique</Link>
          </Button>
        </div>
      )}

      <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Phone className="size-7 text-primary" />
            </div>
            <DialogTitle className="text-center">Nous allons vous appeler</DialogTitle>
            <DialogDescription className="text-center">
              Nous allons vous appeler bientôt pour confirmer votre commande.
              Assurez-vous que votre téléphone <strong>{form.phone}</strong> est disponible.
            </DialogDescription>
          </DialogHeader>
          <Button className="w-full rounded-xl mt-2" onClick={() => { setShowCallDialog(false); navigate('/shop') }}>
            Parfait, merci !
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
