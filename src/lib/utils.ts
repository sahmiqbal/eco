import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProductImages(product: { image_url?: string | null; image_urls?: string[] | null }) {
  const imageUrls = product.image_urls?.filter(Boolean) ?? []
  if (imageUrls.length > 0) return imageUrls

  if (!product.image_url) return []

  return product.image_url
    .split(/\r?\n|,|;/)
    .map((url) => url.trim())
    .filter(Boolean)
}

export function getProductImage(product: { image_url?: string | null; image_urls?: string[] | null }) {
  return getProductImages(product)[0]
}

export function getProductBeforeAfterImages(product: {
  beforeAfterImages?: string[] | null
  before_image?: string | null
  after_image?: string | null
  image_url?: string | null
  image_urls?: string[] | null
}) {
  const explicitImages = product.beforeAfterImages?.filter(Boolean) ?? []
  if (explicitImages.length >= 2) {
    return explicitImages.slice(0, 2)
  }

  const before = product.before_image?.trim()
  const after = product.after_image?.trim()
  if (before && after) {
    return [before, after]
  }

  return getProductImages(product).slice(0, 2)
}
