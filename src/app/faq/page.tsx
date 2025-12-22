"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Search, Pencil, Check, X, Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface FAQ {
    q: string
    a: string
}

interface FAQCategory {
    category: string
    questions: FAQ[]
}

const defaultFaqs: FAQCategory[] = [
    {
        category: "Orders & Shipping",
        questions: [
            { q: "How long does delivery take?", a: "Delivery typically takes 3-5 business days within Kathmandu Valley and 5-7 business days for other areas in Nepal. You'll receive a tracking number once your order ships." },
            { q: "How can I track my order?", a: "You can track your order using the tracking number sent to your email, or visit our Track Order page and enter your order ID." },
            { q: "Do you offer free shipping?", a: "Yes! We offer free shipping on orders above Rs. 1,500. For orders below this amount, a flat shipping fee of Rs. 100 applies." },
            { q: "Can I change my delivery address after placing an order?", a: "You can change your delivery address within 2 hours of placing your order by contacting our support team. After that, changes may not be possible if the order has already been processed." }
        ]
    },
    {
        category: "Returns & Refunds",
        questions: [
            { q: "What is your return policy?", a: "We accept returns within 7 days of delivery for books in their original condition. The book must be unused and in its original packaging." },
            { q: "How do I initiate a return?", a: "To initiate a return, go to My Orders, select the order, and click 'Request Return'. You can also contact our support team with your order details." },
            { q: "How long do refunds take?", a: "Once we receive and inspect the returned item, refunds are processed within 5-7 business days. The amount will be credited to your original payment method." },
            { q: "Can I exchange a book instead of returning it?", a: "Yes, we offer exchanges for the same book or a different title of equal or lesser value. Contact our support team to arrange an exchange." }
        ]
    },
    {
        category: "Payment",
        questions: [
            { q: "What payment methods do you accept?", a: "We accept eSewa, Khalti, bank transfers, and Cash on Delivery (COD). All online payments are secure and encrypted." },
            { q: "Is Cash on Delivery available?", a: "Yes, COD is available for orders within Nepal. A small COD fee of Rs. 50 may apply for certain locations." },
            { q: "Are my payment details secure?", a: "Absolutely. We use industry-standard encryption and never store your complete payment information on our servers." }
        ]
    },
    {
        category: "Account & Orders",
        questions: [
            { q: "Do I need an account to place an order?", a: "While you can browse books without an account, you'll need to create one to place orders, track shipments, and manage your wishlist." },
            { q: "How do I reset my password?", a: "Click 'Forgot Password' on the login page and enter your email. You'll receive a link to reset your password." },
            { q: "Can I cancel my order?", a: "Orders can be cancelled within 2 hours of placement if they haven't been processed yet. Go to My Orders and click 'Cancel Order' or contact support." }
        ]
    }
]

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [openItems, setOpenItems] = useState<string[]>([])
    const [faqs, setFaqs] = useState<FAQCategory[]>(defaultFaqs)
    const [isAdmin, setIsAdmin] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editQuestion, setEditQuestion] = useState("")
    const [editAnswer, setEditAnswer] = useState("")
    const supabase = createClient()

    useEffect(() => {
        checkAdmin()
        loadFaqs()
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

    const loadFaqs = async () => {
        const { data } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'faq_content')
            .single()
        if (data?.value) {
            setFaqs(data.value as FAQCategory[])
        }
    }

    const saveFaqs = async (updated: FAQCategory[]) => {
        await supabase
            .from('site_settings')
            .upsert({
                key: 'faq_content',
                value: updated,
                updated_at: new Date().toISOString()
            }, { onConflict: 'key' })
    }

    const toggleItem = (id: string) => {
        setOpenItems(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const startEdit = (catIdx: number, qIdx: number, faq: FAQ) => {
        setEditingId(`${catIdx}-${qIdx}`)
        setEditQuestion(faq.q)
        setEditAnswer(faq.a)
    }

    const saveEdit = async (catIdx: number, qIdx: number) => {
        const updated = [...faqs]
        updated[catIdx].questions[qIdx] = { q: editQuestion, a: editAnswer }
        setFaqs(updated)
        setEditingId(null)
        await saveFaqs(updated)
    }

    const deleteQuestion = async (catIdx: number, qIdx: number) => {
        const updated = [...faqs]
        updated[catIdx].questions.splice(qIdx, 1)
        setFaqs(updated)
        await saveFaqs(updated)
    }

    const addQuestion = async (catIdx: number) => {
        const updated = [...faqs]
        updated[catIdx].questions.push({ q: "New Question", a: "Answer here..." })
        setFaqs(updated)
        await saveFaqs(updated)
    }

    const filteredFaqs = faqs.map(category => ({
        ...category,
        questions: category.questions.filter(
            q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.questions.length > 0)

    return (
        <div className="container mx-auto px-4 pt-24 md:pt-32 pb-8 md:pb-12">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h1>
                    <p className="text-muted-foreground">
                        Find answers to common questions about orders, shipping, returns, and more.
                    </p>
                </div>

                {/* Search */}
                <div className="relative mb-8">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* FAQ Categories */}
                <div className="space-y-8">
                    {filteredFaqs.map((category, catIdx) => (
                        <div key={category.category}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-primary">{category.category}</h2>
                                {isAdmin && (
                                    <Button size="sm" variant="ghost" onClick={() => addQuestion(catIdx)}>
                                        <Plus className="h-4 w-4 mr-1" /> Add
                                    </Button>
                                )}
                            </div>
                            <div className="space-y-2">
                                {category.questions.map((item, qIdx) => {
                                    const itemId = `${catIdx}-${qIdx}`
                                    const isOpen = openItems.includes(itemId)
                                    const isEditing = editingId === itemId

                                    return (
                                        <div key={qIdx} className="border rounded-lg group">
                                            {isEditing ? (
                                                <div className="p-4 space-y-3">
                                                    <Input
                                                        value={editQuestion}
                                                        onChange={(e) => setEditQuestion(e.target.value)}
                                                        placeholder="Question"
                                                        className="font-medium"
                                                    />
                                                    <textarea
                                                        value={editAnswer}
                                                        onChange={(e) => setEditAnswer(e.target.value)}
                                                        placeholder="Answer"
                                                        className="w-full p-3 border rounded-lg bg-background min-h-[80px] text-sm"
                                                    />
                                                    <div className="flex gap-2">
                                                        <Button size="sm" onClick={() => saveEdit(catIdx, qIdx)}>
                                                            <Check className="h-4 w-4 mr-1" /> Save
                                                        </Button>
                                                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                                                            <X className="h-4 w-4 mr-1" /> Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => toggleItem(itemId)}
                                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                                                    >
                                                        <span className="font-medium pr-4">{item.q}</span>
                                                        <div className="flex items-center gap-2">
                                                            {isAdmin && (
                                                                <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        className="h-8 w-8 p-0"
                                                                        onClick={(e) => { e.stopPropagation(); startEdit(catIdx, qIdx, item) }}
                                                                    >
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        className="h-8 w-8 p-0 text-destructive"
                                                                        onClick={(e) => { e.stopPropagation(); deleteQuestion(catIdx, qIdx) }}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            )}
                                                            <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                                        </div>
                                                    </button>
                                                    {isOpen && (
                                                        <div className="px-4 pb-4 text-muted-foreground">
                                                            {item.a}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredFaqs.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No questions found matching your search.</p>
                    </div>
                )}

                {/* Contact CTA */}
                <div className="mt-12 text-center p-6 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold mb-2">Still have questions?</h3>
                    <p className="text-muted-foreground mb-4">
                        Can't find what you're looking for? Our support team is here to help.
                    </p>
                    <Link 
                        href="/contact" 
                        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    )
}
