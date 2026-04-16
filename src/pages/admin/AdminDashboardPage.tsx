import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Clock, CircleCheck as CheckCircle, TrendingUp, Bell, MessageCircle, Phone, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { StatCard } from '@/components/admin/StatCard'
import { supabase } from '@/lib/supabase'
import type { Order } from '@/types'
import { cn } from '@/lib/utils'

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

export function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [newOrders, setNewOrders] = useState<Order[]>([])
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set())

  const fetchOrders = useCallback(async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    if (data) {
      setOrders(data as Order[])
      setSeenIds((prev) => {
        const all = new Set(prev)
        ;(data as Order[]).forEach((o) => all.add(o.id))
        return all
      })
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchOrders()

    const channel = supabase
      .channel('orders-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        const order = payload.new as Order
        setOrders((prev) => [order, ...prev])
        if (!seenIds.has(order.id)) {
          setNewOrders((prev) => [order, ...prev])
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
        const updated = payload.new as Order
        setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchOrders, seenIds])

  const today = todayStr()
  const todayOrders = orders.filter((o) => o.created_at.startsWith(today))
  const pending = orders.filter((o) => o.status === 'pending')
  const confirmed = orders.filter((o) => o.status === 'confirmed')
  const recentOrders = orders.slice(0, 5)

  const clearNotifs = () => {
    setSeenIds((prev) => {
      const s = new Set(prev)
      newOrders.forEach((o) => s.add(o.id))
      return s
    })
    setNewOrders([])
  }

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Vue d'ensemble — Dar Nour</p>
        </div>
        <DropdownMenu onOpenChange={(open) => { if (!open) clearNotifs() }}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative rounded-xl">
              <Bell className="size-4" />
              {newOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                  {newOrders.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            {newOrders.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">Aucune nouvelle commande</div>
            ) : (
              newOrders.map((o) => (
                <DropdownMenuItem key={o.id} asChild>
                  <Link to="/admin/orders" className="flex flex-col gap-0.5 p-3">
                    <span className="font-semibold text-sm">{o.name}</span>
                    <span className="text-xs text-muted-foreground">{o.city} — {o.total} MAD</span>
                  </Link>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {loading ? (
          [...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
        ) : (
          <>
            <StatCard title="Commandes aujourd'hui" value={todayOrders.length} icon={TrendingUp} variant="primary" />
            <StatCard title="En attente" value={pending.length} icon={Clock} trend="Nécessite action" />
            <StatCard title="Confirmées" value={confirmed.length} icon={CheckCircle} variant="gold" />
            <StatCard title="Total commandes" value={orders.length} icon={ShoppingBag} />
          </>
        )}
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-sm">Dernières commandes</h2>
          <Button variant="ghost" size="sm" className="gap-1 text-primary text-xs" asChild>
            <Link to="/admin/orders">Voir tout <ArrowRight className="size-3.5" /></Link>
          </Button>
        </div>
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingBag className="size-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Aucune commande pour le moment</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors">
                <div className={cn(
                  'w-2 h-2 rounded-full shrink-0',
                  order.status === 'pending' ? 'bg-amber-400' : 'bg-emerald-400'
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{order.name}</p>
                  <p className="text-xs text-muted-foreground">{order.city} · {order.items?.length ?? 0} article(s)</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-primary">{order.total} MAD</p>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    {order.contact_preference === 'whatsapp'
                      ? <MessageCircle className="size-3 text-emerald-500" />
                      : <Phone className="size-3 text-blue-500" />}
                    <Badge
                      className={cn('text-[9px] px-1.5 py-0 h-4',
                        order.status === 'pending'
                          ? 'bg-amber-100 text-amber-700 border-amber-200'
                          : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                      )}
                    >
                      {order.status === 'pending' ? 'En attente' : 'Confirmée'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
