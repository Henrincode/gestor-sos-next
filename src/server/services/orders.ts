import { unstable_cache } from "next/cache"
import sql from "../db/supabase"

const OrderStatusfind = unstable_cache(
  async (): Promise<OrderStatus[]> => {
    const rows = await sql<OrderStatus[]>`
      SELECT * FROM sos_order_statuses
    `
    return rows
  },
  ['order-statuses'],
  { tags: ['users', 'orders'] }
)

const orderService = {
  OrderStatusfind
}

export default orderService