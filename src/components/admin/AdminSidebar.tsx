import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingBag, Package, LogOut, Sparkles, X, Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/admin' },
  { icon: ShoppingBag, label: 'Commandes', to: '/admin/orders' },
  { icon: Package, label: 'Produits', to: '/admin/products' },
]

interface AdminSidebarProps {
  notifCount?: number
}

export function AdminSidebar({ notifCount = 0 }: AdminSidebarProps) {
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
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <Sparkles className="size-4.5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold text-sidebar-foreground">Dar Nour</p>
            <p className="text-[10px] text-sidebar-foreground/50 uppercase tracking-wider">Admin Panel</p>
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
              {label}
              {label === 'Commandes' && notifCount > 0 && (
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
          <LogOut className="size-4" /> Déconnexion
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
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="size-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold text-sidebar-foreground">Dar Nour Admin</span>
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
