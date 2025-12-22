"use client"

import { useState, useEffect } from "react"
import { RotateCcw, Clock, CheckCircle, AlertCircle, Pencil, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface ReturnsContent {
    returnDays: string
    refundDays: string
    eligible: string[]
    notEligible: string[]
    steps: { title: string, desc: string }[]
    refundInfo: string[]
}

const defaultContent: ReturnsContent = {
    returnDays: "7-Day Returns",
    refundDays: "5-7 business days",
    eligible: [
        "Books in original, unused condition",
        "Items with original packaging intact",
        "Damaged or defective items on arrival",
        "Wrong item received",
        "Missing pages or printing errors"
    ],
    notEligible: [
        "Books with visible wear or damage by customer",
        "Items returned after 7 days",
        "Books with writing, highlighting, or marks",
        "Items without original packaging",
        "Digital products or gift cards"
    ],
    steps: [
        { title: "Initiate Return", desc: "Go to My Orders, find your order, and click 'Request Return'" },
        { title: "Pack the Item", desc: "Pack the book securely in its original packaging" },
        { title: "Ship or Drop Off", desc: "Use our prepaid label or drop off at our nearest branch" },
        { title: "Get Refund", desc: "Once received and inspected, refund is processed within 5-7 days" }
    ],
    refundInfo: [
        "Refunds are credited to your original payment method",
        "Bank transfers may take 3-5 additional business days",
        "Shipping charges are non-refundable unless item was defective",
        "For COD orders, refund is processed via bank transfer"
    ]
}

export default function ReturnsPage() {
    const [isAdmin, setIsAdmin] = useState(false)
    const [content, setContent] = useState<ReturnsContent>(defaultContent)
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
            .eq('key', 'returns_content')
            .single()
        if (data?.value) {
            setContent(data.value as ReturnsContent)
        }
    }

    const saveContent = async (updated: ReturnsContent) => {
        await supabase
            .from('site_settings')
            .upsert({
                key: 'returns_content',
                value: updated,
                updated_at: new Date().toISOString()
            }, { onConflict: 'key' })
    }

    const editListItem = async (field: 'eligible' | 'notEligible' | 'refundInfo', idx: number) => {
        const currentValue = content[field][idx]
        const newValue = prompt("Edit item:", currentValue)
        if (newValue !== null) {
            const updated = {
                ...content,
                [field]: content[field].map((item, i) => i === idx ? newValue : item)
            }
            setContent(updated)
            await saveContent(updated)
        }
    }

    const editStep = async (idx: number, field: 'title' | 'desc') => {
        const currentValue = content.steps[idx][field]
        const newValue = prompt(`Edit ${field}:`, currentValue)
        if (newValue !== null) {
            const updated = {
                ...content,
                steps: content.steps.map((step, i) => 
                    i === idx ? { ...step, [field]: newValue } : step
                )
            }
            setContent(updated)
            await saveContent(updated)
        }
    }

    return (
        <div className="container mx-auto px-4 pt-24 md:pt-32 pb-8 md:pb-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Returns & Refunds</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        We want you to be completely satisfied with your purchase. Here's our hassle-free return policy.
                    </p>
                </div>

                {/* Return Policy Overview */}
                <div className="grid sm:grid-cols-3 gap-4 mb-12">
                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
                            <h3 className="font-semibold mb-1 group">
                                {content.returnDays}
                                {isAdmin && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0 ml-1 opacity-0 group-hover:opacity-100"
                                        onClick={() => {
                                            const newValue = prompt("Edit:", content.returnDays)
                                            if (newValue) {
                                                const updated = { ...content, returnDays: newValue }
                                                setContent(updated)
                                                saveContent(updated)
                                            }
                                        }}
                                    >
                                        <Pencil className="h-3 w-3" />
                                    </Button>
                                )}
                            </h3>
                            <p className="text-sm text-muted-foreground">Return within 7 days of delivery</p>
                        </CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <RotateCcw className="h-8 w-8 text-primary mx-auto mb-3" />
                            <h3 className="font-semibold mb-1">Easy Process</h3>
                            <p className="text-sm text-muted-foreground">Simple online return request</p>
                        </CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <CheckCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                            <h3 className="font-semibold mb-1">Quick Refunds</h3>
                            <p className="text-sm text-muted-foreground group">
                                Refund within {content.refundDays}
                                {isAdmin && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0 ml-1 opacity-0 group-hover:opacity-100"
                                        onClick={() => {
                                            const newValue = prompt("Edit:", content.refundDays)
                                            if (newValue) {
                                                const updated = { ...content, refundDays: newValue }
                                                setContent(updated)
                                                saveContent(updated)
                                            }
                                        }}
                                    >
                                        <Pencil className="h-3 w-3" />
                                    </Button>
                                )}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Eligibility */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Return Eligibility</h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-600">
                                    <CheckCircle className="h-5 w-5" />
                                    Eligible for Return
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    {content.eligible.map((item, idx) => (
                                        <li key={idx} className="group">
                                            • {item}
                                            {isAdmin && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-6 w-6 p-0 ml-1 opacity-0 group-hover:opacity-100"
                                                    onClick={() => editListItem('eligible', idx)}
                                                >
                                                    <Pencil className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-600">
                                    <AlertCircle className="h-5 w-5" />
                                    Not Eligible
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    {content.notEligible.map((item, idx) => (
                                        <li key={idx} className="group">
                                            • {item}
                                            {isAdmin && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-6 w-6 p-0 ml-1 opacity-0 group-hover:opacity-100"
                                                    onClick={() => editListItem('notEligible', idx)}
                                                >
                                                    <Pencil className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* How to Return */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">How to Return</h2>
                    <div className="space-y-4">
                        {content.steps.map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-start group">
                                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-semibold">
                                    {idx + 1}
                                </div>
                                <div>
                                    <h3 className="font-semibold">
                                        {item.title}
                                        {isAdmin && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-6 w-6 p-0 ml-1 opacity-0 group-hover:opacity-100"
                                                onClick={() => editStep(idx, 'title')}
                                            >
                                                <Pencil className="h-3 w-3" />
                                            </Button>
                                        )}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {item.desc}
                                        {isAdmin && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-6 w-6 p-0 ml-1 opacity-0 group-hover:opacity-100"
                                                onClick={() => editStep(idx, 'desc')}
                                            >
                                                <Pencil className="h-3 w-3" />
                                            </Button>
                                        )}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Refund Info */}
                <div className="bg-muted/50 rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-semibold mb-4">Refund Information</h2>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        {content.refundInfo.map((item, idx) => (
                            <li key={idx} className="group">
                                • {item}
                                {isAdmin && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0 ml-1 opacity-0 group-hover:opacity-100"
                                        onClick={() => editListItem('refundInfo', idx)}
                                    >
                                        <Pencil className="h-3 w-3" />
                                    </Button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="text-center">
                    <p className="text-muted-foreground mb-4">Need help with a return?</p>
                    <Link 
                        href="/contact" 
                        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    )
}
