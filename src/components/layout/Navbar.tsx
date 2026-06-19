import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Menu, X, Sparkles, Truck } from 'lucide-react'
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
          <div className="mx-auto flex items-center justify-between rounded-[2rem] border border-primary/20 bg-black px-4 shadow-[0_20px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl">

            <Link to="/" className="flex items-center gap-3">
              <img src="/images/logo.webp" alt="LAHLINO" className="max-h-12 sm:max-h-14 md:max-h-16 w-auto object-contain rounded-sm" />
             
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="
group inline-flex shrink-0 items-center justify-center
relative overflow-hidden
h-9 px-4 py-2 rounded-xl gap-2
text-sm font-semibold uppercase
leading-[1.4em] tracking-[0.12em]
whitespace-nowrap

outline-none
focus-visible:border-ring
focus-visible:ring-[3px]
focus-visible:ring-ring/50

disabled:pointer-events-none
disabled:opacity-50

aria-invalid:border-destructive
aria-invalid:ring-destructive/20
dark:aria-invalid:ring-destructive/40

[&_svg]:pointer-events-none
[&_svg]:shrink-0
[&_svg:not([class*='size-'])]:size-4
has-[>svg]:px-3

bg-[linear-gradient(to_right,rgba(255,131,208,0.12)_1%,transparent_40%,transparent_60%,rgba(255,131,208,0.12)_100%)]
shadow-[inset_0_0_10px_rgba(255,131,208,0.35),0_0_9px_3px_rgba(255,131,208,0.12)]

text-foreground/80
transition-all duration-300
hover:text-gold
"
                >
                  {link.label}
                  <span className=" absolute left-0 -bottom-1 h-0.5 w-full scale-x-0 bg-gradient-to-r from-gold/90 via-gold/70 to-gold transition-all duration-300 group-hover:scale-x-100" />
                </Link>
              ))}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm" className="rounded-full border border-primary/20 bg-transparent text-primary shadow-sm shadow-primary/10 hover:bg-primary/10">
                    {languageLabels[language]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8} className="w-32 sm:w-40 md:w-44">
                  {(['fr', 'en', 'ar'] as Language[]).map((lang) => (
                    <DropdownMenuItem
                      key={lang}
                      onSelect={() => setLanguage(lang)}
                      className={cn(
                        language === lang ? 'font-semibold text-[#a53860]' : 'text-muted-foreground',
                        'cursor-pointer py-2.5 px-3'
                      )}
                    >
                      {languageLabels[lang]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            <div className="hidden md:flex items-center gap-3">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full border border-primary/20 bg-transparent text-primary shadow-sm shadow-primary/10 hover:bg-primary/10"
                  >
                    {languageLabels[language]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8} className="w-44">
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
                className="relative rounded-full border border-primary/20 bg-primary/10 text-white transition hover:bg-primary/20"
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
                className={cn('rounded-full border border-primary/20 bg-transparent text-white transition hover:bg-primary/10', menuOpen ? 'bg-primary/15' : '')}
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
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
              <div className="relative z-50 flex h-full w-full flex-col items-center justify-between gap-0 rounded-[2rem] border border-primary/20 bg-background/95 px-2 py-2 text-center shadow-[0_20px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                <div className="flex w-full justify-end">
                  <Button
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close menu"
                    className="close-button-animate group relative flex h-11 w-11 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-white transition-all duration-200 hover:bg-primary/15 hover:border-primary"
                  >
                    <X className="size-5 text-gold transition-transform duration-300 group-hover:rotate-90" />
                  </Button>
                </div>

                <div className="flex flex-col items-center gap-x-3 justify-center">
                              <img src="/images/logo.webp" alt='LAHLINO' className="h-[80px] w-auto object-cover rounded-3xl" />
                              <div>
                                <p className="mt-1 text-xl font-bold uppercase tracking-[0.38em] text-gold/95">FEEL LIKE FAMILY</p>
                              </div>
                            </div>

                <nav className="flex flex-col items-center gap-4 py-4">
                  {navLinks.map((link, index) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMenuOpen(false)}
                      className={`menu-link-${index + 1} group relative text-3xl font-semibold text-white transition-colors duration-200 hover:text-primary`}
                    >
                      {link.label}
                      <span className="absolute left-1/2 -bottom-2 h-1 w-0 -translate-x-1/2 rounded-full bg-primary transition-all duration-300 group-hover:w-12" />
                    </Link>
                  ))}
                </nav>

                <div className="h-px w-2/3 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

               

                <Button
                  onClick={() => {
                    navigate('/cart')
                    setMenuOpen(false)
                  }}
                  className="w-full rounded-[1.5rem] bg-gradient-to-r from-primary to-gold px-6 py-3.5 text-sm font-semibold text-black shadow-[0_25px_50px_rgba(255,131,208,0.25)] transition-all duration-200 hover:shadow-[0_30px_60px_rgba(255,131,208,0.35)]"
                >
                  Commencer vos achats
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
