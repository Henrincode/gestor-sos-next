'use server'

import orderService from "../services/orders"

export async function OrderStatusFind() {
  return await orderService.OrderStatusfind()
}