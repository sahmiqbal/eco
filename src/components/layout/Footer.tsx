import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Phone, Sparkles, AtSign } from 'lucide-react'
import { useLanguage } from '../../lib/language'
import { business } from '../../config/business'

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="relative mt-16 text-background">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
      <div className="bg-foreground">
        <div className="container mx-auto px-4 max-w-6xl py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center ring-1 ring-gold/20">
                  <Sparkles className="size-4 text-gold-foreground" />
                </div>
                <div>
                  <div className="text-lg font-bold">{business.name}</div>
                  <p className="text-sm opacity-70">{t('brandTagline')}</p>
                </div>
              </div>
              <p className="text-sm opacity-75 leading-relaxed">
                {t('footerBlurb')}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide opacity-80">{t('footerNavigation')}</h4>
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
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide opacity-80">{t('footerContact')}</h4>
              <ul className="space-y-3 text-sm opacity-85">
                <li className="flex items-center gap-3">
                  <MessageCircle className="size-4 text-primary" />
                  <span className="opacity-90">{t('whatsappContact')}: {business.whatsapp}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="size-4 text-primary" />
                  <span className="opacity-90">{t('phoneContact')}: {business.phone}</span>
                </li>
                <li className="flex items-center gap-3">
                  <AtSign className="size-4 text-primary" />
                  <span className="opacity-90">{business.email}</span>
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
      </div>
    </footer>
  )
}
