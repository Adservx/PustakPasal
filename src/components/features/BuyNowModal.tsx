"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Package, CheckCircle2, AlertCircle } from "lucide-react"
import { createOrder, OrderItem } from "@/lib/orders"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { toast } from "sonner"

interface BuyNowModalProps {
    item: {
        bookId: string
        title: string
        author: string
        coverUrl: string
        format: string
        price: number
        quantity: number
    }
    onClose: () => void
}

export function BuyNowModal({ item, onClose }: BuyNowModalProps) {
    const [step, setStep] = useState<"form" | "success">("form")
    const [loading, setLoading] = useState(false)
    const [trackingNumber, setTrackingNumber] = useState("")
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const subtotal = item.price * item.quantity
    const shipping = subtotal >= 500 ? 0 : 100
    const total = subtotal + shipping

    const validate = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.name.trim()) newErrors.name = "Name is required"
        if (!formData.email.trim()) newErrors.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email"
        if (!formData.phone.trim()) newErrors.phone = "Phone is required"
        if (!formData.address.trim()) newErrors.address = "Address is required"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validate()) return

        setLoading(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        const orderItem: OrderItem = {
            bookId: item.bookId,
            title: item.title,
            author: item.author,
            coverUrl: item.coverUrl,
            format: item.format,
            quantity: item.quantity,
            price: item.price,
        }

        const order = await createOrder({
            userId: user?.id,
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            shippingAddress: formData.address,
            items: [orderItem],
            subtotal,
            shippingCost: shipping,
            total,
        })

        if (order) {
            setTrackingNumber(order.tracking_number)
            setStep("success")
            toast.success("Order placed successfully!")
        } else {
            toast.error("Failed to place order. Please try again.")
        }

        setLoading(false)
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card rounded-2xl border shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto my-4"
            >
                {step === "form" ? (
                    <>
                        {/* Header */}
                        <div className="sticky top-0 bg-card border-b p-4 flex items-center justify-between z-10">
                            <h3 className="text-xl font-semibold">Complete Your Order</h3>
                            <Button variant="ghost" size="icon" onClick={onClose}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Order Item */}
                            <div className="flex gap-4 p-4 rounded-xl bg-secondary/30">
                                <div className="h-24 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                    <Image
                                        src={item.coverUrl}
                                        alt={item.title}
                                        width={64}
                                        height={96}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold">{item.title}</p>
                                    <p className="text-sm text-muted-foreground">{item.author}</p>
                                    <p className="text-sm text-muted-foreground capitalize mt-1">
                                        {item.format} × {item.quantity}
                                    </p>
                                    <p className="font-bold mt-2">NRS {subtotal}</p>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Full Name *</label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter your full name"
                                        className={errors.name ? "border-destructive" : ""}
                                    />
                                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Email *</label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="your@email.com"
                                        className={errors.email ? "border-destructive" : ""}
                                    />
                                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Phone *</label>
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+977 98XXXXXXXX"
                                        className={errors.phone ? "border-destructive" : ""}
                                    />
                                    {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Shipping Address *</label>
                                    <Input
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Street, City, District"
                                        className={errors.address ? "border-destructive" : ""}
                                    />
                                    {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-secondary/30 rounded-xl p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>NRS {subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>{shipping > 0 ? `NRS ${shipping}` : "Free"}</span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                                    <span>Total</span>
                                    <span>NRS {total}</span>
                                </div>
                            </div>

                            {/* Submit */}
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                            >
                                {loading ? "Placing Order..." : "Place Order"}
                            </Button>
                        </div>
                    </>
                ) : (
                    /* Success State */
                    <div className="p-8 text-center space-y-6">
                        <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-2">Order Placed!</h3>
                            <p className="text-muted-foreground">
                                Your order has been placed successfully.
                            </p>
                        </div>
                        <div className="bg-secondary/30 rounded-xl p-4">
                            <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                            <p className="text-xl font-mono font-bold">{trackingNumber}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Save this tracking number to track your order status.
                        </p>
                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={onClose}>
                                Close
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={() => window.location.href = `/track-order?tracking=${trackingNumber}`}
                            >
                                Track Order
                            </Button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    )
}
