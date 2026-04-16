import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Menu, X, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/store/cartStore'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const totalItems = useCartStore((s) => s.totalItems())
  const navigate = useNavigate()

  const navLinks = [
    { label: 'Accueil', to: '/' },
    { label: 'Boutique', to: '/shop' },
    { label: 'Nos Packs', to: '/shop?category=pack' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="size-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight text-foreground">Dar Nour</span>
              <span className="text-[10px] text-muted-foreground tracking-widest uppercase">Cosmétiques Marocains</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/cart')}
              aria-label="Panier"
            >
              <ShoppingBag className="size-5" />
              {totalItems > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 size-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground border-2 border-background"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        <div className={cn(
          'md:hidden overflow-hidden transition-all duration-300',
          menuOpen ? 'max-h-48 pb-4' : 'max-h-0'
        )}>
          <nav className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="px-2 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
