"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, CheckCircle2, AlertCircle, Edit2 } from "lucide-react"
import { createOrder, OrderItem } from "@/lib/orders"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { toast } from "sonner"
import { UserProfileModal, ProfileData } from "./UserProfileModal"

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
    const [step, setStep] = useState<"loading" | "profile" | "checkout" | "success">("loading")
    const [loading, setLoading] = useState(false)
    const [trackingNumber, setTrackingNumber] = useState("")
    const [profileData, setProfileData] = useState<ProfileData | null>(null)
    const [showEditProfile, setShowEditProfile] = useState(false)

    // Memoize supabase client to avoid recreating on each render
    const supabase = useMemo(() => createClient(), [])

    const subtotal = item.price * item.quantity
    const shipping = subtotal >= 500 ? 0 : 100
    const total = subtotal + shipping

    useEffect(() => {
        checkUserProfile()
    }, [])

    const checkUserProfile = async () => {
        try {
            // Use getSession for faster auth check (cached locally)
            const { data: { session } } = await supabase.auth.getSession()

            if (!session?.user) {
                toast.error("Please login to place an order")
                onClose()
                return
            }

            const user = session.user

            const { data: profile } = await supabase
                .from("profiles")
                .select("full_name, email, phone, address, city, district, is_profile_complete")
                .eq("id", user.id)
                .single()

            if (profile?.is_profile_complete) {
                setProfileData({
                    full_name: profile.full_name || "",
                    email: profile.email || user.email || "",
                    phone: profile.phone || "",
                    address: profile.address || "",
                    city: profile.city || "",
                    district: profile.district || "",
                })
                setStep("checkout")
            } else {
                setStep("profile")
            }
        } catch (error) {
            console.error("Error checking profile:", error)
            toast.error("Something went wrong. Please try again.")
            onClose()
        }
    }

    const handleProfileComplete = (data: ProfileData) => {
        setProfileData(data)
        setShowEditProfile(false)
        setStep("checkout")
    }

    const handleSubmit = async () => {
        if (!profileData) return

        setLoading(true)
        // Use cached session instead of fetching user again
        const { data: { session } } = await supabase.auth.getSession()
        const user = session?.user

        const orderItem: OrderItem = {
            bookId: item.bookId,
            title: item.title,
            author: item.author,
            coverUrl: item.coverUrl,
            format: item.format,
            quantity: item.quantity,
            price: item.price,
        }

        const fullAddress = `${profileData.address}, ${profileData.city}, ${profileData.district}`

        const order = await createOrder({
            userId: user?.id,
            customerName: profileData.full_name,
            customerEmail: profileData.email,
            customerPhone: profileData.phone,
            shippingAddress: fullAddress,
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

    // Show profile modal if needed
    if (step === "profile" || showEditProfile) {
        return (
            <UserProfileModal
                onClose={onClose}
                onProfileComplete={handleProfileComplete}
            />
        )
    }

    // Loading state
    if (step === "loading") {
        return (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4">
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
                        <div className="absolute -inset-2 border-2 border-amber-500/30 border-t-amber-500 rounded-2xl animate-spin" />
                    </div>
                    <p className="text-gray-600">Loading your profile...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 no-overscroll">
            <motion.div
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="bg-white rounded-t-[2rem] sm:rounded-2xl border-x border-t sm:border border-gray-200 shadow-2xl max-w-lg w-full max-h-[92vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
            >
                {step === "checkout" ? (
                    <>
                        {/* Mobile Drag Handle */}
                        <div className="sm:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-1" />

                        {/* Header */}
                        <div className="relative px-6 py-5 flex items-center justify-between z-20 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-rose-500/10" />
                            <div className="absolute inset-0 backdrop-blur-2xl bg-white/80" />
                            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-pulse" style={{ animationDuration: '3s' }} />
                            
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 animate-pulse" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600">Secure Checkout</span>
                                </div>
                                <h3 className="text-xl font-serif font-bold text-gray-900">Complete Your Order</h3>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="relative h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 shadow-sm transition-all duration-300 hover:scale-105 hover:rotate-90"
                            >
                                <X className="h-4 w-4 text-gray-700" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none bg-white">
                            {/* Order Item */}
                            <div className="flex gap-5 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                                <div className="h-28 w-20 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                                    <Image src={item.coverUrl} alt={item.title} width={80} height={120} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1 py-1">
                                    <h4 className="font-serif font-bold text-lg line-clamp-1 text-gray-900">{item.title}</h4>
                                    <p className="text-sm text-gray-600">{item.author}</p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 capitalize">{item.format}</span>
                                        <span className="text-xs text-gray-500">Quantity: {item.quantity}</span>
                                    </div>
                                    <p className="font-bold text-amber-600 mt-2">NRS {subtotal.toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Delivery Details */}
                            {profileData && (
                                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-semibold text-gray-900">Delivery Details</h4>
                                        <Button variant="ghost" size="sm" onClick={() => setShowEditProfile(true)} className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 h-8 px-3">
                                            <Edit2 className="h-3.5 w-3.5 mr-1.5" />Edit
                                        </Button>
                                    </div>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-medium text-gray-900">{profileData.full_name}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="font-medium text-gray-900">{profileData.phone}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium text-gray-900 truncate ml-4">{profileData.email}</span></div>
                                        <div className="pt-2 border-t border-gray-200">
                                            <span className="text-gray-500 block mb-1">Shipping Address</span>
                                            <span className="font-medium text-gray-900">{profileData.address}, {profileData.city}, {profileData.district}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Order Summary */}
                            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3">
                                <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal</span><span className="font-medium text-gray-900">NRS {subtotal.toLocaleString()}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-600">Shipping Fee</span><span className="font-medium text-gray-900">{shipping > 0 ? `NRS ${shipping}` : "FREE"}</span></div>
                                <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                                    <span className="font-serif font-bold text-lg text-gray-900">Total Amount</span>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-amber-600">NRS {total.toLocaleString()}</span>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">VAT Included</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-white border-t border-gray-200 mt-auto">
                            <Button onClick={handleSubmit} disabled={loading} className="w-full h-14 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]">
                                {loading ? (<div className="flex items-center gap-2"><div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Placing Order...</div>) : "Place Your Order"}
                            </Button>
                        </div>
                    </>
                ) : (
                    /* Success State */
                    <div className="flex-1 overflow-y-auto p-10 flex flex-col items-center text-center justify-center bg-white">
                        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mb-8">
                            <CheckCircle2 className="h-12 w-12 text-green-600" />
                        </motion.div>
                        <div className="space-y-3 mb-8">
                            <h3 className="text-3xl font-serif font-bold text-gray-900">Order Confirmed!</h3>
                            <p className="text-gray-600 max-w-xs mx-auto">Thank you for your purchase. We've received your order and are processing it now.</p>
                        </div>
                        <div className="w-full bg-gray-50 rounded-3xl p-6 border border-gray-200 mb-8">
                            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold mb-2">Order Tracking Identity</p>
                            <p className="text-2xl font-mono font-black tracking-wider text-gray-900">{trackingNumber}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            <Button variant="outline" className="h-12 rounded-xl order-2 sm:order-1 border-gray-300 text-gray-700 hover:bg-gray-100" onClick={onClose}>Continue Shopping</Button>
                            <Button className="h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-white order-1 sm:order-2 font-bold" onClick={() => window.location.href = `/track-order?tracking=${trackingNumber}`}>Track My Order</Button>
                        </div>
                        <p className="mt-8 text-xs text-gray-500 flex items-center gap-2"><AlertCircle className="h-3 w-3" />A confirmation email has been sent to {profileData?.email}</p>
                    </div>
                )}
            </motion.div>
        </div>
    )
}
