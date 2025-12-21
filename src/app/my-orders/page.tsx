"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Package, CheckCircle2, XCircle, ChevronRight, Search, X, AlertTriangle } from "lucide-react"
import { Order, getUserOrders, ORDER_STAGES, cancelOrder, OrderStatus } from "@/lib/orders"

const statusColors: Record<string, string> = {
    pending: "bg-emerald-400 text-white",
    confirmed: "bg-emerald-400 text-white",
    collecting: "bg-emerald-400 text-white",
    packing: "bg-emerald-400 text-white",
    shipping: "bg-emerald-400 text-white",
    out_for_delivery: "bg-emerald-400 text-white",
    delivered: "bg-emerald-500 text-white",
    cancelled: "bg-red-500 text-white",
}

// Non-cancellable statuses
const NON_CANCELLABLE_STATUSES: OrderStatus[] = ["shipping", "out_for_delivery", "delivered", "cancelled"]

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null)
    const [cancelReason, setCancelReason] = useState("")
    const [selectedReasonIndex, setSelectedReasonIndex] = useState<number | null>(null)
    const [cancelLoading, setCancelLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const CANCEL_REASONS = [
        "Changed my mind",
        "Found a better price elsewhere",
        "Ordered by mistake",
        "Delivery time is too long",
        "Need to change shipping address",
        "Other reason"
    ]

    const canCancelOrder = (status: OrderStatus) => !NON_CANCELLABLE_STATUSES.includes(status)

    const handleSelectReason = (index: number) => {
        setSelectedReasonIndex(index)
        if (index !== CANCEL_REASONS.length - 1) {
            setCancelReason(CANCEL_REASONS[index])
        } else {
            setCancelReason("")
        }
    }

    const handleCancelOrder = async () => {
        if (!cancellingOrderId || !cancelReason.trim() || !user) return

        setCancelLoading(true)
        const success = await cancelOrder(cancellingOrderId, cancelReason.trim(), user.id)
        
        if (success) {
            // Refresh orders
            const userOrders = await getUserOrders(user.id)
            setOrders(userOrders)
            setFilteredOrders(userOrders)
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
        
        setCancelLoading(false)
        setCancellingOrderId(null)
        setCancelReason("")
        setSelectedReasonIndex(null)
    }

    useEffect(() => {
        checkUserAndFetch()
    }, [])

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredOrders(orders)
        } else {
            const query = searchQuery.toLowerCase()
            const filtered = orders.filter(order => 
                order.tracking_number.toLowerCase().includes(query) ||
                order.items.some(item => item.title.toLowerCase().includes(query)) ||
                order.status.toLowerCase().includes(query)
            )
            setFilteredOrders(filtered)
        }
    }, [searchQuery, orders])

    const checkUserAndFetch = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            router.push("/login")
            return
        }

        setUser(user)
        const userOrders = await getUserOrders(user.id)
        setOrders(userOrders)
        setFilteredOrders(userOrders)
        setLoading(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4">
                <div className="relative">
                    <div className="h-16 w-16 rounded-xl overflow-hidden shadow-lg">
                        <Image
                            src="/logo.jpeg"
                            alt="Hamro Pustak Pasal"
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="absolute -inset-2 border-2 border-primary/30 border-t-primary rounded-2xl animate-spin" />
                </div>
                <p className="text-muted-foreground">Loading your orders...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-secondary/20 to-background pt-24 pb-12 px-4">
            <div className="container max-w-4xl mx-auto">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2">My Orders</h1>
                    <p className="text-muted-foreground">Track and manage your orders</p>
                </motion.div>

                {/* Find Your Order Search */}
                {orders.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-6"
                    >
                        <div className="bg-card rounded-2xl border shadow-sm p-4">
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">Find Your Order</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search by tracking number, book title, or status..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-12 pl-12 pr-10 rounded-xl bg-secondary/50 border-border"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            {searchQuery && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    Found {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} matching "{searchQuery}"
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-2xl border shadow-sm p-12 text-center"
                    >
                        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                        <p className="text-muted-foreground mb-6">
                            You haven't placed any orders yet. Start shopping!
                        </p>
                        <Link href="/books">
                            <Button>Browse Books</Button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.length === 0 && searchQuery ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-card rounded-2xl border shadow-sm p-8 text-center"
                            >
                                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                                <p className="text-muted-foreground mb-4">
                                    No orders match your search "{searchQuery}"
                                </p>
                                <Button variant="outline" onClick={() => setSearchQuery("")}>
                                    Clear Search
                                </Button>
                            </motion.div>
                        ) : (
                            filteredOrders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-card rounded-2xl border shadow-sm overflow-hidden"
                            >
                                {/* Order Header */}
                                <div className="p-4 sm:p-6 border-b bg-secondary/20">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm text-muted-foreground">Tracking:</span>
                                                <span className="font-mono font-bold">{order.tracking_number}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Ordered on{" "}
                                                {new Date(order.created_at).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusColors[order.status]}`}
                                        >
                                            {order.status === "cancelled"
                                                ? "Cancelled"
                                                : ORDER_STAGES.find((s) => s.status === order.status)?.label ||
                                                  order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-4 sm:p-6">
                                    <div className="space-y-3">
                                        {order.items.slice(0, 2).map((item, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="h-16 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                                    <Image
                                                        src={item.coverUrl || "/placeholder-book.png"}
                                                        alt={item.title}
                                                        width={48}
                                                        height={64}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">{item.title}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.format} × {item.quantity}
                                                    </p>
                                                </div>
                                                <p className="font-semibold">NRS {item.price * item.quantity}</p>
                                            </div>
                                        ))}
                                        {order.items.length > 2 && (
                                            <p className="text-sm text-muted-foreground">
                                                +{order.items.length - 2} more item(s)
                                            </p>
                                        )}
                                    </div>

                                    {/* Order Details - Charges */}
                                    <div className="mt-4 pt-4 border-t">
                                        <div className="flex justify-end">
                                            <div className="w-full sm:w-64 space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Subtotal</span>
                                                    <span>NRS {order.subtotal}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Shipping</span>
                                                    <span>{order.shipping_cost > 0 ? `NRS ${order.shipping_cost}` : 'Free'}</span>
                                                </div>
                                                <div className="flex justify-between font-semibold pt-2 border-t">
                                                    <span>Total</span>
                                                    <span className="text-lg">NRS {order.total}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Footer */}
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                        <div>
                                            {canCancelOrder(order.status) && (
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900"
                                                    onClick={() => setCancellingOrderId(order.id)}
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>
                                        <Link href={`/track-order?tracking=${order.tracking_number}`}>
                                            <Button variant="outline" size="sm" className="gap-2">
                                                Track Order
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                        )}
                    </div>
                )}

                {/* Track Another Order */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 text-center"
                >
                    <p className="text-muted-foreground mb-3">Have a tracking number?</p>
                    <Link href="/track-order">
                        <Button variant="outline" className="gap-2">
                            <Search className="h-4 w-4" />
                            Track by Number
                        </Button>
                    </Link>
                </motion.div>
            </div>

            {/* Cancel Order Modal */}
            <AnimatePresence>
                {cancellingOrderId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => {
                            setCancellingOrderId(null)
                            setCancelReason("")
                            setSelectedReasonIndex(null)
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900">Cancel Order</h3>
                                    <p className="text-sm text-gray-600">This action cannot be undone</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-sm font-medium mb-3 block text-gray-900">
                                    Select a reason for cancellation <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-2">
                                    {CANCEL_REASONS.map((reason, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleSelectReason(index)}
                                            className={`
                                                flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border
                                                ${selectedReasonIndex === index 
                                                    ? 'bg-gray-100 border-gray-900' 
                                                    : 'bg-gray-50 border-transparent hover:bg-gray-100'
                                                }
                                            `}
                                        >
                                            <div className={`
                                                h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all
                                                ${selectedReasonIndex === index 
                                                    ? 'border-gray-900 bg-gray-900' 
                                                    : 'border-gray-400'
                                                }
                                            `}>
                                                {selectedReasonIndex === index && (
                                                    <CheckCircle2 className="h-3 w-3 text-white" />
                                                )}
                                            </div>
                                            <span className={`text-sm ${selectedReasonIndex === index ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                                                {reason}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Show textarea only for "Other reason" */}
                                {selectedReasonIndex === CANCEL_REASONS.length - 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="mt-3"
                                    >
                                        <Textarea
                                            placeholder="Please specify your reason..."
                                            value={cancelReason}
                                            onChange={(e) => setCancelReason(e.target.value)}
                                            className="min-h-[80px] resize-none bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                                        />
                                    </motion.div>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
                                    onClick={() => {
                                        setCancellingOrderId(null)
                                        setCancelReason("")
                                        setSelectedReasonIndex(null)
                                    }}
                                    disabled={cancelLoading}
                                >
                                    Keep Order
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                    onClick={handleCancelOrder}
                                    disabled={!cancelReason.trim() || cancelLoading}
                                >
                                    {cancelLoading ? "Cancelling..." : "Cancel Order"}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
