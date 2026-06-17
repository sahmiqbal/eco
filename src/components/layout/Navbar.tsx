import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Menu, X, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { useCartStore } from '@/store/cartStore'
import { cn } from '@/lib/utils'
import { useLanguage, type Language } from '@/lib/language'

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const totalItems = useCartStore((s) => s.totalItems())
  const navigate = useNavigate()
  const { language, setLanguage, t } = useLanguage()

  const languageLabels: Record<Language, string> = {
    fr: 'Français',
    en: 'English',
    ar: 'العربية',
  }

  const navLinks = [
    { label: 'Accueil', to: '/' },
    { label: 'Boutique', to: '/shop' },
    { label: 'Nos Packs', to: '/shop?category=pack' },
    { label: 'Nouveautés', to: '/shop?sort=new' },
  ]

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header className="fixed top-4 left-0 right-0 z-50">
      <div className="container mx-auto px-1 max-w-6xl">
        <div className="relative">
          <div className="mx-auto flex items-center justify-between gap-1 rounded-[2rem] border border-[#a53860]/20 bg-white/80 dark:bg-slate-950/80 px-4 shadow-[0_20px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl">

            <Link to="/" className="flex items-center gap-3">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
                style={{ background: '#a53860' }}
              >
                <Sparkles className="size-5 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-[#a53860] sm:text-lg">Dar Nour</span>
                <span className="text-[10px] tracking-[0.34em] uppercase text-[#a53860] sm:text-xs">Cosmétiques Marocains</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group relative text-base font-medium text-white transition-colors hover:text-[#a53860]"
                >
                  {link.label}
                  <span className="absolute left-0 -bottom-1 h-0.5 w-full scale-x-0 bg-[#a53860] transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm" className="rounded-full border border-[#a53860]/20 bg-transparent text-[#a53860] shadow-sm shadow-[#a53860]/10 hover:bg-[#a53860]/10">
                    {languageLabels[language]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8}>
                  {(['fr', 'en', 'ar'] as Language[]).map((lang) => (
                    <DropdownMenuItem
                      key={lang}
                      onSelect={() => setLanguage(lang)}
                      className={cn(
                        language === lang ? 'font-semibold text-[#a53860]' : 'text-muted-foreground',
                        'cursor-pointer'
                      )}
                    >
                      {languageLabels[lang]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full border border-[#a53860]/20 bg-transparent text-white transition hover:bg-[#a53860]/10"
                onClick={() => navigate('/cart')}
                aria-label={t('cartAria')}
              >
                <ShoppingBag className="size-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 size-5 rounded-full p-0 flex h-5 min-w-[1.25rem] items-center justify-center bg-[#a53860] text-[10px] text-white border border-[#bde0fe]/20">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full border border-[#bde0fe]/40 bg-[#bde0fe]/10 text-white transition hover:bg-[#bde0fe]/20"
                onClick={() => navigate('/cart')}
                aria-label={t('cartAria')}
              >
                <ShoppingBag className="size-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 size-5 rounded-full p-0 flex h-5 min-w-[1.25rem] items-center justify-center bg-[#a53860] text-[10px] text-white border border-[#bde0fe]/20">
                    {totalItems}
                  </Badge>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={cn('rounded-full border border-[#a53860]/20 bg-transparent text-white transition hover:bg-[#a53860]/10', menuOpen ? 'bg-[#a53860]/15' : '')}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
            </div>
          </div>

          {menuOpen && (
            <div className="fixed inset-0 z-50 md:hidden mobile-menu-enter">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
              <div className="relative z-50 flex h-full w-full flex-col items-center justify-between gap-0 rounded-[2rem] border border-[#a53860]/20 bg-white/95 dark:bg-slate-950/95 px-6 py-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                
                {/* Close button area */}
                <div className="flex w-full justify-end">
                  <Button
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close menu"
                    className="close-button-animate group relative flex h-11 w-11 items-center justify-center rounded-full border border-[#a53860]/20 bg-[#a53860]/10 text-white transition-all duration-200 hover:bg-[#a53860]/15 hover:border-[#a53860]"
                  >
                    <X className="size-5 transition-transform duration-300 group-hover:rotate-90" />
                  </Button>
                </div>

                {/* Menu links - centered */}
                <nav className="flex flex-col items-center gap-8 py-12">
                  {navLinks.map((link, index) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMenuOpen(false)}
                      className={`menu-link-${index + 1} group relative text-3xl font-semibold text-white transition-colors duration-200 hover:text-[#a53860]`}
                    >
                      {link.label}
                      <span className="absolute left-1/2 -bottom-2 h-1 w-0 -translate-x-1/2 rounded-full bg-[#a53860] transition-all duration-300 group-hover:w-12" />
                    </Link>
                  ))}
                </nav>

                {/* Divider */}
                <div className="h-px w-2/3 bg-gradient-to-r from-transparent via-[#a53860]/20 to-transparent" />

                {/* Language & Cart section */}
                <div className="flex flex-col items-center gap-6 py-8">
                  <div className="flex flex-wrap justify-center gap-2">
                    {(['fr', 'en', 'ar'] as Language[]).map((lang) => (
                      <Button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={cn(
                          'rounded-full px-5 py-2 text-sm font-medium transition-all duration-200',
                          language === lang
                            ? 'bg-[#a53860] text-white shadow-sm shadow-[#a53860]/20'
                            : 'bg-transparent text-white border border-[#a53860]/20 hover:bg-[#a53860]/10'
                        )}
                      >
                        {languageLabels[lang]}
                      </Button>
                    ))}
                  </div>

                  {/* Cart link */}
                  <Button
                    onClick={() => {
                      navigate('/cart')
                      setMenuOpen(false)
                    }}
                    className="group flex items-center gap-2 rounded-full bg-[#a53860] px-6 py-3 font-semibold text-white shadow-lg shadow-[#a53860]/30 transition-all duration-200 hover:shadow-[#a53860]/50 hover:scale-105"
                  >
                    <ShoppingBag className="size-5 transition-transform duration-300 group-hover:scale-110" />
                    {totalItems > 0 && (
                      <Badge className="h-5 min-w-[1.25rem] rounded-full p-0 flex items-center justify-center bg-white text-[#a53860] text-[11px] font-bold">
                        {totalItems}
                      </Badge>
                    )}
                    Voir le panier
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
