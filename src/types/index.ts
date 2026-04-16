export interface Product {
  id: string
  name: string
  slug: string
  price: number
  price_2?: number | null
  price_3plus?: number | null
  image_url?: string | null
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
  status: 'pending' | 'confirmed'
  contact_preference: 'whatsapp' | 'call'
  call_time?: string | null
  note?: string | null
  created_at: string
}

export type OrderStatus = 'pending' | 'confirmed'
export type ContactPreference = 'whatsapp' | 'call'
