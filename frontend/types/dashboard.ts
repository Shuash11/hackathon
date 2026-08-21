export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface Customer {
  name: string
  email: string
}

export interface CategorySummary {
  id: number
  name: string
  slug: string
  product_count: number
}

export interface ProductSummary {
  id: number
  name: string
  price: string
  stock: number
  image: string | null
  scent_summary: string
  category_name: string
  category_slug: string
}

export interface OrderSummary {
  id: number
  customer: Customer
  items_count: number
  total: string
  status: OrderStatus
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: number
  product: {
    id: number
    name: string
    category: string
    image: string | null
  }
  quantity: number
  price: string
  line_total: string
}

export interface OrderDetail extends OrderSummary {
  items: OrderItem[]
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface CategoryOrderCount {
  name: string
  slug: string
  order_count: number
}

export interface BestSeller {
  id: number
  name: string
  category: string
  quantity_sold: number
  stock: number
}

export interface LowStockProduct {
  id: number
  name: string
  category: string
  stock: number
}

export interface AnalyticsSummary {
  total_products: number
  total_orders: number
  orders_this_month: number
  total_revenue: string
  revenue_this_month: string
  orders_by_category: CategoryOrderCount[]
  best_sellers: BestSeller[]
  recent_orders: OrderSummary[]
  low_stock: LowStockProduct[]
}

export interface OrderFilters {
  status: OrderStatus | ''
  search: string
  dateFrom: string
  dateTo: string
  page: number
  pageSize: number
}
