export type ShopOrderStatus = 'placed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled'

export interface ShopOrderItem {
  name: string
  category: string
  qty: number
  price: number
  image: string
}

export interface ShopOrder {
  id: number
  ref: string
  customer: { name: string; email: string }
  self: boolean
  items: ShopOrderItem[]
  shipping: number
  payment: 'GCash' | 'COD' | 'Visa'
  status: ShopOrderStatus
  placedAt: string
  eta: string
  address: string
  courier: { name: string; tracking: string }
}

export interface CartItem {
  key: string
  name: string
  category: string
  price: number
  image: string
  qty: number
}

export const shopOrderSteps = ['Order placed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered'] as const

export const statusMeta: Record<ShopOrderStatus, { label: string; pill: string; step: number }> = {
  placed: { label: 'Order placed', pill: 'bg-amber-50 text-amber-700 border-amber-100', step: 0 },
  packed: { label: 'Packed', pill: 'bg-sky-50 text-sky-700 border-sky-100', step: 1 },
  shipped: { label: 'Shipped', pill: 'bg-indigo-50 text-indigo-700 border-indigo-100', step: 2 },
  out_for_delivery: { label: 'Out for delivery', pill: 'bg-violet-50 text-violet-700 border-violet-100', step: 3 },
  delivered: { label: 'Delivered', pill: 'bg-emerald-50 text-emerald-700 border-emerald-100', step: 4 },
  cancelled: { label: 'Cancelled', pill: 'bg-rose-50 text-rose-600 border-rose-100', step: -1 },
}

export function orderTotal(order: ShopOrder): number {
  return order.items.reduce((sum, item) => sum + item.price * item.qty, 0) + order.shipping
}

const shopOrdersSeed: ShopOrder[] = [
  {
    id: 1004, ref: 'SN-8421', self: true,
    customer: { name: 'Joashua Barimao', email: 'joashuabarimao10@gmail.com' },
    items: [
      { name: 'Velvet Rose', category: 'Floral', qty: 1, price: 349, image: '/scentico/velvet-rose.webp' },
      { name: 'Amber Noir', category: 'Woody', qty: 1, price: 289, image: '/scentico/amber-noir.webp' },
    ],
    shipping: 0, payment: 'GCash', status: 'out_for_delivery',
    placedAt: 'Aug 26, 2026 · 2:14 PM', eta: 'Today by 9:00 PM',
    address: '123 Katipunan Ave, Quezon City, Metro Manila 1108',
    courier: { name: 'J&T Express', tracking: 'JT-7712-3391-PH' },
  },
  {
    id: 1005, ref: 'SN-8390', self: true,
    customer: { name: 'Joashua Barimao', email: 'joashuabarimao10@gmail.com' },
    items: [{ name: 'Cedar Veil', category: 'Fresh', qty: 1, price: 259, image: '/scentico/cedar-veil.webp' }],
    shipping: 59, payment: 'COD', status: 'packed',
    placedAt: 'Aug 25, 2026 · 10:02 AM', eta: 'Aug 30, 2026',
    address: '123 Katipunan Ave, Quezon City, Metro Manila 1108',
    courier: { name: 'J&T Express', tracking: 'JT-7708-2210-PH' },
  },
  {
    id: 1006, ref: 'SN-8102', self: true,
    customer: { name: 'Joashua Barimao', email: 'joashuabarimao10@gmail.com' },
    items: [{ name: 'Glacé Noir', category: 'Fresh', qty: 1, price: 299, image: '/scentico/asset1.webp' }],
    shipping: 59, payment: 'Visa', status: 'delivered',
    placedAt: 'Aug 16, 2026 · 6:40 PM', eta: 'Delivered Aug 18, 2026',
    address: '123 Katipunan Ave, Quezon City, Metro Manila 1108',
    courier: { name: 'Ninja Van', tracking: 'NV-5540-9917-PH' },
  },
  {
    id: 1001, ref: 'SN-8407', self: false,
    customer: { name: 'Maria Santos', email: 'maria.santos@gmail.com' },
    items: [{ name: 'Smoked Vanilla', category: 'Sweet', qty: 2, price: 275, image: '/scentico/smoke-vanilla.webp' }],
    shipping: 0, payment: 'Visa', status: 'delivered',
    placedAt: 'Aug 20, 2026 · 11:21 AM', eta: 'Delivered Aug 23, 2026',
    address: '88 Rizal St, Makati, Metro Manila 1200',
    courier: { name: 'Ninja Van', tracking: 'NV-5521-6634-PH' },
  },
  {
    id: 1002, ref: 'SN-8398', self: false,
    customer: { name: 'Jose Rizal', email: 'jose.rizal@outlook.com' },
    items: [{ name: 'Velvet Rose', category: 'Floral', qty: 1, price: 349, image: '/scentico/velvet-rose.webp' }],
    shipping: 59, payment: 'GCash', status: 'shipped',
    placedAt: 'Aug 24, 2026 · 4:05 PM', eta: 'Aug 29, 2026',
    address: '12 Mabini St, Taguig, Metro Manila 1630',
    courier: { name: 'J&T Express', tracking: 'JT-7719-8850-PH' },
  },
  {
    id: 1003, ref: 'SN-8365', self: false,
    customer: { name: 'Ana Lim', email: 'ana.lim@yahoo.com' },
    items: [
      { name: 'Amber Noir', category: 'Woody', qty: 2, price: 289, image: '/scentico/amber-noir.webp' },
      { name: 'Cedar Veil', category: 'Fresh', qty: 1, price: 259, image: '/scentico/cedar-veil.webp' },
    ],
    shipping: 0, payment: 'COD', status: 'cancelled',
    placedAt: 'Aug 22, 2026 · 9:47 AM', eta: '—',
    address: '5 Bonifacio Drive, Pasay, Metro Manila 1300',
    courier: { name: '—', tracking: '—' },
  },
]

/** Reactive, local-only order book (survives client nav; resets on refresh — demo scope). */
export function useShopOrders() {
  return useState<ShopOrder[]>('shop-orders', () => [...shopOrdersSeed])
}

export function useCartItems() {
  return useState<CartItem[]>('shop-cart-items', () => [])
}

export function useCartBump() {
  return useState<number>('shop-cart-bump', () => 0)
}

/** Add an item to the cart (merges by name). Returns new total qty. */
export function addItemToCart(item: Omit<CartItem, 'qty'>, qty = 1): number {
  const cart = useCartItems()
  const existing = cart.value.find(c => c.key === item.key)
  if (existing) existing.qty += qty
  else cart.value.push({ ...item, qty })
  useCartBump().value += 1
  return cart.value.reduce((sum, c) => sum + c.qty, 0)
}

export const FREE_SHIPPING_MIN = 529
export const SHIPPING_FEE = 59
