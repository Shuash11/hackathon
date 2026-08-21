import type {
  AnalyticsSummary,
  CategorySummary,
  OrderDetail,
  OrderFilters,
  OrderStatus,
  OrderSummary,
  PaginatedResponse,
  ProductSummary,
} from '~/types/dashboard'
import { buildOrderQuery } from '~/utils/dashboard'

export function useDashboardApi() {
  const api = useApi()

  const getAnalytics = () => api.request<AnalyticsSummary>('/analytics/summary/')
  const getCategories = () => api.request<CategorySummary[]>('/categories/')
  const getProducts = (category?: string) => {
    const query = category ? `?category=${category}` : ''
    return api.request<ProductSummary[]>(`/products/${query}`)
  }
  const getOrders = (filters: OrderFilters) => api.request<PaginatedResponse<OrderSummary>>(
    `/orders/${buildOrderQuery(filters)}`,
  )
  const getOrder = (id: number) => api.request<OrderDetail>(`/orders/${id}/`)
  const updateOrderStatus = (id: number, status: OrderStatus) => api.request<OrderDetail>(
    `/orders/${id}/`,
    { method: 'PATCH', body: { status } },
  )
  const deleteOrder = (id: number) => api.request<void>(`/orders/${id}/`, { method: 'DELETE' })

  return {
    getAnalytics,
    getCategories,
    getProducts,
    getOrders,
    getOrder,
    updateOrderStatus,
    deleteOrder,
  }
}
