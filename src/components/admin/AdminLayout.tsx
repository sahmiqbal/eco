import { useEffect, useState } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export function AdminLayout() {
  const navigate = useNavigate()
  const [newOrderCount, setNewOrderCount] = useState(0)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/admin/login', { replace: true })
      }
    })

    const channel = supabase
      .channel('notif-count')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, () => {
        setNewOrderCount((n) => n + 1)
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [navigate])

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar notifCount={newOrderCount} />
      <main className="flex-1 min-w-0 md:pt-0 pt-14">
        <Outlet />
      </main>
    </div>
  )
}
