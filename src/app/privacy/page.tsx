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
    { id: '1', title: '1. Information We Collect', content: 'We collect information you provide directly to us, such as your name, email address, phone number, shipping address, and payment information when you make a purchase or create an account.' },
    { id: '2', title: '2. How We Use Your Information', content: 'We use the information we collect to process orders, communicate with you, improve our services, and send promotional materials (with your consent).' },
    { id: '3', title: '3. Information Sharing', content: 'We do not sell your personal information. We may share your information with service providers who assist us in operating our business, such as payment processors and shipping companies.' },
    { id: '4', title: '4. Data Security', content: 'We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.' },
    { id: '5', title: '5. Your Rights', content: 'You have the right to access, update, or delete your personal information. You can manage your account settings or contact us to exercise these rights.' },
    { id: '6', title: '6. Cookies', content: 'We use cookies to enhance your browsing experience. Please see our Cookie Policy for more information about how we use cookies.' },
    { id: '7', title: '7. Changes to This Policy', content: 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.' },
    { id: '8', title: '8. Contact Us', content: 'If you have any questions about this Privacy Policy, please contact us at hello@hamropustak.com.' },
]

export default function PrivacyPage() {
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
            .eq('key', 'privacy_content')
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
                key: 'privacy_content',
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
                <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-8">Privacy Policy</h1>
                
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
