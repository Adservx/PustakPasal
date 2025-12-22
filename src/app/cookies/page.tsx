'use client'

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Pencil, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Section {
    id: string
    title: string
    content: string
    subsections?: { title: string, content: string }[]
}

const defaultSections: Section[] = [
    { id: '1', title: '1. What Are Cookies', content: 'Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.' },
    { 
        id: '2', 
        title: '2. Types of Cookies We Use', 
        content: '',
        subsections: [
            { title: 'Essential Cookies', content: 'These cookies are necessary for the website to function properly. They enable basic features like page navigation, secure areas access, and shopping cart functionality.' },
            { title: 'Preference Cookies', content: 'These cookies remember your preferences such as language, theme (light/dark mode), and other settings to provide a personalized experience.' },
            { title: 'Analytics Cookies', content: 'These cookies help us understand how visitors interact with our website by collecting anonymous information about page visits and user behavior.' }
        ]
    },
    { id: '3', title: '3. How We Use Cookies', content: 'To keep you signed in to your account, to remember items in your shopping cart, to remember your preferences and settings, to analyze website traffic and improve our services, and to provide personalized content and recommendations.' },
    { id: '4', title: '4. Managing Cookies', content: 'You can control and manage cookies through your browser settings. Most browsers allow you to refuse cookies or delete existing cookies. However, disabling cookies may affect the functionality of our website.' },
    { id: '5', title: '5. Third-Party Cookies', content: 'Some cookies on our website are set by third-party services we use, such as payment processors and analytics providers. These third parties have their own privacy policies.' },
    { id: '6', title: '6. Updates to This Policy', content: 'We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.' },
    { id: '7', title: '7. Contact Us', content: 'If you have any questions about our use of cookies, please contact us at hello@hamropustak.com.' },
]

export default function CookiesPage() {
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
            .eq('key', 'cookies_content')
            .single()
        if (data?.value) {
            setSections(data.value as Section[])
        }
    }

    const startEdit = (id: string, content: string) => {
        setEditingId(id)
        setEditContent(content)
    }

    const saveEdit = async (id: string, subIdx?: number) => {
        const updated = sections.map(s => {
            if (s.id === id) {
                if (subIdx !== undefined && s.subsections) {
                    const newSubs = [...s.subsections]
                    newSubs[subIdx] = { ...newSubs[subIdx], content: editContent }
                    return { ...s, subsections: newSubs }
                }
                return { ...s, content: editContent }
            }
            return s
        })
        setSections(updated)
        setEditingId(null)
        
        await supabase
            .from('site_settings')
            .upsert({
                key: 'cookies_content',
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
                <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-8">Cookie Policy</h1>
                
                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
                    <p className="text-muted-foreground">Last updated: December 2025</p>
                    
                    {sections.map((section) => (
                        <section key={section.id} className="space-y-4">
                            <h2 className="text-xl font-semibold">{section.title}</h2>
                            
                            {section.subsections ? (
                                <div className="space-y-3">
                                    {section.subsections.map((sub, subIdx) => (
                                        <div key={subIdx}>
                                            <h3 className="font-medium">{sub.title}</h3>
                                            {editingId === `${section.id}-${subIdx}` ? (
                                                <div className="space-y-2">
                                                    <textarea
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                        className="w-full p-3 border rounded-lg bg-background min-h-[80px] text-sm"
                                                    />
                                                    <div className="flex gap-2">
                                                        <Button size="sm" onClick={() => saveEdit(section.id, subIdx)}>
                                                            <Check className="h-4 w-4 mr-1" /> Save
                                                        </Button>
                                                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                                                            <X className="h-4 w-4 mr-1" /> Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="group relative">
                                                    <p className="text-muted-foreground text-sm">{sub.content}</p>
                                                    {isAdmin && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => startEdit(`${section.id}-${subIdx}`, sub.content)}
                                                            className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
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
                                                    onClick={() => startEdit(section.id, section.content)}
                                                    className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </section>
                    ))}
                </div>
            </div>
        </div>
    )
}
