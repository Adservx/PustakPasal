"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    ArrowLeft,
    Search,
    Package,
    Eye,
    ChevronDown,
    Clock,
    Truck,
    PackageCheck,
    XCircle,
    Filter,
} from "lucide-react"
import { Order, OrderStatus, getAllOrders, ORDER_STAGES, updateOrderStatus } from "@/lib/orders"

const statusColors: Record<OrderStatus, string> = {
    pending: "bg-yellow-500 text-white",
    confirmed: "bg-blue-500 text-white",
    collecting: "bg-indigo-500 text-white",
    packing: "bg-purple-500 text-white",
    shipping: "bg-cyan-500 text-white",
    out_for_delivery: "bg-orange-500 text-white",
    delivered: "bg-green-500 text-white",
    cancelled: "bg-red-500 text-white",
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [pendingStatusChange, setPendingStatusChange] = useState<{ orderId: string; newStatus: OrderStatus } | null>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        checkAdminAndFetch()
    }, [])

    useEffect(() => {
        filterOrders()
    }, [orders, searchQuery, statusFilter])

    const checkAdminAndFetch = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push("/login")
            return
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single()

        if (profile?.role !== "admin") {
            router.push("/")
            return
        }

        setIsAdmin(true)
        fetchOrders()
    }

    const fetchOrders = async () => {
        const data = await getAllOrders()
        setOrders(data)
        setLoading(false)
    }

    const filterOrders = () => {
        let filtered = [...orders]

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(
                (o) =>
                    o.tracking_number.toLowerCase().includes(query) ||
                    o.customer_name.toLowerCase().includes(query) ||
                    o.customer_email.toLowerCase().includes(query)
            )
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter((o) => o.status === statusFilter)
        }

        setFilteredOrders(filtered)
    }

    const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
        // If clicking on the same status, do nothing
        if (selectedOrder?.status === newStatus) return
        
        // Show confirmation dialog
        setPendingStatusChange({ orderId, newStatus })
    }

    const confirmStatusUpdate = async () => {
        if (!pendingStatusChange) return
        
        const { orderId, newStatus } = pendingStatusChange
        const success = await updateOrderStatus(orderId, newStatus)
        if (success) {
            fetchOrders()
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus })
            }
        }
        setPendingStatusChange(null)
    }

    const cancelStatusUpdate = () => {
        setPendingStatusChange(null)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!isAdmin) return null

    return (
        <div className="min-h-screen bg-background pt-20 sm:pt-24 pb-12 px-4">
            <div className="container max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-serif font-bold">Orders</h1>
                            <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-card rounded-2xl border shadow-sm p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by tracking number, name, or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-11"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="h-11 px-4 rounded-lg border bg-background text-sm min-w-[150px]"
                            >
                                <option value="all">All Status</option>
                                {ORDER_STAGES.map((stage) => (
                                    <option key={stage.status} value={stage.status}>
                                        {stage.label}
                                    </option>
                                ))}
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No orders found</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {filteredOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                                                <Package className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-mono font-semibold">{order.tracking_number}</p>
                                                <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 ml-14 sm:ml-0">
                                            <div className="text-right">
                                                <p className="font-semibold">NRS {order.total}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                                                {order.status === "cancelled"
                                                    ? "Cancelled"
                                                    : ORDER_STAGES.find((s) => s.status === order.status)?.label || order.status}
                                            </span>
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8">
                        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                            <div>
                                <p className="font-mono font-bold text-lg text-gray-900">{selectedOrder.tracking_number}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(selectedOrder.created_at).toLocaleString()}
                                </p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                                ✕
                            </Button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status Update - Show for all orders except cancelled */}
                            {selectedOrder.status !== "cancelled" && (
                                <div>
                                    <label className="text-sm font-medium mb-2 block text-gray-700">Update Status</label>
                                    <p className="text-xs text-gray-500 mb-3">Mistakenly touched? You can change the status anytime.</p>
                                    <div className="flex flex-wrap gap-2">
                                        {ORDER_STAGES.map((stage) => (
                                            <Button
                                                key={stage.status}
                                                size="sm"
                                                variant={selectedOrder.status === stage.status ? "default" : "outline"}
                                                onClick={() => handleStatusUpdate(selectedOrder.id, stage.status)}
                                                className={`text-xs ${selectedOrder.status === stage.status ? "bg-green-600 hover:bg-green-700 text-white border-green-600" : ""}`}
                                            >
                                                {stage.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Current Status */}
                            <div className={`p-4 rounded-xl ${statusColors[selectedOrder.status]}`}>
                                <p className="font-medium">
                                    Status:{" "}
                                    {selectedOrder.status === "cancelled"
                                        ? "Cancelled"
                                        : ORDER_STAGES.find((s) => s.status === selectedOrder.status)?.label}
                                </p>
                                {selectedOrder.cancellation_reason && (
                                    <p className="text-sm mt-1">Reason: {selectedOrder.cancellation_reason}</p>
                                )}
                            </div>

                            {/* Customer Info */}
                            <div>
                                <h4 className="font-semibold mb-3 text-gray-900">Customer Details</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Name</p>
                                        <p className="font-medium text-gray-900">{selectedOrder.customer_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Email</p>
                                        <p className="font-medium text-gray-900">{selectedOrder.customer_email}</p>
                                    </div>
                                    {selectedOrder.customer_phone && (
                                        <div>
                                            <p className="text-gray-500">Phone</p>
                                            <p className="font-medium text-gray-900">{selectedOrder.customer_phone}</p>
                                        </div>
                                    )}
                                    <div className="col-span-2">
                                        <p className="text-gray-500">Address</p>
                                        <p className="font-medium text-gray-900">{selectedOrder.shipping_address}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Items */}
                            <div>
                                <h4 className="font-semibold mb-3 text-gray-900">Order Items</h4>
                                <div className="space-y-2">
                                    {selectedOrder.items.map((item, i) => (
                                        <div key={i} className="flex justify-between p-3 bg-gray-50 rounded-lg text-sm">
                                            <div>
                                                <p className="font-medium text-gray-900">{item.title}</p>
                                                <p className="text-gray-500">
                                                    {item.format} × {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-medium text-gray-900">NRS {item.price * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200 space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="text-gray-900">NRS {selectedOrder.subtotal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Shipping</span>
                                        <span className="text-gray-900">{selectedOrder.shipping_cost > 0 ? `NRS ${selectedOrder.shipping_cost}` : "Free"}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-200">
                                        <span className="text-gray-900">Total</span>
                                        <span className="text-gray-900">NRS {selectedOrder.total}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status History */}
                            {selectedOrder.status_history && selectedOrder.status_history.length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-3 text-gray-900">Status History</h4>
                                    <div className="space-y-2">
                                        {selectedOrder.status_history.map((entry, i) => (
                                            <div key={i} className="flex items-center gap-3 text-sm">
                                                <div className="h-2 w-2 rounded-full bg-primary" />
                                                <span className="capitalize font-medium text-gray-900">{entry.status.replace(/_/g, " ")}</span>
                                                <span className="text-gray-500">
                                                    {new Date(entry.timestamp).toLocaleString()}
                                                </span>
                                                {entry.note && <span className="text-gray-500">- {entry.note}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Status Change Confirmation Modal */}
            {pendingStatusChange && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border shadow-2xl max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                                <Package className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Status Change</h3>
                            <p className="text-gray-500 text-sm">
                                Are you sure you want to change the order status to{" "}
                                <span className="font-semibold text-gray-900">
                                    {ORDER_STAGES.find((s) => s.status === pendingStatusChange.newStatus)?.label}
                                </span>
                                ?
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={cancelStatusUpdate}
                            >
                                No, Cancel
                            </Button>
                            <Button
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                onClick={confirmStatusUpdate}
                            >
                                Yes, Change Status
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
