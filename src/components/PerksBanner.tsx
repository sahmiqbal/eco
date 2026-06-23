import { Truck, Shield, CircleCheck as CheckCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useLanguage } from '@/lib/language'

type Perk = {
  icon: LucideIcon
  title: string
  desc: string
}
const isArabic = document.documentElement.dir === 'rtl'

export function PerksBanner() {
  const { t } = useLanguage()

  const perks: Perk[] = [
    { icon: Truck, title: t('delivery'), desc: t('deliveryDesc') },
    { icon: Shield, title: t('natural'), desc: t('naturalDesc') },
    { icon: CheckCircle, title: t('quality'), desc: t('qualityDesc') },
  ]

  return (
    <section  dir={isArabic ? 'rtl' : 'ltr'}
  className="bg-primary/5 border-y border-primary/10 py-6 overflow-hidden w-full">
      {/* Marquee container with animation and hover pause */}
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {/* Duplicate array for seamless looping */}
        {[...perks, ...perks].map(({ icon: Icon, title, desc }, index) => (
          <div key={index} className="flex items-center gap-3 mx-3 shrink-0">
            {/* Perk item with icon and text */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="size-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-foreground">{title}</h4>
                <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </div>

            {/* Separator divider */}
            <span className="text-primary/20 text-3xl font-light ml-2">|</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default PerksBanner
