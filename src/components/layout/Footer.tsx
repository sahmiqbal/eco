import { useState } from 'react'
import { MessageCircle, Phone, Sparkles, AtSign, Home, ShoppingCart, Gift, ShoppingBag } from 'lucide-react'
import { business } from '../../config/business'

export function Footer() {
  const [isShopActive, setIsShopActive] = useState(false)

  const contactItems = [
    { icon: MessageCircle, text: business.whatsapp },
    { icon: Phone, text: business.phone },
    { icon: AtSign, text: business.email },
  ]

  const navItems = [
    { icon: Home, text: 'HOME', active: false },
    { icon: ShoppingBag, text: 'SHOP', active: isShopActive },
    { icon: Gift, text: 'PACKS', active: false },
    { icon: ShoppingCart, text: 'CART', active: false },
  ]

  return (
    <footer className="w-full bg-background text-foreground py-10">
      <div className="flex w-full flex-col items-center justify-center gap-8 px-4 text-center">
        <div className="relative w-full overflow-hidden rounded-[2rem] border border-primary/30 bg-card px-6 py-8 shadow-[0_10px_40px_-15px_rgba(255,131,208,0.15)]">
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="flex items-center gap-x-3 justify-center">
              <img src="/images/logo.webp" alt={business.name} className="w-12 h-12 object-cover rounded-3xl shadow-[0_10px_30px_rgba(255,255,255,0.12)]" />
              <div>
                <span className="font-extrabold text-3xl uppercase tracking-[0.28em] text-foreground">{business.name}</span>
                <p className="mt-1 text-xs uppercase tracking-[0.38em] text-gold/95">FEEL LIKE FAMILY</p>
              </div>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-foreground/75">Pure, natural, and timeless care with elevated elegance.</p>
          </div>

          <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-3">
            {navItems.map((link, index) => {
              const Icon = link.icon
              return (
                <a
                  key={index}
                  href="#"
                  className={`flex items-center gap-x-2 rounded-full border px-4 py-2 text-sm transition-all duration-300 ${link.active ? 'border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(213,82,163,0.15)]' : 'border-border text-foreground/70 hover:border-primary hover:text-primary'}`}
                  onMouseEnter={() => link.text === 'SHOP' && setIsShopActive(true)}
                  onMouseLeave={() => link.text === 'SHOP' && setIsShopActive(false)}
                >
                  <Icon className="w-4 h-4" />
                  <span className="tracking-[0.2em]">{link.text}</span>
                </a>
              )
            })}
          </div>

          <div className="relative z-10 mt-8 flex flex-col items-center gap-3 text-sm text-gold sm:flex-row sm:justify-center">
            {contactItems.map((item, index) => {
              const Icon = item.icon
              const isEmail = typeof item.text === 'string' && item.text.includes('@')
              const isPhone = typeof item.text === 'string' && item.text.replace(/\s+/g, '').startsWith('+')
              const href = isEmail ? `mailto:${item.text}` : isPhone ? `tel:${item.text.replace(/\s+/g, '')}` : '#'
              return (
                <a key={index} href={href} className="flex items-center gap-x-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10">
                  <Icon className="w-4 h-4 text-gold" />
                  <span>{item.text}</span>
                </a>
              )
            })}
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-2 text-xs text-foreground/50">
          <span>© 2026 {business.name}. Purely Moroccan.</span>
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
