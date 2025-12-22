'use client'

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Pencil, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Section {
    id: string
    title: string
    content: string
}

const defaultSections: Section[] = [
    { id: '1', title: '1. Acceptance of Terms', content: 'By accessing and using Hamro Pustak Pasal, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.' },
    { id: '2', title: '2. Use of Service', content: 'You agree to use our service only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account information.' },
    { id: '3', title: '3. Products and Pricing', content: 'All prices are listed in Nepalese Rupees (NRS). We reserve the right to modify prices at any time. Product availability is subject to change without notice.' },
    { id: '4', title: '4. Orders and Payment', content: 'By placing an order, you agree to provide accurate and complete information. We reserve the right to refuse or cancel any order for any reason.' },
    { id: '5', title: '5. Shipping and Delivery', content: 'Delivery times are estimates and may vary. We are not responsible for delays caused by shipping carriers or circumstances beyond our control.' },
    { id: '6', title: '6. Returns and Refunds', content: 'Please refer to our Returns & Refunds policy for detailed information about returning products and obtaining refunds.' },
    { id: '7', title: '7. Intellectual Property', content: 'All content on this website, including text, images, and logos, is the property of Hamro Pustak Pasal and is protected by copyright laws.' },
    { id: '8', title: '8. Contact Us', content: 'If you have any questions about these Terms, please contact us at hello@hamropustak.com.' },
]

export default function TermsPage() {
    const [isAdmin, setIsAdmin] = useState(false)
    const [sections, setSections] = useState<Section[]>(defaultSections)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editContent, setEditContent] = useState('')
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
            .eq('key', 'terms_content')
            .single()
        if (data?.value) {
            setSections(data.value as Section[])
        }
    }

    const startEdit = (section: Section) => {
        setEditingId(section.id)
        setEditContent(section.content)
    }

    const saveEdit = async (id: string) => {
        const updated = sections.map(s => 
            s.id === id ? { ...s, content: editContent } : s
        )
        setSections(updated)
        setEditingId(null)
        
        await supabase
            .from('site_settings')
            .upsert({
                key: 'terms_content',
                value: updated,
                updated_at: new Date().toISOString()
            }, { onConflict: 'key' })
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditContent('')
    }

    return (
        <div className="min-h-screen bg-background pt-24 sm:pt-32 pb-16 px-4">
            <div className="container max-w-3xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-8">Terms of Service</h1>
                
                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
                    <p className="text-muted-foreground">Last updated: December 2025</p>
                    
                    {sections.map((section) => (
                        <section key={section.id} className="space-y-4">
                            <h2 className="text-xl font-semibold">{section.title}</h2>
                            {editingId === section.id ? (
                                <div className="space-y-2">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full p-3 border rounded-lg bg-background min-h-[100px] text-sm"
                                    />
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={() => saveEdit(section.id)}>
                                            <Check className="h-4 w-4 mr-1" /> Save
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                                            <X className="h-4 w-4 mr-1" /> Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="group relative">
                                    <p className="text-muted-foreground">{section.content}</p>
                                    {isAdmin && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => startEdit(section)}
                                            className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            )}
                        </section>
                    ))}
                </div>
            </div>
        </div>
    )
}
