import { useEffect, useState } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { Skeleton } from '@/components/ui/skeleton'

export function AdminLayout() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const [newOrderCount, setNewOrderCount] = useState(0)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        if (!data.session) {
          navigate('/admin/login', { replace: true })
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        navigate('/admin/login', { replace: true })
      } finally {
        setChecking(false)
      }
    }

    checkSession()

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

  if (checking) {
    return (
      <div className="min-h-screen bg-sidebar flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <Skeleton className="w-24 h-3 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar notifCount={newOrderCount} />
      <main className="flex-1 min-w-0 md:pt-0 pt-14">
        <Outlet />
      </main>
    </div>
  )
}
