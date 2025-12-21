"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, User, MapPin, Phone, Mail, Building2, CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import Image from "next/image"

interface UserProfileModalProps {
    onClose: () => void
    onProfileComplete: (profileData: ProfileData) => void
}

export interface ProfileData {
    full_name: string
    email: string
    phone: string
    address: string
    city: string
    district: string
}

export function UserProfileModal({ onClose, onProfileComplete }: UserProfileModalProps) {
    const [loading, setLoading] = useState(false)
    const [fetchingProfile, setFetchingProfile] = useState(true)
    const [formData, setFormData] = useState<ProfileData>({
        full_name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        district: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
            // Pre-fill email from auth
            setFormData(prev => ({ ...prev, email: user.email || "" }))
            
            // Fetch existing profile data
            const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single()

            if (profile) {
                setFormData({
                    full_name: profile.full_name || "",
                    email: profile.email || user.email || "",
                    phone: profile.phone || "",
                    address: profile.address || "",
                    city: profile.city || "",
                    district: profile.district || "",
                })
            }
        }
        setFetchingProfile(false)
    }

    const validate = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.full_name.trim()) newErrors.full_name = "Full name is required"
        if (!formData.email.trim()) newErrors.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email"
        if (!formData.phone.trim()) newErrors.phone = "Phone is required"
        else if (!/^(\+977)?[0-9]{10}$/.test(formData.phone.replace(/\s/g, ""))) 
            newErrors.phone = "Invalid phone number"
        if (!formData.address.trim()) newErrors.address = "Address is required"
        if (!formData.city.trim()) newErrors.city = "City is required"
        if (!formData.district.trim()) newErrors.district = "District is required"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validate()) return

        setLoading(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            toast.error("Please login to continue")
            setLoading(false)
            return
        }

        const { error } = await supabase
            .from("profiles")
            .update({
                full_name: formData.full_name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                district: formData.district,
                is_profile_complete: true,
                updated_at: new Date().toISOString()
            })
            .eq("id", user.id)

        if (error) {
            toast.error("Failed to save profile")
            console.error(error)
        } else {
            toast.success("Profile saved successfully!")
            onProfileComplete(formData)
        }

        setLoading(false)
    }

    const districts = [
        // Province 1
        "Bhojpur", "Dhankuta", "Ilam", "Jhapa", "Khotang", "Morang", "Okhaldhunga", 
        "Panchthar", "Sankhuwasabha", "Solukhumbu", "Sunsari", "Taplejung", "Terhathum", "Udayapur",
        // Madhesh Province
        "Bara", "Dhanusha", "Mahottari", "Parsa", "Rautahat", "Saptari", "Sarlahi", "Siraha",
        // Bagmati Province
        "Bhaktapur", "Chitwan", "Dhading", "Dolakha", "Kathmandu", "Kavrepalanchok", 
        "Lalitpur", "Makwanpur", "Nuwakot", "Ramechhap", "Rasuwa", "Sindhuli", "Sindhupalchok",
        // Gandaki Province
        "Baglung", "Gorkha", "Kaski", "Lamjung", "Manang", "Mustang", "Myagdi", 
        "Nawalpur", "Parbat", "Syangja", "Tanahun",
        // Lumbini Province
        "Arghakhanchi", "Banke", "Bardiya", "Dang", "Eastern Rukum", "Gulmi", "Kapilvastu", 
        "Nawalparasi West", "Palpa", "Pyuthan", "Rolpa", "Rupandehi",
        // Karnali Province
        "Dailekh", "Dolpa", "Humla", "Jajarkot", "Jumla", "Kalikot", "Mugu", 
        "Salyan", "Surkhet", "Western Rukum",
        // Sudurpashchim Province
        "Achham", "Baitadi", "Bajhang", "Bajura", "Dadeldhura", "Darchula", "Doti", 
        "Kailali", "Kanchanpur"
    ]

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 no-overscroll">
            <motion.div
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="bg-white rounded-t-[2rem] sm:rounded-2xl border border-gray-200 shadow-2xl max-w-lg w-full max-h-[92vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Mobile Drag Handle */}
                <div className="sm:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-1" />

                {/* Header */}
                <div className="relative px-6 py-5 flex items-center justify-between z-20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-purple-500/10" />
                    <div className="absolute inset-0 backdrop-blur-2xl bg-white/80" />
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                    
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">Your Profile</span>
                        </div>
                        <h3 className="text-xl font-serif font-bold text-gray-900">
                            Complete Your Details
                        </h3>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="relative h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 shadow-sm transition-all duration-300 hover:scale-105"
                    >
                        <X className="h-4 w-4 text-gray-700" />
                    </Button>
                </div>

                {fetchingProfile ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-10 gap-4">
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
                            <div className="absolute -inset-2 border-2 border-blue-500/30 border-t-blue-500 rounded-2xl animate-spin" />
                        </div>
                        <p className="text-sm text-gray-500">Loading your profile...</p>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none bg-white">
                            {/* Info Banner */}
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
                                <User className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-blue-900">Why we need this?</p>
                                    <p className="text-xs text-blue-700 mt-1">
                                        Your details help us deliver your orders accurately and keep you updated on your purchases.
                                    </p>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="space-y-5">
                                {/* Full Name */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1 text-gray-900 flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-500" />
                                        Full Name
                                    </label>
                                    <Input
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        placeholder="Ram Bahadur Thapa"
                                        className={`h-12 rounded-xl bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-all ${errors.full_name ? "border-red-500 focus:ring-red-500" : ""}`}
                                    />
                                    {errors.full_name && <p className="text-xs text-red-500 ml-1">{errors.full_name}</p>}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1 text-gray-900 flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                        Email Address
                                    </label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="ram@example.com"
                                        className={`h-12 rounded-xl bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-all ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                                    />
                                    {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email}</p>}
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1 text-gray-900 flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        Phone Number
                                    </label>
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+977 98XXXXXXXX"
                                        className={`h-12 rounded-xl bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-all ${errors.phone ? "border-red-500 focus:ring-red-500" : ""}`}
                                    />
                                    {errors.phone && <p className="text-xs text-red-500 ml-1">{errors.phone}</p>}
                                </div>

                                {/* Address */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1 text-gray-900 flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        Street Address
                                    </label>
                                    <Input
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Thamel, Near Garden of Dreams"
                                        className={`h-12 rounded-xl bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-all ${errors.address ? "border-red-500 focus:ring-red-500" : ""}`}
                                    />
                                    {errors.address && <p className="text-xs text-red-500 ml-1">{errors.address}</p>}
                                </div>

                                {/* City & District */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold ml-1 text-gray-900 flex items-center gap-2">
                                            <Building2 className="h-4 w-4 text-gray-500" />
                                            City
                                        </label>
                                        <Input
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            placeholder="Kathmandu"
                                            className={`h-12 rounded-xl bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-all ${errors.city ? "border-red-500 focus:ring-red-500" : ""}`}
                                        />
                                        {errors.city && <p className="text-xs text-red-500 ml-1">{errors.city}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold ml-1 text-gray-900">District</label>
                                        <select
                                            value={formData.district}
                                            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                            className={`h-12 w-full rounded-xl bg-white border border-gray-300 text-gray-900 px-3 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 focus:outline-none transition-all ${errors.district ? "border-red-500 focus:ring-red-500" : ""}`}
                                        >
                                            <option value="">Select</option>
                                            {districts.map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                        {errors.district && <p className="text-xs text-red-500 ml-1">{errors.district}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-white border-t border-gray-200 mt-auto">
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Saving...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5" />
                                        Save & Continue
                                    </div>
                                )}
                            </Button>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    )
}
