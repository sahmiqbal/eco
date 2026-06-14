export interface Product {
  beforeAfterImages?: string[] | null
  id: string
  name: string
  slug: string
  price: number
  price_2?: number | null
  price_3plus?: number | null
  image_url?: string | null
  image_urls?: string[] | null
  before_image?: string | null
  after_image?: string | null
  comparatives_images?: string[] | null
  others_images?: string[] | null
  description: string
  ingredients: string
  category: 'pack' | 'individual'
  stock: number
  is_featured: boolean
  created_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  subtotal: number
}

export interface Order {
  id: string
  name: string
  phone: string
  city: string
  address: string
  items: OrderItem[]
  total: number
  delivery_fee?: number | null
  status: 'pending' | 'confirmed' | 'preparing' | 'dispatched' | 'delivered' | 'cancelled'
  contact_preference: 'whatsapp' | 'call'
  note?: string | null
  order_number?: string | null
  created_at: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'dispatched' | 'delivered' | 'cancelled'
export type ContactPreference = 'whatsapp' | 'call'
