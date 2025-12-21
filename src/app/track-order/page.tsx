"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Search,
    Package,
    CheckCircle2,
    Circle,
    XCircle,
    Clock,
    Truck,
    PackageCheck,
    Box,
    ClipboardCheck,
    MapPin,
    AlertCircle,
} from "lucide-react"
import { getOrderByTracking, Order, ORDER_STAGES, getStatusIndex } from "@/lib/orders"
import Link from "next/link"
import Image from "next/image"

const statusIcons: Record<string, any> = {
    pending: Clock,
    confirmed: ClipboardCheck,
    collecting: Box,
    packing: Package,
    shipping: Truck,
    out_for_delivery: MapPin,
    delivered: PackageCheck,
    cancelled: XCircle,
}

export default function TrackOrderPage() {
    const searchParams = useSearchParams()
    const [trackingNumber, setTrackingNumber] = useState("")
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [searched, setSearched] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState(false)

    // Auto-search if tracking number is in URL
    useEffect(() => {
        const tracking = searchParams.get("tracking")
        if (tracking) {
            setTrackingNumber(tracking)
            searchOrder(tracking)
        }
    }, [searchParams])

    const searchOrder = async (tracking: string) => {
        if (!tracking.trim()) {
            setError("Please enter a tracking number")
            return
        }

        setLoading(true)
        setError("")
        setSearched(true)

        const result = await getOrderByTracking(tracking.trim())

        if (result) {
            setOrder(result)
        } else {
            setOrder(null)
            setError("Order not found. Please check your tracking number.")
        }

        setLoading(false)
    }

    const handleSearch = async () => {
        await searchOrder(trackingNumber)
    }
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    const currentStatusIndex = order ? getStatusIndex(order.status) : -1
    const isCancelled = order?.status === "cancelled"

    return (
        <div className="min-h-screen bg-gradient-to-b from-secondary/20 to-background pt-24 pb-12 px-4">
            <div className="container max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2">Track Your Order</h1>
                    <p className="text-muted-foreground">
                        Enter your tracking number to see the status of your order
                    </p>
                </motion.div>

                {/* Search Box */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card rounded-2xl border shadow-sm p-6 mb-8"
                >
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Enter tracking number (e.g., HPP241220ABC123)"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                                onKeyDown={handleKeyPress}
                                className="h-12 pl-12 text-base rounded-xl"
                            />
                        </div>
                        <Button
                            onClick={handleSearch}
                            disabled={loading}
                            className="h-12 px-8 rounded-xl"
                        >
                            {loading ? "Searching..." : "Track Order"}
                        </Button>
                    </div>
                    {error && (
                        <p className="text-destructive text-sm mt-3 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </p>
                    )}
                </motion.div>

                {/* Order Details */}
                {order && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Order Info Card */}
                        <div className="bg-card rounded-2xl border shadow-sm p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div>
                                    <p className="text-sm text-muted-foreground">Tracking Number</p>
                                    <p className="text-xl font-bold font-mono">{order.tracking_number}</p>
                                </div>
                                <div className="text-left sm:text-right">
                                    <p className="text-sm text-muted-foreground">Order Date</p>
                                    <p className="font-medium">
                                        {new Date(order.created_at).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                                    isCancelled
                                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                        : order.status === "delivered"
                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                }`}
                            >
                                {(() => {
                                    const Icon = statusIcons[order.status] || Package
                                    return <Icon className="h-4 w-4" />
                                })()}
                                {isCancelled
                                    ? "Cancelled"
                                    : ORDER_STAGES.find((s) => s.status === order.status)?.label || order.status}
                            </div>
                        </div>

                        {/* Progress Tracker */}
                        {!isCancelled && (
                            <div className="bg-card rounded-2xl border shadow-sm p-6">
                                <h3 className="font-semibold text-lg mb-6">Order Progress</h3>
                                <div className="relative">
                                    {/* Progress Line */}
                                    <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-border" />
                                    <div
                                        className="absolute left-[18px] top-0 w-0.5 bg-primary transition-all duration-500"
                                        style={{
                                            height: `${Math.max(0, (currentStatusIndex / (ORDER_STAGES.length - 1)) * 100)}%`,
                                        }}
                                    />

                                    {/* Stages */}
                                    <div className="space-y-6">
                                        {ORDER_STAGES.map((stage, index) => {
                                            const isCompleted = index <= currentStatusIndex
                                            const isCurrent = index === currentStatusIndex
                                            const Icon = statusIcons[stage.status] || Circle

                                            return (
                                                <div key={stage.status} className="flex gap-4 relative">
                                                    <div
                                                        className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                                                            isCompleted
                                                                ? "bg-primary text-primary-foreground"
                                                                : "bg-muted text-muted-foreground"
                                                        } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                                                    >
                                                        {isCompleted ? (
                                                            <CheckCircle2 className="h-5 w-5" />
                                                        ) : (
                                                            <Icon className="h-5 w-5" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 pb-2">
                                                        <p
                                                            className={`font-medium ${
                                                                isCompleted ? "text-foreground" : "text-muted-foreground"
                                                            }`}
                                                        >
                                                            {stage.label}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">{stage.description}</p>
                                                        {isCurrent && order.status_history && (
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {new Date(
                                                                    order.status_history[order.status_history.length - 1]?.timestamp
                                                                ).toLocaleString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Cancellation Info */}
                        {isCancelled && order.cancellation_reason && (
                            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800 p-6">
                                <div className="flex items-start gap-3">
                                    <XCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-red-700 dark:text-red-400">Order Cancelled</h3>
                                        <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                                            Reason: {order.cancellation_reason}
                                        </p>
                                        {order.cancelled_at && (
                                            <p className="text-xs text-red-500 dark:text-red-400 mt-2">
                                                Cancelled on {new Date(order.cancelled_at).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Order Items */}
                        <div className="bg-card rounded-2xl border shadow-sm p-6">
                            <h3 className="font-semibold text-lg mb-4">Order Items</h3>
                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex gap-4 p-3 rounded-xl bg-secondary/30">
                                        <div className="h-20 w-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                            <Image
                                                src={item.coverUrl || "/placeholder-book.png"}
                                                alt={item.title}
                                                width={56}
                                                height={80}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{item.title}</p>
                                            <p className="text-sm text-muted-foreground">{item.author}</p>
                                            <div className="flex items-center gap-2 mt-1 text-sm">
                                                <span className="capitalize">{item.format}</span>
                                                <span className="text-muted-foreground">×</span>
                                                <span>{item.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">NRS {item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="mt-6 pt-4 border-t space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>NRS {order.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>{order.shipping_cost > 0 ? `NRS ${order.shipping_cost}` : "Free"}</span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                                    <span>Total</span>
                                    <span>NRS {order.total}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-card rounded-2xl border shadow-sm p-6">
                            <h3 className="font-semibold text-lg mb-4">Shipping Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Customer Name</p>
                                    <p className="font-medium">{order.customer_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{order.customer_email}</p>
                                </div>
                                {order.customer_phone && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Phone</p>
                                        <p className="font-medium">{order.customer_phone}</p>
                                    </div>
                                )}
                                <div className="sm:col-span-2">
                                    <p className="text-sm text-muted-foreground">Shipping Address</p>
                                    <p className="font-medium">{order.shipping_address}</p>
                                </div>
                            </div>
                        </div>

                        {/* Cancel Order Button */}
                        {!isCancelled &&
                            order.status !== "shipping" &&
                            order.status !== "out_for_delivery" &&
                            order.status !== "delivered" && (
                                <div className="flex justify-center">
                                    <Button
                                        variant="outline"
                                        className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                                        onClick={() => setShowCancelModal(true)}
                                    >
                                        Cancel Order
                                    </Button>
                                </div>
                            )}
                    </motion.div>
                )}

                {/* No Order Found */}
                {searched && !order && !loading && !error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Order Found</h3>
                        <p className="text-muted-foreground mb-6">
                            We couldn't find an order with that tracking number.
                        </p>
                        <Link href="/books">
                            <Button>Browse Books</Button>
                        </Link>
                    </motion.div>
                )}

                {/* Cancel Modal */}
                {showCancelModal && order && (
                    <CancelOrderModal
                        order={order}
                        onClose={() => setShowCancelModal(false)}
                        onCancelled={() => {
                            setShowCancelModal(false)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                            handleSearch() // Refresh order data
                        }}
                    />
                )}
            </div>
        </div>
    )
}

function CancelOrderModal({
    order,
    onClose,
    onCancelled,
}: {
    order: Order
    onClose: () => void
    onCancelled: () => void
}) {
    const [reason, setReason] = useState("")
    const [customReason, setCustomReason] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const reasons = [
        "Changed my mind",
        "Found a better price elsewhere",
        "Ordered by mistake",
        "Delivery time too long",
        "Payment issues",
        "Other",
    ]

    const handleCancel = async () => {
        const finalReason = reason === "Other" ? customReason : reason

        if (!finalReason.trim()) {
            setError("Please select or enter a reason for cancellation")
            return
        }

        setLoading(true)
        setError("")

        const { cancelOrder } = await import("@/lib/orders")
        const success = await cancelOrder(order.id, finalReason)

        if (success) {
            onCancelled()
        } else {
            setError("Failed to cancel order. It may have already been shipped.")
        }

        setLoading(false)
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl border shadow-2xl max-w-md w-full p-6"
            >
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Cancel Order</h3>
                <p className="text-gray-600 text-sm mb-6">
                    Are you sure you want to cancel order <span className="font-mono font-medium text-gray-900">{order.tracking_number}</span>?
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-3 block text-gray-900">Reason for cancellation</label>
                        <div className="space-y-2">
                            {reasons.map((r) => (
                                <div
                                    key={r}
                                    onClick={() => setReason(r)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                        reason === r 
                                            ? "border-gray-900 bg-gray-100" 
                                            : "border-gray-200 hover:bg-gray-50"
                                    }`}
                                >
                                    <div
                                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                            reason === r 
                                                ? "border-gray-900 bg-gray-900" 
                                                : "border-gray-400"
                                        }`}
                                    >
                                        {reason === r && (
                                            <CheckCircle2 className="h-3 w-3 text-white" />
                                        )}
                                    </div>
                                    <span className={`text-sm ${reason === r ? "font-medium text-gray-900" : "text-gray-600"}`}>
                                        {r}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {reason === "Other" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                        >
                            <label className="text-sm font-medium mb-2 block text-gray-900">Please specify</label>
                            <Input
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                placeholder="Enter your reason..."
                                className="h-11 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                            />
                        </motion.div>
                    )}

                    {error && (
                        <p className="text-red-600 text-sm flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </p>
                    )}
                </div>

                <div className="flex gap-3 mt-6">
                    <Button 
                        variant="outline" 
                        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100" 
                        onClick={onClose} 
                        disabled={loading}
                    >
                        Keep Order
                    </Button>
                    <Button
                        variant="destructive"
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        onClick={handleCancel}
                        disabled={loading || !reason || (reason === "Other" && !customReason.trim())}
                    >
                        {loading ? "Cancelling..." : "Cancel Order"}
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}
