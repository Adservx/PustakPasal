"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Package, Clock, Truck, CheckCircle2, XCircle, ChevronRight, Search } from "lucide-react"
import { Order, getUserOrders, ORDER_STAGES, getStatusIndex } from "@/lib/orders"

const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    collecting: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    packing: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    shipping: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    out_for_delivery: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        checkUserAndFetch()
    }, [])

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
        setLoading(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
                        {orders.map((order, index) => (
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

                                    {/* Order Footer */}
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                        <div>
                                            <span className="text-sm text-muted-foreground">Total: </span>
                                            <span className="font-bold text-lg">NRS {order.total}</span>
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
                        ))}
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
        </div>
    )
}
