import * as React from 'react'

export type Language = 'fr' | 'ar'

const translations = {
  fr: {
    home: 'Accueil',
    shop: 'Boutique',
    packs: 'Nos Packs',
    cart: 'Panier',
    cartAria: 'Afficher le panier',
    languageToggle: 'عربي',
    brandTagline: 'Cosmétiques Marocains',
    heroBadge: '✦ Cosmétiques Marocains Authentiques',
    heroTitleLine1: 'Le Rituel Hammam',
    heroTitleLine2: 'de Luxe',
    heroDescription: 'Redécouvrez la tradition du hammam marocain avec nos soins naturels formulés à base des trésors de beauté du Maroc.',
    discoverPacks: 'Découvrir nos packs',
    individualProducts: 'Produits individuels',
    featuredSub: 'Nos bestsellers',
    packsPopular: 'Packs Populaires',
    viewAllProducts: 'Tout voir',
    viewAllProductsShort: 'Voir tous les produits',
    trustTitle: 'Elles nous font confiance',
    trustHeading: 'Avis de nos clientes',
    review1Text: 'Le pack Aker Fassi est incroyable ! Ma peau n\'a jamais été aussi douce et lumineuse. Je recommande vivement.',
    review2Text: 'Qualité exceptionnelle, produits 100% naturels. Le gommage est le meilleur que j\'ai utilisé. Livraison rapide!',
    review3Text: 'J\'achète le pack Nila chaque mois. L\'huile capillaire a transformé mes cheveux. Merci Dar Nour!',
    orderNowSectionTitle: 'Commandez Maintenant',
    orderNowSectionText: 'Profitez de nos offres bundle exclusives — Plus vous commandez, plus vous économisez.',
    viewOurPacks: 'Voir nos packs',
    delivery: 'Livraison Maroc',
    deliveryDesc: 'Partout au Maroc en 2–4 jours',
    natural: '100% Naturel',
    naturalDesc: 'Formules authentiques marocaines',
    quality: 'Qualité Garantie',
    qualityDesc: 'Satisfaite ou remboursée',
    productNotFound: 'Produit introuvable',
    returnToShop: 'Retour à la boutique',
    back: 'Retour',
    bestseller: 'Bestseller',
    priceLabel: 'Prix',
    stockLabel: 'Stock',
    outOfStock: 'Rupture de stock',
    packBadge: '✦ PACK',
    twoUnits: '2 unités: {price} MAD',
    threePlusUnits: '3+ unités: {price} MAD',
    stockAvailability: 'Stock: {count} disponibles',
    available: 'disponibles',
    orderSection: 'Commander',
    tierPricing: 'Tarifs dégressifs',
    quantity: 'Quantité',
    temporarilyUnavailable: 'Produit temporairement indisponible',
    addToCart: 'Ajouter au panier',
    orderNow: 'Commander maintenant',
    inYourCart: 'dans votre panier',
    ingredients: 'Ingrédients',
    shopTitle: 'Notre Boutique',
    searchPlaceholder: 'Rechercher un produit...',
    noProductsFound: 'Aucun produit trouvé',
    productCountSingular: '1 produit',
    productCountPlural: '{count} produits',
    emptyCartTitle: 'Votre panier est vide',
    emptyCartText: 'Découvrez nos produits et commencez votre rituel beauté',
    discoverProducts: 'Découvrir nos produits',
    myCart: 'Mon Panier',
    summary: 'Récapitulatif',
    total: 'Total',
    continueShopping: 'Continuer les achats',
    checkout: 'Commander',
    cartStep: 'Panier',
    infoStep: 'Infos',
    confirmStep: 'Confirmation',
    cartEmpty: 'Panier vide',
    nameRequired: 'Nom requis',
    phoneInvalid: 'Numéro invalide (ex: 0612345678)',
    cityRequired: 'Ville requise',
    addressRequired: 'Adresse requise',
    insufficientStockFor: 'Stock insuffisant pour: {items}',
    customerInfo: 'Vos informations',
    fullName: 'Nom complet *',
    phoneLabel: 'Téléphone *',
    cityLabel: 'Ville *',
    addressLabel: 'Adresse de livraison *',
    chooseCity: 'Choisir une ville',
    contactPreference: 'Préférence de contact *',
    whatsapp: 'WhatsApp',
    call: 'Appel',
    whatsappDesc: 'Message automatique',
    callDesc: 'Nous vous appelons',
    modify: 'Modifier',
    continue: 'Continuer',
    saving: 'Enregistrement...',
    confirmOrder: 'Confirmer la commande',
    orderReceived: 'Commande reçue !',
    thankYouOrder: 'Merci {name}, votre commande a bien été enregistrée.',
    orderNumber: 'Numéro de commande',
    orderDetails: 'Récapitulatif',
    openWhatsapp: 'Ouvrir WhatsApp',
    confirm: 'Confirmer',
    backToShop: 'Retour à la boutique',
    callDialogTitle: 'Nous allons vous appeler',
    callDialogDescription: 'Nous allons vous appeler bientôt pour confirmer votre commande. Assurez-vous que votre téléphone est disponible.',
    perfectThanks: 'Parfait, merci !',
    footerNavigation: 'Navigation',
    footerContact: 'Contact',
    whatsappContact: 'WhatsApp',
    phoneContact: 'Tél',
    emailContact: '@darnour.ma',
    rights: '© 2025 Dar Nour. Tous droits réservés.',
    madeWithLove: 'Fait avec ❤️ au Maroc',
    categoryAll: 'Tout',
    categoryPack: '✦ Packs',
    categoryIndividual: 'Individuels',
  },
  ar: {
    home: 'الرئيسية',
    shop: 'المتجر',
    packs: 'الباقات',
    cart: 'عربة التسوق',
    cartAria: 'عرض العربة',
    languageToggle: 'FR',
    brandTagline: 'مستحضرات تجميل مغربية',
    heroBadge: '✦ مستحضرات تجميل مغربية أصلية',
    heroTitleLine1: 'طقس الحمّام',
    heroTitleLine2: 'فاخر',
    heroDescription: 'اكتشفي تقاليد الحمّام المغربي مع منتجاتنا الطبيعية المصنوعة من كنوز الجمال المغربية.',
    discoverPacks: 'اكتشفي باقاتنا',
    individualProducts: 'منتجات فردية',
    featuredSub: 'الأكثر مبيعًا',
    packsPopular: 'الباقات الشهيرة',
    viewAllProducts: 'عرض الكل',
    viewAllProductsShort: 'عرض جميع المنتجات',
    trustTitle: 'يثقن بنا',
    trustHeading: 'آراء زبوناتنا',
    review1Text: 'باقة آكر فاسي رائعة! بشرتي لم تكن ناعمة ومشرقة بهذا الشكل من قبل. أنصح بها بشدة.',
    review2Text: 'جودة استثنائية، منتجات 100٪ طبيعية. المقشر هو الأفضل الذي استخدمته. التوصيل سريع!',
    review3Text: 'أشتري باقة نيلا كل شهر. زيت الشعر غيّر شعري تمامًا. شكرًا دار نور!',
    orderNowSectionTitle: 'اطلبي الآن',
    orderNowSectionText: 'استفيدي من عروض الباقات الحصرية — كلما طلبت أكثر، وفرت أكثر.',
    viewOurPacks: 'عرض باقاتنا',
    delivery: 'توصيل بالمغرب',
    deliveryDesc: 'في جميع أنحاء المغرب خلال 2–4 أيام',
    natural: '100٪ طبيعي',
    naturalDesc: 'تركيبات مغربية أصيلة',
    quality: 'جودة مضمونة',
    qualityDesc: 'راضيات أو مسترجعات',
    productNotFound: 'المنتج غير موجود',
    returnToShop: 'العودة إلى المتجر',
    back: 'عودة',
    bestseller: 'الأكثر مبيعًا',
    priceLabel: 'السعر',
    stockLabel: 'المخزون',
    outOfStock: 'غير متوفر',
    packBadge: '✦ باقة',
    twoUnits: '2 وحدة: {price} MAD',
    threePlusUnits: '3+ وحدات: {price} MAD',
    stockAvailability: 'المخزون: {count} متاح',
    available: 'متوفر',
    orderSection: 'اطلب',
    tierPricing: 'أسعار متدرجة',
    quantity: 'الكمية',
    temporarilyUnavailable: 'المنتج غير متوفر مؤقتًا',
    addToCart: 'أضف إلى السلة',
    orderNow: 'اطلب الآن',
    inYourCart: 'في سلتك',
    ingredients: 'المكونات',
    shopTitle: 'متجرنا',
    searchPlaceholder: 'ابحث عن منتج...',
    noProductsFound: 'لم يتم العثور على منتجات',
    productCountSingular: 'منتج واحد',
    productCountPlural: '{count} منتجات',
    emptyCartTitle: 'سلتك فارغة',
    emptyCartText: 'اكتشفي منتجاتنا وابدئي طقسك الجمالي',
    discoverProducts: 'اكتشفي المنتجات',
    myCart: 'سلتك',
    summary: 'الملخص',
    total: 'الإجمالي',
    continueShopping: 'متابعة التسوق',
    checkout: 'اطلب',
    cartStep: 'السلة',
    infoStep: 'المعلومات',
    confirmStep: 'التأكيد',
    cartEmpty: 'السلة فارغة',
    nameRequired: 'الاسم مطلوب',
    phoneInvalid: 'رقم غير صالح (مثال: 0612345678)',
    cityRequired: 'المدينة مطلوبة',
    addressRequired: 'العنوان مطلوب',
    insufficientStockFor: 'المخزون غير كافٍ لـ: {items}',
    customerInfo: 'معلوماتك',
    fullName: 'الاسم الكامل *',
    phoneLabel: 'الهاتف *',
    cityLabel: 'المدينة *',
    addressLabel: 'عنوان التوصيل *',
    chooseCity: 'اختر مدينة',
    contactPreference: 'طريقة الاتصال *',
    whatsapp: 'واتساب',
    call: 'مكالمة',
    whatsappDesc: 'رسالة تلقائية',
    callDesc: 'سنتصل بك',
    modify: 'تعديل',
    continue: 'متابعة',
    saving: 'جاري الحفظ...',
    confirmOrder: 'تأكيد الطلب',
    orderReceived: 'تم استلام الطلب!',
    thankYouOrder: 'شكرًا لك {name}، تم تسجيل طلبك بنجاح.',
    orderNumber: 'رقم الطلب',
    orderDetails: 'ملخص الطلب',
    openWhatsapp: 'افتح واتساب',
    confirm: 'تأكيد',
    backToShop: 'العودة إلى المتجر',
    callDialogTitle: 'سنتصل بك',
    callDialogDescription: 'سنتصل بك قريبًا لتأكيد طلبك. تأكدي من أن هاتفك متاح.',
    perfectThanks: 'حسنًا، شكرًا!',
    footerNavigation: 'التنقل',
    footerContact: 'التواصل',
    whatsappContact: 'واتساب',
    phoneContact: 'الهاتف',
    emailContact: '@darnour.ma',
    rights: '© 2025 دار نور. جميع الحقوق محفوظة.',
    madeWithLove: 'مصنوع بحب ❤️ في المغرب',
    categoryAll: 'الكل',
    categoryPack: '✦ باقات',
    categoryIndividual: 'فرادي',
  },
} as const

type TranslationKey = keyof typeof translations['fr']

type Translations = typeof translations

const LanguageContext = React.createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'eco-language'

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'fr'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'ar' ? 'ar' : 'fr'
}

function formatTranslation(value: string, params?: Record<string, string | number>) {
  if (!params) return value
  return value.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? `{${key}}`))
}

export type LanguageContextValue = {
  language: Language
  setLanguage: React.Dispatch<React.SetStateAction<Language>>
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = React.useState<Language>(getInitialLanguage)

  React.useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language)
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])

  const value = React.useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: TranslationKey, params?: Record<string, string | number>) =>
        formatTranslation(translations[language][key], params),
    }),
    [language]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = React.useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
