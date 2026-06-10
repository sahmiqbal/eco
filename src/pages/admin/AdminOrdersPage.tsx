import { useEffect, useState, useCallback } from 'react'
import { MessageCircle, Phone, CircleCheck as CheckCircle, Clock, Search, ChevronDown, ChevronUp, CreditCard as Edit3, Save, X, ShoppingBag, MapPin, User, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'
import type { Order } from '@/types'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/language'

const STATUS_FILTERS = [
  { value: 'all', label: 'statusAll' },
  { value: 'pending', label: 'orderStatusPending' },
  { value: 'confirmed', label: 'orderStatusConfirmed' },
  { value: 'preparing', label: 'orderStatusPreparing' },
  { value: 'dispatched', label: 'orderStatusDispatched' },
  { value: 'delivered', label: 'orderStatusDelivered' },
  { value: 'cancelled', label: 'orderStatusCancelled' },
]

const PAGE_SIZE = 15

export function AdminOrdersPage() {
  const { t } = useLanguage()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState<number | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const from = (page - 1) * PAGE_SIZE
    const to = page * PAGE_SIZE - 1

    const query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    const { data, count, error } = await query
    if (error) {
      console.error('Failed to fetch orders:', error)
      setLoading(false)
      return
    }
    setOrders((data as Order[]) ?? [])
    setTotalCount(count)
    setLoading(false)
  }, [page])

  useEffect(() => {
    fetchOrders()
    const channel = supabase
      .channel('admin-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchOrders())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetchOrders, page])

  const updateStatus = async (id: string, status: Order['status']) => {
    setSavingIds((s) => new Set(s).add(id))
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o))
    setSavingIds((s) => { const n = new Set(s); n.delete(id); return n })
  }

  const saveNote = async (id: string) => {
    setSavingIds((s) => new Set(s).add(id))
    await supabase.from('orders').update({ note: noteText }).eq('id', id)
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, note: noteText } : o))
    setSavingIds((s) => { const n = new Set(s); n.delete(id); return n })
    setEditingNoteId(null)
  }

  const openWhatsApp = (order: Order) => {
    const itemsText = (order.items ?? [])
      .map((item) => `• ${item.product_name} ×${item.quantity} = ${item.subtotal} MAD`)
      .join('\n')
    const msg = encodeURIComponent(
      `Bonjour ${order.name} 🌸\nVotre commande Dar Nour :\n\n${itemsText}\n\nTotal: ${order.total} MAD\n\nNous confirmons votre commande. Merci ! 💕`
    )
    window.open(`https://wa.me/${order.phone.replace(/^0/, '212')}?text=${msg}`, '_blank')
  }

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    const matchSearch = !search ||
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search) ||
      o.city.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const totalPages = totalCount ? Math.ceil(totalCount / PAGE_SIZE) : 1

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-up">
      <div>
        <h1 className="text-xl font-bold">{t('orders')}</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{orders.length} {t('totalOrders')}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder={t('searchOrdersPlaceholder')}
            className="pl-9 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {STATUS_FILTERS.map((f) => (
            <Button
              key={f.value}
              size="sm"
              variant={statusFilter === f.value ? 'default' : 'outline'}
              className="rounded-xl text-xs"
              onClick={() => setStatusFilter(f.value)}
            >
              {t(f.label as any)}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="size-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-semibold text-foreground">{t('noOrders')}</p>
          <p className="text-xs text-muted-foreground mt-1">{t('noOrdersSearch')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                <div className={cn(
                  'w-2 h-2 rounded-full shrink-0',
                  order.status === 'pending' ? 'bg-amber-400' : 'bg-emerald-400'
                )} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm">{order.name}</p>
                    <Badge
                      className={cn('text-[10px] px-2 py-0 h-4',
                        order.status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        order.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                        order.status === 'preparing' ? 'bg-sky-100 text-sky-700 border-sky-200' :
                        order.status === 'dispatched' ? 'bg-violet-100 text-violet-700 border-violet-200' :
                        order.status === 'delivered' ? 'bg-emerald-200 text-emerald-800 border-emerald-300' :
                        order.status === 'cancelled' ? 'bg-destructive/10 text-destructive border-destructive/30' :
                        'bg-muted text-muted-foreground border-border'
                      )}
                    >
                      {order.status === 'pending' && t('orderStatusPending')}
                      {order.status === 'confirmed' && t('orderStatusConfirmed')}
                      {order.status === 'preparing' && t('orderStatusPreparing')}
                      {order.status === 'dispatched' && t('orderStatusDispatched')}
                      {order.status === 'delivered' && t('orderStatusDelivered')}
                      {order.status === 'cancelled' && t('orderStatusCancelled')}
                    </Badge>
                    <Badge variant="outline" className={cn('text-[10px] px-2 py-0 h-4',
                      order.contact_preference === 'whatsapp' ? 'text-emerald-600 border-emerald-300' : 'text-blue-600 border-blue-300'
                    )}>
                      {order.contact_preference === 'whatsapp' ? '📱 WA' : t('phoneContactText')}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {order.city} · {new Date(order.created_at).toLocaleDateString('fr-MA', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {order.note && (
                    <p className="text-xs text-muted-foreground mt-0.5 italic truncate">📝 {order.note}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-bold text-primary text-sm">{order.total} MAD</span>
                  {expandedId === order.id
                    ? <ChevronUp className="size-4 text-muted-foreground" />
                    : <ChevronDown className="size-4 text-muted-foreground" />
                  }
                </div>
              </div>

              {expandedId === order.id && (
                <div className="border-t border-border p-4 space-y-4 bg-muted/20">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2 text-sm">
                      <User className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">{order.name}</p>
                        <p className="text-muted-foreground">{order.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                      <p className="text-muted-foreground">{order.city}, {order.address}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t('orderItems')}</p>
                    <div className="space-y-1">
                      {(order.items ?? []).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.product_name} ×{item.quantity}</span>
                          <span className="font-medium">{item.subtotal} MAD</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm font-bold pt-1 border-t border-border mt-1">
                        <span>Total</span>
                        <span className="text-primary">{order.total} MAD</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                        <FileText className="size-3.5" /> {t('internalNote')}
                      </p>
                      {editingNoteId !== order.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs gap-1"
                          onClick={() => { setEditingNoteId(order.id); setNoteText(order.note ?? '') }}
                        >
                          <Edit3 className="size-3" /> {t('modify')}
                        </Button>
                      )}
                    </div>
                    {editingNoteId === order.id ? (
                      <div className="space-y-2">
                        <Textarea
                          className="text-sm rounded-xl min-h-[70px]"
                          placeholder={t('orderNotePlaceholder')}
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" className="h-7 text-xs gap-1 rounded-lg" onClick={() => saveNote(order.id)} disabled={savingIds.has(order.id)}>
                            <Save className="size-3" /> {t('save')}
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 rounded-lg" onClick={() => setEditingNoteId(null)}>
                            <X className="size-3" /> {t('cancel')}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        {order.note || t('noNotes')}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button
                      size="sm"
                      className="rounded-xl gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs"
                      onClick={() => openWhatsApp(order)}
                    >
                      <MessageCircle className="size-3.5" /> {t('whatsappContactText')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl gap-1.5 text-xs"
                      onClick={() => window.open(`tel:${order.phone}`)}
                    >
                      <Phone className="size-3.5" /> {t('phoneContactText')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl gap-1.5 text-xs"
                      onClick={() => updateStatus(order.id, 'preparing')}
                      disabled={savingIds.has(order.id) || order.status === 'delivered' || order.status === 'cancelled'}
                    >
                      <Clock className="size-3.5" /> {t('prepareOrder')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl gap-1.5 text-xs"
                      onClick={() => updateStatus(order.id, 'dispatched')}
                      disabled={savingIds.has(order.id) || order.status === 'delivered' || order.status === 'cancelled'}
                    >
                      <CheckCircle className="size-3.5" /> {t('dispatchOrder')}
                    </Button>
                    <Button
                      size="sm"
                      className="rounded-xl gap-1.5 bg-primary text-primary-foreground text-xs"
                      onClick={() => updateStatus(order.id, 'delivered')}
                      disabled={savingIds.has(order.id) || order.status === 'delivered' || order.status === 'cancelled'}
                    >
                      <CheckCircle className="size-3.5" /> {t('deliverOrder')}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="rounded-xl gap-1.5 text-xs"
                      onClick={() => updateStatus(order.id, 'cancelled')}
                      disabled={savingIds.has(order.id) || order.status === 'delivered' || order.status === 'cancelled'}
                    >
                      <X className="size-3.5" /> {t('cancel')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-card">
        <div className="text-xs text-muted-foreground">
          Page {page} sur {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl text-xs"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >Précédent</Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl text-xs"
            onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
            disabled={page >= totalPages}
          >Suivant</Button>
        </div>
      </div>
    </div>
  )
}
