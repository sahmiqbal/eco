declare module '../../config/business' {
  export const business: {
    name: string
    whatsapp: string
    phone: string
    email: string
  }
}

import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Phone, Sparkles, AtSign } from 'lucide-react'
import { useLanguage } from '../../lib/language'
import { business } from '../../config/business'

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="relative mt-16 bg-foreground text-background">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />

      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center ring-1 ring-gold/20 shrink-0">
                <Sparkles className="size-5 text-gold-foreground" />
              </div>
              <div>
                <div className="text-lg font-bold leading-tight">{business.name}</div>
                <p className="text-sm opacity-70 mt-1">{t('brandTagline')}</p>
              </div>
            </div>
            <p className="text-sm opacity-75 leading-relaxed">
              {t('footerBlurb')}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-widest opacity-80">{t('footerNavigation')}</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: t('home'), to: '/' },
                { label: t('shop'), to: '/shop' },
                { label: t('packs'), to: '/shop?category=pack' },
                { label: t('cart'), to: '/cart' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="opacity-75 hover:opacity-100 hover:text-primary transition-opacity">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-widest opacity-80">{t('footerContact')}</h4>
            <ul className="space-y-3 text-sm opacity-85">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/5 flex items-center justify-center">
                  <MessageCircle className="size-4 text-primary" />
                </div>
                <div>
                  <div className="opacity-90">{t('whatsappContact')}</div>
                  <a href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}`} className="text-sm opacity-80 hover:text-primary transition-colors">
                    {business.whatsapp}
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/5 flex items-center justify-center">
                  <Phone className="size-4 text-primary" />
                </div>
                <div>
                  <div className="opacity-90">{t('phoneContact')}</div>
                  <a href={`tel:${business.phone.replace(/[^0-9+]/g, '')}`} className="text-sm opacity-80 hover:text-primary transition-colors">
                    {business.phone}
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/5 flex items-center justify-center">
                  <AtSign className="size-4 text-primary" />
                </div>
                <div>
                  <div className="opacity-90">{t('emailContact')}</div>
                  <a href={`mailto:${business.email}`} className="text-sm opacity-80 hover:text-primary transition-colors">
                    {business.email}
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs opacity-60">
          <p>{t('rights')}</p>
          <p className="flex items-center gap-2">
            <span>{t('madeWithLove')}</span>
            <Heart className="size-3 text-primary" />
          </p>
        </div>
      </div>
    </footer>
  )
}
