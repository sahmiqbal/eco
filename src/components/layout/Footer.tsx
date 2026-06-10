import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Phone, Sparkles, AtSign } from 'lucide-react'
import { useLanguage } from '../../lib/language'

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-foreground text-background mt-16">
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="size-3.5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">Dar Nour</span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              {t('brandTagline')}.
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
                  <Link to={link.to} className="opacity-70 hover:opacity-100 hover:text-primary transition-opacity">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide opacity-80">{t('footerContact')}</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li className="flex items-center gap-2">
                <MessageCircle className="size-4 text-primary" />
                <span>{t('whatsappContact')}: +212 6XX XXX XXX</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-primary" />
                <span>{t('phoneContact')}: +212 5XX XXX XXX</span>
              </li>
              <li className="flex items-center gap-2">
                <AtSign className="size-4 text-primary" />
                <span>{t('emailContact')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs opacity-50">
          <p>{t('rights')}</p>
          <p className="flex items-center gap-1">
            {t('madeWithLove')} <Heart className="size-3 text-primary fill-primary" />
          </p>
        </div>
      </div>
    </footer>
  )
}
