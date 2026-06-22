import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingBag, Package, LogOut, X, Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useLanguage } from '@/lib/language'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'dashboard', to: '/admin' },
  { icon: ShoppingBag, label: 'orders', to: '/admin/orders' },
  { icon: Package, label: 'productsTitle', to: '/admin/products' },
] as const

interface AdminSidebarProps {
  notifCount?: number
}

export function AdminSidebar({ notifCount = 0 }: AdminSidebarProps) {
  const { t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden bg-sidebar-foreground/5 shadow-sm">
              <img src="/images/logo.webp" alt="LAHLINO" className="w-full h-full object-cover" />
            </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sidebar-foreground">LAHLINO</p>
            <p className="text-[10px] text-sidebar-foreground/60 uppercase tracking-[0.28em]">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map(({ icon: Icon, label, to }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <Icon className="size-4 shrink-0" />
              {t(label)}
              {label === 'orders' && notifCount > 0 && (
                <span className="ml-auto bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {notifCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-xl"
          onClick={handleLogout}
        >
          <LogOut className="size-4" /> {t('logout')}
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden md:flex w-56 bg-sidebar border-r border-sidebar-border flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
            <img src="/images/logo.webp" alt="LAHLINO" className="w-8 h-8 rounded-2xl object-cover" />
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-sidebar-foreground">LAHLINO Admin</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-sidebar/95 pt-14">
          <SidebarContent />
        </div>
      )}
    </>
  )
}
