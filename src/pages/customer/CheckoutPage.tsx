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
import { useLanguage } from '@/lib/language'
import type { ContactPreference, CartItem } from '@/types'
import { cn, getProductImage } from '@/lib/utils'
import { toast } from 'sonner'

const MOROCCAN_CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès',
  'Oujda', 'Kenitra', 'Tétouan', 'Nador', 'Temara', 'El Jadida', 'Beni Mellal', 'Autre'
]

const STEPS = [
  { id: 1, labelKey: 'cartStep', icon: ShoppingBag },
  { id: 2, labelKey: 'infoStep', icon: User },
  { id: 3, labelKey: 'confirmStep', icon: CheckCircle },
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
  const { t } = useLanguage()
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

  const subtotal = totalPrice()
  const deliveryFee = 0 // Always free
  const total = subtotal + deliveryFee

  if (items.length === 0 && step !== 3) {
    return (
      <div className="container mx-auto px-4 max-w-lg py-20 text-center">
        <ShoppingBag className="size-12 text-muted-foreground/40 mx-auto mb-4" />
        <h2 className="text-lg font-semibold mb-2">{t('cartEmpty')}</h2>
        <Button asChild className="rounded-xl mt-2">
          <Link to="/shop">{t('backToShop')}</Link>
        </Button>
      </div>
    )
  }

  const validate = (): boolean => {
    const errs: Partial<FormData> = {}
    if (!form.name.trim()) errs.name = t('nameRequired')
    if (!form.phone.match(/^(\+212|0)[5-7]\d{8}$/)) errs.phone = t('phoneInvalid')
    if (!form.city) errs.city = t('cityRequired')
    if (!form.address.trim()) errs.address = t('addressRequired')

    const stockErrors = items
      .filter(({ product, quantity }) => quantity > product.stock)
      .map(({ product }) => product.name)

    if (stockErrors.length > 0) {
      errs.address = t('insufficientStockFor', { items: stockErrors.join(', ') })
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const submitOrder = async () => {
      if (!validate()) return

    setSubmitting(true)
    setSubmitError(null)

    try {
      const orderItems = items.map(({ product, quantity }: CartItem) => ({
        product_id: product.id,
        product_name: product.name,
        quantity,
        unit_price: getBundlePrice(product, quantity),
        subtotal: getBundlePrice(product, quantity) * quantity,
      }))

      const { data, error } = await supabase.rpc('create_order_with_stock', {
        customer_name: form.name,
        customer_phone: form.phone,
        customer_city: form.city,
        customer_address: form.address,
        items: orderItems,
        total,
        contact_preference: form.contact_preference,
      })

      if (error) {
        throw new Error(error.message || JSON.stringify(error))
      }

      setOrderId((data as any)?.id ?? null)
      setSubmitting(false)
      setStep(3)
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
      setSubmitting(false)
      setSubmitError(message || t('genericError'))
    }
  }

  const handleConfirm = () => {
    clearCart()
    toast.success(t('orderConfirmedToast'))
    if (form.contact_preference === 'whatsapp') {
      const itemsText = items.map(({ product, quantity }: CartItem) =>
        `• ${product.name} ×${quantity} = ${getBundlePrice(product, quantity) * quantity} MAD`
      ).join('\n')
      const message = encodeURIComponent(
        `Bonjour LAHLINO 🌸\nJ'ai passé une commande:\n\n${itemsText}\n\nTotal: ${total} MAD\nNom: ${form.name}\nVille: ${form.city}\nAdresse: ${form.address}`
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
              <span className="hidden sm:inline">{t(s.labelKey as any)}</span>
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
          <h2 className="text-xl font-bold mb-4">{t('cartReview')}</h2>
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
                  <p className="text-xs text-muted-foreground">×{quantity} — {price} MAD</p>
                </div>
                <p className="font-bold text-primary text-sm">{price * quantity} MAD</p>
              </div>
            )
          })}
          <Separator />
          <div className="flex justify-between items-center text-sm">
            <span>{t('subtotal')}</span>
            <span>{subtotal} MAD</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>{t('deliveryFee') || 'Delivery Fee'}</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold">{t('total')}</span>
            <span className="text-xl font-bold text-primary">{total} MAD</span>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="rounded-xl" asChild>
              <Link to="/cart"><ArrowLeft className="size-4 mr-1" /> {t('modify')}</Link>
            </Button>
            <Button className="flex-1 rounded-xl gap-2 shadow-md" onClick={() => setStep(2)}>
              {t('continue')} <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 2: Customer Info ── */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold">{t('customerInfo')}</h2>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium mb-1.5 block">{t('fullName')}</Label>
              <Input
                id="name"
                placeholder={t('fullName')}
                className="rounded-xl"
                value={form.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium mb-1.5 block">{t('phoneLabel')}</Label>
              <Input
                id="phone"
                placeholder={t('phoneLabel')}
                className="rounded-xl"
                value={form.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, phone: e.target.value })}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
            </div>

            <div>
              <Label htmlFor="city" className="text-sm font-medium mb-1.5 block">{t('cityLabel')}</Label>
              <select
                id="city"
                className="h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                aria-invalid={!!errors.city}
              >
                <option value="">{t('chooseCity')}</option>
                {MOROCCAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium mb-1.5 block">{t('addressLabel')}</Label>
              <Input
                id="address"
                placeholder={t('addressLabel')}
                className="rounded-xl"
                value={form.address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, address: e.target.value })}
                aria-invalid={!!errors.address}
              />
              {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">{t('contactPreference')}</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'whatsapp', label: t('whatsapp'), icon: MessageCircle, desc: t('whatsappDesc') },
                  { value: 'call', label: t('call'), icon: Phone, desc: t('callDesc') },
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
              <ArrowLeft className="size-4 mr-1" /> {t('back')}
            </Button>
            <Button
              className="flex-1 rounded-xl gap-2 shadow-md"
              onClick={submitOrder}
              disabled={submitting}
            >
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle className="size-4" />}
              {submitting ? t('saving') : t('confirmOrder')}
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
            <h2 className="text-2xl font-bold text-foreground">{t('orderConfirmed')}</h2>
            <p className="text-muted-foreground text-sm mt-1">
              {t('thankYouOrder', { name: form.name })}
            </p>
            {orderId && (
              <Badge variant="outline" className="mt-2 font-mono text-xs">
                #{orderId.slice(0, 8).toUpperCase()}
              </Badge>
            )}
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 text-left">
            <h3 className="font-semibold text-sm mb-3">{t('orderSummary')}</h3>
            <div className="space-y-2">
              {items.map(({ product, quantity }: CartItem) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{product.name} ×{quantity}</span>
                  <span className="font-medium">{getBundlePrice(product, quantity) * quantity} MAD</span>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between text-sm">
              <span>{t('subtotal')}</span>
              <span>{subtotal} MAD</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{t('deliveryFee') || 'Delivery Fee'}</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between font-bold pt-2">
              <span>{t('total')}</span>
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
              <><MessageCircle className="size-5" /> {t('openWhatsapp')}</>
            ) : (
              <><Phone className="size-5" /> {t('confirm')}</>
            )}
          </Button>

          <Button variant="ghost" className="w-full" asChild>
            <Link to="/shop">{t('backToShop')}</Link>
          </Button>
        </div>
      )}

      <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Phone className="size-7 text-primary" />
            </div>
            <DialogTitle className="text-center">{t('callDialogTitle')}</DialogTitle>
            <DialogDescription className="text-center">
              {t('callDialogDescription')}
            </DialogDescription>
          </DialogHeader>
          <Button className="w-full rounded-xl mt-2" onClick={() => { setShowCallDialog(false); navigate('/shop') }}>
            {t('perfectThanks')}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
