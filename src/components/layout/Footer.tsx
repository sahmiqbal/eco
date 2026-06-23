import { useState } from 'react'
import { MessageCircle, Phone, Sparkles, AtSign, Home, ShoppingCart, Gift, ShoppingBag } from 'lucide-react'
import { business } from '../../config/business'
import { useLanguage } from '@/lib/language'
import { FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa6"

const socialItems = [
  {
    icon: FaInstagram,
    text: "Instagram",
    href: "https://www.instagram.com/cooperative_lahlino",
  },
  {
    icon: FaTiktok,
    text: "TikTok",
    href: "https://www.tiktok.com/@lahilno",
  },
  {
    icon: FaFacebookF,
    text: "Facebook",
    href: "https://www.facebook.com/p/%D8%AA%D8%B9%D8%A7%D9%88%D9%86%D9%8A%D8%A9-%D9%84%D8%A7%D9%87%D9%84%D9%8A%D9%86%D9%88-%D9%84%D8%AA%D9%82%D8%B7%D9%8A%D8%B1-%D8%A7%D9%84%D8%B2%D9%8A%D9%88%D8%AA-100064049472547/",
  },
]

export function Footer() {
  const [isShopActive, setIsShopActive] = useState(false)
  const { t } = useLanguage()

  const contactItems = [
    { icon: MessageCircle, text: business.whatsapp },
    { icon: Phone, text: business.phone },
    { icon: AtSign, text: business.email },
  ]

  const navItems = [
    { icon: Home, text: 'home', active: false },
    { icon: ShoppingBag, text: 'shop', active: isShopActive },
    { icon: Gift, text: 'packs', active: false },
    { icon: ShoppingCart, text: 'cart', active: false },
  ]

  return (
    <footer className="w-full bg-background text-foreground py-5">
      <div className="flex w-full flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="relative w-full overflow-hidden rounded-[2rem] border border-primary/30 bg-black px-6 py-8 shadow-[0_10px_40px_-15px_rgba(255,131,208,0.15)]">
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-x-3 justify-center">
              <img src="/images/logo.webp" alt={business.name} className="h-32 w-auto object-cover rounded-3xl" />
              <div>
                <p className="mt-1 text-xl font-bold uppercase tracking-[0.38em] text-gold/95">{t('brandTagline')}</p>
              </div>
            </div>
            <p className="group inline-flex shrink-0 items-center justify-center text-sm font-medium whitespace-nowrap 
            outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none 
            disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 relative
             overflow-hidden bg-[linear-gradient(to_right,rgba(255,131,208,0.12)_1%,transparent_40%,transparent_60%,rgba(255,131,208,0.12)_100%)] text-primary shadow-[inset_0_0_10px_rgba(255,131,208,0.35),0_0_9px_3px_rgba(255,131,208,0.12)] transition-all duration-300 leading-[1.4em]
              tracking-[0.06em] h-9 px-4 py-2 has-[>svg]:px-3 rounded-xl gap-2 text-foreground/75">{t('footerNavigation')}</p>
            <p className="max-w-xl text-sm font-bold uppercase text-white">{t('footerTagline')}</p>
          </div>

          <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-3">
            {navItems.map((link, index) => {
              const Icon = link.icon
              return (
                <a
                  key={index}
                  href="#"
                  className={`group inline-flex shrink-0 items-center justify-center text-sm font-medium whitespace-nowrap outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 relative overflow-hidden border-2 border-primary bg-[linear-gradient(to_right,rgba(255,131,208,0.12)_1%,transparent_40%,transparent_60%,rgba(255,131,208,0.12)_100%)] text-primary shadow-[inset_0_0_10px_rgba(255,131,208,0.35),0_0_9px_3px_rgba(255,131,208,0.12)] transition-all duration-300 leading-[1.4em] tracking-[0.06em] h-9 px-4 py-2 has-[>svg]:px-3 rounded-xl gap-2 ${link.active ? 'border-primary bg-primary/20 text-primary shadow-[0_0_24px_rgba(255,131,208,0.22)]' : 'border-border text-foreground/70 hover:border-primary hover:text-primary'}`}
                  onMouseEnter={() => link.text === 'shop' && setIsShopActive(true)}
                  onMouseLeave={() => link.text === 'shop' && setIsShopActive(false)}
                >
                  <Icon className={`w-4 h-4 transition duration-300 ${link.active ? 'text-primary' : 'text-gold group-hover:text-primary'}`} />
                  <span className="tracking-[0.2em] transition duration-300 group-hover:text-primary">{t(link.text as any)}</span>
                </a>
              )
            })}
          </div>

          <div className="relative z-10 mt-8 flex flex-col items-center gap-3 text-sm text-foreground sm:flex-row sm:justify-center">
            {contactItems.map((item, index) => {
              const Icon = item.icon
              const isEmail = typeof item.text === 'string' && item.text.includes('@')
              const isPhone = typeof item.text === 'string' && item.text.replace(/\s+/g, '').startsWith('+')
              const href = isEmail ? `mailto:${item.text}` : isPhone ? `tel:${item.text.replace(/\s+/g, '')}` : '#'
              return (
                <a
                  key={index}
                  href={href}
                  className="group inline-flex shrink-0 items-center justify-center text-sm font-medium whitespace-nowrap outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 relative overflow-hidden border-2 border-primary bg-[linear-gradient(to_right,rgba(255,131,208,0.12)_1%,transparent_40%,transparent_60%,rgba(255,131,208,0.12)_100%)] text-primary shadow-[inset_0_0_10px_rgba(255,131,208,0.35),0_0_9px_3px_rgba(255,131,208,0.12)] transition-all duration-300 leading-[1.4em] tracking-[0.06em] h-9 px-4 py-2 has-[>svg]:px-3 rounded-xl gap-2 text-foreground/75 hover:border-gold/40 hover:bg-gold/10 hover:text-foreground"
                >
                  <Icon className="w-4 h-4 text-gold transition duration-300 group-hover:text-gold" />
                  <span className="transition duration-300 group-hover:text-foreground">{item.text}</span>
                </a>
              )
            })}
          </div>
          <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
  {socialItems.map((item, index) => {
    const Icon = item.icon

    return (
      <a
        key={index}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2 rounded-xl border-2 border-primary bg-[linear-gradient(to_right,rgba(255,131,208,0.12)_1%,transparent_40%,transparent_60%,rgba(255,131,208,0.12)_100%)] px-4 py-2 text-foreground/75 shadow-[inset_0_0_10px_rgba(255,131,208,0.35),0_0_9px_3px_rgba(255,131,208,0.12)] transition-all duration-300 hover:border-gold/40 hover:bg-gold/10 hover:text-foreground"
      >
        <Icon className="h-4 w-4 text-gold transition duration-300" />
        <span>{item.text}</span>
      </a>
    )
  })}
</div>
          
        </div>

        <div className="relative z-10 flex flex-col items-center gap-2 text-xs text-foreground/50">
          <span>{t('rights').replace('LAHLINO', business.name)}</span>
          <span>{t('madeWithLove')}</span>
          <div className="flex items-center gap-x-2 text-gold">
            <Sparkles className="w-3 h-3" />
            <Sparkles className="w-3 h-3" />
            <Sparkles className="w-3 h-3" />
          </div>
        </div>
      </div>
    </footer>
  )
}
