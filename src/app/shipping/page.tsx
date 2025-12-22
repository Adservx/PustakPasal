"use client"

import { useState, useEffect } from "react"
import { Truck, Clock, MapPin, Package, CheckCircle, Pencil, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface ShippingContent {
    standardValley: string
    standardOther: string
    standardFree: string
    standardFlat: string
    expressValley: string
    expressOther: string
    expressFee: string
    expressNote: string
    notes: string[]
}

const defaultContent: ShippingContent = {
    standardValley: "3-5 days",
    standardOther: "5-7 days",
    standardFree: "Free shipping on orders above Rs. 1,500",
    standardFlat: "Rs. 100 flat rate for orders below Rs. 1,500",
    expressValley: "1-2 days",
    expressOther: "2-3 days",
    expressFee: "Additional Rs. 150 for express delivery",
    expressNote: "Available for select locations only",
    notes: [
        "Delivery times may vary during festivals and peak seasons",
        "You'll receive SMS/email notifications at each delivery stage",
        "Someone must be available to receive the package at the delivery address",
        "For bulk orders (10+ books), please contact us for special shipping rates"
    ]
}

export default function ShippingPage() {
    const [isAdmin, setIsAdmin] = useState(false)
    const [content, setContent] = useState<ShippingContent>(defaultContent)
    const [editingField, setEditingField] = useState<string | null>(null)
    const [editValue, setEditValue] = useState("")
    const supabase = createClient()

    useEffect(() => {
        checkAdmin()
        loadContent()
    }, [])

    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()
            setIsAdmin(profile?.role === 'admin')
        }
    }

    const loadContent = async () => {
        const { data } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'shipping_content')
            .single()
        if (data?.value) {
            setContent(data.value as ShippingContent)
        }
    }

    const startEdit = (field: string, value: string) => {
        setEditingField(field)
        setEditValue(value)
    }

    const saveEdit = async (field: string) => {
        const updated = { ...content, [field]: editValue }
        setContent(updated)
        setEditingField(null)
        await supabase
            .from('site_settings')
            .upsert({
                key: 'shipping_content',
                value: updated,
                updated_at: new Date().toISOString()
            }, { onConflict: 'key' })
    }

    const EditableText = ({ field, value, className = "" }: { field: string, value: string, className?: string }) => {
        if (editingField === field) {
            return (
                <div className="flex items-center gap-2">
                    <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 p-1 border rounded bg-background text-sm"
                    />
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => saveEdit(field)}>
                        <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setEditingField(null)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
        return (
            <span className={`group relative ${className}`}>
                {value}
                {isAdmin && (
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 ml-1 opacity-0 group-hover:opacity-100 inline-flex"
                        onClick={() => startEdit(field, value)}
                    >
                        <Pencil className="h-3 w-3" />
                    </Button>
                )}
            </span>
        )
    }

    return (
        <div className="container mx-auto px-4 pt-24 md:pt-32 pb-8 md:pb-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Shipping Information</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Everything you need to know about how we deliver your books to your doorstep.
                    </p>
                </div>

                {/* Shipping Options */}
                <div className="grid sm:grid-cols-2 gap-6 mb-12">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5 text-primary" />
                                Standard Delivery
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Kathmandu Valley</span>
                                <EditableText field="standardValley" value={content.standardValley} className="font-medium" />
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Other Areas</span>
                                <EditableText field="standardOther" value={content.standardOther} className="font-medium" />
                            </div>
                            <div className="pt-2 border-t">
                                <p className="text-sm text-muted-foreground">
                                    <EditableText field="standardFree" value={content.standardFree} />
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    <EditableText field="standardFlat" value={content.standardFlat} />
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                Express Delivery
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Kathmandu Valley</span>
                                <EditableText field="expressValley" value={content.expressValley} className="font-medium" />
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Other Areas</span>
                                <EditableText field="expressOther" value={content.expressOther} className="font-medium" />
                            </div>
                            <div className="pt-2 border-t">
                                <p className="text-sm text-muted-foreground">
                                    <EditableText field="expressFee" value={content.expressFee} />
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    <EditableText field="expressNote" value={content.expressNote} />
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Delivery Process */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">How It Works</h2>
                    <div className="grid sm:grid-cols-4 gap-4">
                        {[
                            { icon: Package, title: "Order Placed", desc: "Your order is confirmed" },
                            { icon: CheckCircle, title: "Processing", desc: "We prepare your books" },
                            { icon: Truck, title: "Shipped", desc: "On the way to you" },
                            { icon: MapPin, title: "Delivered", desc: "At your doorstep" }
                        ].map((step, idx) => (
                            <div key={idx} className="text-center p-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                    <step.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-semibold mb-1">{step.title}</h3>
                                <p className="text-sm text-muted-foreground">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Delivery Areas */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Delivery Areas</h2>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        Kathmandu Valley
                                    </h3>
                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                        <li>• Kathmandu</li>
                                        <li>• Lalitpur</li>
                                        <li>• Bhaktapur</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        Other Major Cities
                                    </h3>
                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                        <li>• Pokhara</li>
                                        <li>• Birganj</li>
                                        <li>• Biratnagar</li>
                                        <li>• Chitwan</li>
                                        <li>• And 70+ other districts</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Important Notes */}
                <div className="bg-muted/50 rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Important Notes</h2>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        {content.notes.map((note, idx) => (
                            <li key={idx} className="group">
                                • {note}
                                {isAdmin && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0 ml-1 opacity-0 group-hover:opacity-100 inline-flex"
                                        onClick={() => {
                                            const newNote = prompt("Edit note:", note)
                                            if (newNote !== null) {
                                                const updated = { ...content, notes: content.notes.map((n, i) => i === idx ? newNote : n) }
                                                setContent(updated)
                                                supabase.from('site_settings').upsert({
                                                    key: 'shipping_content',
                                                    value: updated,
                                                    updated_at: new Date().toISOString()
                                                }, { onConflict: 'key' })
                                            }
                                        }}
                                    >
                                        <Pencil className="h-3 w-3" />
                                    </Button>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t">
                        <p className="text-sm">
                            Have questions about shipping?{" "}
                            <Link href="/contact" className="text-primary hover:underline">Contact us</Link>
                            {" "}or check our{" "}
                            <Link href="/faq" className="text-primary hover:underline">FAQs</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
