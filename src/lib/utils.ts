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
