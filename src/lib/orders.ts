import { createClient } from "@/lib/supabase/client"

export type OrderStatus =
    | "pending"
    | "confirmed"
    | "collecting"
    | "packing"
    | "shipping"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"

export interface OrderItem {
    bookId: string
    title: string
    author: string
    coverUrl: string
    format: string
    quantity: number
    price: number
}

export interface StatusHistoryEntry {
    status: OrderStatus
    timestamp: string
    note?: string
}

export interface Order {
    id: string
    tracking_number: string
    user_id: string | null
    customer_name: string
    customer_email: string
    customer_phone: string | null
    shipping_address: string
    items: OrderItem[]
    subtotal: number
    shipping_cost: number
    total: number
    status: OrderStatus
    status_history: StatusHistoryEntry[]
    cancellation_reason: string | null
    cancelled_at: string | null
    notes: string | null
    created_at: string
    updated_at: string
}

export const ORDER_STAGES: { status: OrderStatus; label: string; description: string }[] = [
    { status: "pending", label: "Order Placed", description: "Your order has been received" },
    { status: "confirmed", label: "Confirmed", description: "Order confirmed and payment verified" },
    { status: "collecting", label: "Collecting", description: "Gathering your items from inventory" },
    { status: "packing", label: "Packing", description: "Your items are being carefully packed" },
    { status: "shipping", label: "Shipped", description: "Package handed to delivery partner" },
    { status: "out_for_delivery", label: "Out for Delivery", description: "Package is on its way to you" },
    { status: "delivered", label: "Delivered", description: "Package has been delivered" },
]

export function getStatusIndex(status: OrderStatus): number {
    if (status === "cancelled") return -1
    return ORDER_STAGES.findIndex((s) => s.status === status)
}

export async function getOrderByTracking(trackingNumber: string): Promise<Order | null> {
    const supabase = createClient()

    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("tracking_number", trackingNumber.toUpperCase())
        .single()

    if (error || !data) return null
    return data as Order
}

export async function getUserOrders(userId: string): Promise<Order[]> {
    const supabase = createClient()

    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

    if (error || !data) return []
    return data as Order[]
}

export async function getAllOrders(): Promise<Order[]> {
    const supabase = createClient()

    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

    if (error || !data) return []
    return data as Order[]
}


export async function updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    note?: string
): Promise<boolean> {
    const supabase = createClient()

    // Get current order
    const { data: order } = await supabase.from("orders").select("status_history").eq("id", orderId).single()

    if (!order) return false

    const statusHistory = (order.status_history || []) as StatusHistoryEntry[]
    statusHistory.push({
        status: newStatus,
        timestamp: new Date().toISOString(),
        note,
    })

    const { error } = await supabase
        .from("orders")
        .update({
            status: newStatus,
            status_history: statusHistory,
        })
        .eq("id", orderId)

    return !error
}

export async function cancelOrder(orderId: string, reason: string, userId?: string): Promise<boolean> {
    const supabase = createClient()

    // Get current order
    const { data: order } = await supabase.from("orders").select("status, status_history, user_id").eq("id", orderId).single()

    if (!order) return false

    // Check if user owns the order (if userId provided)
    if (userId && order.user_id !== userId) return false

    // Can only cancel if not already shipped/delivered
    const nonCancellableStatuses: OrderStatus[] = ["shipping", "out_for_delivery", "delivered", "cancelled"]
    if (nonCancellableStatuses.includes(order.status as OrderStatus)) {
        return false
    }

    const statusHistory = (order.status_history || []) as StatusHistoryEntry[]
    statusHistory.push({
        status: "cancelled",
        timestamp: new Date().toISOString(),
        note: `Cancelled: ${reason}`,
    })

    const { error } = await supabase
        .from("orders")
        .update({
            status: "cancelled",
            status_history: statusHistory,
            cancellation_reason: reason,
            cancelled_at: new Date().toISOString(),
        })
        .eq("id", orderId)

    return !error
}

export async function createOrder(orderData: {
    userId?: string
    customerName: string
    customerEmail: string
    customerPhone?: string
    shippingAddress: string
    items: OrderItem[]
    subtotal: number
    shippingCost?: number
    total: number
}): Promise<Order | null> {
    const supabase = createClient()

    const statusHistory: StatusHistoryEntry[] = [
        {
            status: "pending",
            timestamp: new Date().toISOString(),
            note: "Order placed",
        },
    ]

    const { data, error } = await supabase
        .from("orders")
        .insert({
            user_id: orderData.userId || null,
            customer_name: orderData.customerName,
            customer_email: orderData.customerEmail,
            customer_phone: orderData.customerPhone || null,
            shipping_address: orderData.shippingAddress,
            items: orderData.items,
            subtotal: orderData.subtotal,
            shipping_cost: orderData.shippingCost || 0,
            total: orderData.total,
            status: "pending",
            status_history: statusHistory,
        })
        .select()
        .single()

    if (error || !data) return null
    return data as Order
}
