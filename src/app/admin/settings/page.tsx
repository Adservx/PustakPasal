'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
    ArrowLeft, 
    Plus, 
    Trash2, 
    Truck, 
    Shield, 
    RotateCcw, 
    Clock, 
    Gift, 
    Percent,
    Check,
    Facebook,
    Instagram,
    Youtube,
    Linkedin,
    MessageCircle,
    Send,
    Loader2,
    CheckCircle2
} from 'lucide-react'
import { TrustBadge, SocialLink } from '@/lib/site-settings'

// X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
)

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
)

const iconOptions = [
    { value: 'truck', label: 'Truck', icon: Truck },
    { value: 'shield', label: 'Shield', icon: Shield },
    { value: 'rotate-ccw', label: 'Returns', icon: RotateCcw },
    { value: 'clock', label: 'Clock', icon: Clock },
    { value: 'gift', label: 'Gift', icon: Gift },
    { value: 'percent', label: 'Percent', icon: Percent },
]

const colorOptions = [
    { value: 'emerald', label: 'Green', class: 'bg-emerald-100 text-emerald-600' },
    { value: 'blue', label: 'Blue', class: 'bg-blue-100 text-blue-600' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-100 text-purple-600' },
    { value: 'amber', label: 'Amber', class: 'bg-amber-100 text-amber-600' },
    { value: 'rose', label: 'Rose', class: 'bg-rose-100 text-rose-600' },
    { value: 'cyan', label: 'Cyan', class: 'bg-cyan-100 text-cyan-600' },
]

const socialPlatforms = [
    { value: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/yourpage' },
    { value: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/yourhandle' },
    { value: 'x', label: 'X (Twitter)', icon: XIcon, placeholder: 'https://x.com/yourhandle' },
    { value: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/@yourchannel' },
    { value: 'tiktok', label: 'TikTok', icon: TikTokIcon, placeholder: 'https://tiktok.com/@yourhandle' },
    { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, placeholder: 'https://wa.me/9779800000000' },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/company/yourcompany' },
    { value: 'telegram', label: 'Telegram', icon: Send, placeholder: 'https://t.me/yourchannel' },
]

export default function SettingsPage() {
    const [badges, setBadges] = useState<TrustBadge[]>([])
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
    const [loading, setLoading] = useState(true)
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
    const [isAdmin, setIsAdmin] = useState(false)
    const router = useRouter()
    const supabase = createClient()
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const initialLoadRef = useRef(true)

    useEffect(() => {
        checkAdminAndFetch()
    }, [])

    // Auto-save effect with debounce
    useEffect(() => {
        // Skip auto-save on initial load
        if (initialLoadRef.current) {
            return
        }

        // Clear existing timeout
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current)
        }

        // Set saving status immediately to show user something is happening
        setSaveStatus('saving')

        // Debounce save by 1 second
        saveTimeoutRef.current = setTimeout(() => {
            autoSave()
        }, 1000)

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current)
            }
        }
    }, [badges, socialLinks])

    const autoSave = async () => {
        try {
            // Save trust badges
            await supabase
                .from('site_settings')
                .upsert({
                    key: 'trust_badges',
                    value: badges,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'key' })

            // Save social links
            await supabase
                .from('site_settings')
                .upsert({
                    key: 'social_links',
                    value: socialLinks,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'key' })

            setSaveStatus('saved')
            
            // Reset to idle after 2 seconds
            setTimeout(() => {
                setSaveStatus('idle')
            }, 2000)
        } catch (error) {
            console.error('Auto-save failed:', error)
            setSaveStatus('idle')
        }
    }

    useEffect(() => {
        checkAdminAndFetch()
    }, [])

    const checkAdminAndFetch = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push('/login')
            return
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'admin') {
            router.push('/')
            return
        }

        setIsAdmin(true)
        fetchSettings()
    }

    const fetchSettings = async () => {
        // Fetch trust badges
        const { data: badgesData } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'trust_badges')
            .single()

        if (badgesData?.value) {
            setBadges(badgesData.value as TrustBadge[])
        }

        // Fetch social links
        const { data: socialData } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'social_links')
            .single()

        if (socialData?.value) {
            setSocialLinks(socialData.value as SocialLink[])
        } else {
            // Default social links
            setSocialLinks([
                { id: '1', platform: 'facebook', url: '', enabled: true },
                { id: '2', platform: 'instagram', url: '', enabled: true },
                { id: '3', platform: 'x', url: '', enabled: true }
            ])
        }

        setLoading(false)
        // Mark initial load as complete after a short delay
        setTimeout(() => {
            initialLoadRef.current = false
        }, 100)
    }

    // Trust Badge functions
    const addBadge = () => {
        const newBadge: TrustBadge = {
            id: Date.now().toString(),
            icon: 'truck',
            title: 'New Badge',
            description: 'Description here',
            enabled: true,
            color: 'emerald'
        }
        setBadges([...badges, newBadge])
    }

    const removeBadge = (id: string) => {
        setBadges(badges.filter(b => b.id !== id))
    }

    const updateBadge = (id: string, field: keyof TrustBadge, value: any) => {
        setBadges(badges.map(b => b.id === id ? { ...b, [field]: value } : b))
    }

    // Social Link functions
    const addSocialLink = () => {
        // Find a platform that's not already added
        const usedPlatforms = socialLinks.map(s => s.platform)
        const availablePlatform = socialPlatforms.find(p => !usedPlatforms.includes(p.value as any))
        
        if (!availablePlatform) {
            alert('All social platforms have been added!')
            return
        }

        const newLink: SocialLink = {
            id: Date.now().toString(),
            platform: availablePlatform.value as any,
            url: '',
            enabled: true
        }
        setSocialLinks([...socialLinks, newLink])
    }

    const removeSocialLink = (id: string) => {
        setSocialLinks(socialLinks.filter(s => s.id !== id))
    }

    const updateSocialLink = (id: string, field: keyof SocialLink, value: any) => {
        setSocialLinks(socialLinks.map(s => s.id === id ? { ...s, [field]: value } : s))
    }

    const getIconComponent = (iconName: string) => {
        const option = iconOptions.find(o => o.value === iconName)
        return option?.icon || Truck
    }

    const getSocialIcon = (platform: string) => {
        const option = socialPlatforms.find(p => p.value === platform)
        return option?.icon || Facebook
    }

    const getSocialPlaceholder = (platform: string) => {
        const option = socialPlatforms.find(p => p.value === platform)
        return option?.placeholder || 'https://'
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!isAdmin) return null

    return (
        <div className="min-h-screen bg-background pt-20 sm:pt-24 pb-12 px-3 sm:px-4">
            <div className="container max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col gap-4 mb-6 sm:mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-4">
                            <Link href="/admin">
                                <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                                    <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold">Site Settings</h1>
                                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Manage trust badges and social links</p>
                            </div>
                        </div>
                        {/* Auto-save status indicator */}
                        <div className="flex items-center gap-2 text-sm">
                            {saveStatus === 'saving' && (
                                <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground bg-secondary/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                                    <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                                    <span className="text-xs sm:text-sm">Saving...</span>
                                </div>
                            )}
                            {saveStatus === 'saved' && (
                                <div className="flex items-center gap-1.5 sm:gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                                    <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    <span className="text-xs sm:text-sm">Saved</span>
                                </div>
                            )}
                            {saveStatus === 'idle' && (
                                <div className="flex items-center gap-2 text-muted-foreground px-2 sm:px-3 py-1 sm:py-1.5">
                                    <span className="text-[10px] sm:text-xs">Auto-save</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground sm:hidden -mt-2 ml-11">Manage trust badges and social links</p>
                </div>

                {/* Social Links Section */}
                <div className="bg-card rounded-xl sm:rounded-2xl border shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                        <div>
                            <h2 className="text-lg sm:text-xl font-semibold">Social Media Links</h2>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                Add your social media profiles to display in the footer
                            </p>
                        </div>
                        <Button onClick={addSocialLink} variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                            <Plus className="h-4 w-4" />
                            Add Social
                        </Button>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        {socialLinks.map((link) => {
                            const IconComponent = getSocialIcon(link.platform)
                            const usedPlatforms = socialLinks.filter(s => s.id !== link.id).map(s => s.platform)
                            const availablePlatforms = socialPlatforms.filter(p => !usedPlatforms.includes(p.value as any) || p.value === link.platform)
                            
                            return (
                                <div 
                                    key={link.id} 
                                    className={`border rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all duration-300 ${
                                        link.enabled 
                                            ? 'bg-background border-border shadow-sm' 
                                            : 'bg-muted/30 border-muted opacity-50 grayscale'
                                    }`}
                                >
                                    {/* Mobile Layout */}
                                    <div className="flex flex-col gap-3 sm:hidden">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                                    <IconComponent className="h-4 w-4" />
                                                </div>
                                                <select
                                                    value={link.platform}
                                                    onChange={(e) => updateSocialLink(link.id, 'platform', e.target.value)}
                                                    className="h-9 px-2 rounded-lg border bg-background text-sm font-medium"
                                                >
                                                    {availablePlatforms.map(p => (
                                                        <option key={p.value} value={p.value}>{p.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant={link.enabled ? "default" : "outline"}
                                                    size="sm"
                                                    className="h-8 px-2 text-xs"
                                                    onClick={() => updateSocialLink(link.id, 'enabled', !link.enabled)}
                                                >
                                                    {link.enabled ? 'On' : 'Off'}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                    onClick={() => removeSocialLink(link.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <Input
                                            value={link.url}
                                            onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                                            placeholder={getSocialPlaceholder(link.platform)}
                                            className="h-10 text-sm"
                                        />
                                    </div>

                                    {/* Desktop Layout */}
                                    <div className="hidden sm:flex items-center gap-4">
                                        {/* Icon Preview */}
                                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                            <IconComponent className="h-5 w-5" />
                                        </div>

                                        {/* Platform Select & URL */}
                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3">
                                            <select
                                                value={link.platform}
                                                onChange={(e) => updateSocialLink(link.id, 'platform', e.target.value)}
                                                className="h-10 px-3 rounded-lg border bg-background text-sm"
                                            >
                                                {availablePlatforms.map(p => (
                                                    <option key={p.value} value={p.value}>{p.label}</option>
                                                ))}
                                            </select>
                                            <Input
                                                value={link.url}
                                                onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                                                placeholder={getSocialPlaceholder(link.platform)}
                                                className="h-10"
                                            />
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 flex-shrink-0">
                                            <Button
                                                variant={link.enabled ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => updateSocialLink(link.id, 'enabled', !link.enabled)}
                                            >
                                                {link.enabled ? 'Enabled' : 'Disabled'}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => removeSocialLink(link.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        {socialLinks.length === 0 && (
                            <div className="text-center py-6 sm:py-8 text-muted-foreground">
                                <p className="text-sm">No social links configured.</p>
                                <Button onClick={addSocialLink} variant="link" className="mt-2 text-sm">
                                    Add your first social link
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Trust Badges Section */}
                <div className="bg-card rounded-xl sm:rounded-2xl border shadow-sm p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                        <div>
                            <h2 className="text-lg sm:text-xl font-semibold">Trust Badges</h2>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                These appear on book detail pages to build customer trust
                            </p>
                        </div>
                        <Button onClick={addBadge} variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                            <Plus className="h-4 w-4" />
                            Add Badge
                        </Button>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        {badges.map((badge) => {
                            const IconComponent = getIconComponent(badge.icon)
                            const colorClass = colorOptions.find(c => c.value === badge.color)?.class || 'bg-gray-100 text-gray-600'
                            
                            return (
                                <div 
                                    key={badge.id} 
                                    className={`border rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all duration-300 ${
                                        badge.enabled 
                                            ? 'bg-background border-border shadow-sm' 
                                            : 'bg-muted/30 border-muted opacity-50 grayscale'
                                    }`}
                                >
                                    {/* Mobile Layout */}
                                    <div className="flex flex-col gap-3 sm:hidden">
                                        {/* Header with preview and actions */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${colorClass}`}>
                                                    <IconComponent className="h-5 w-5" />
                                                </div>
                                                <span className="text-sm font-medium">{badge.title}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant={badge.enabled ? "default" : "outline"}
                                                    size="sm"
                                                    className="h-8 px-2 text-xs"
                                                    onClick={() => updateBadge(badge.id, 'enabled', !badge.enabled)}
                                                >
                                                    {badge.enabled ? 'On' : 'Off'}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                    onClick={() => removeBadge(badge.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        
                                        {/* Form fields */}
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label>
                                                <Input
                                                    value={badge.title}
                                                    onChange={(e) => updateBadge(badge.id, 'title', e.target.value)}
                                                    placeholder="Badge title"
                                                    className="h-10"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
                                                <Input
                                                    value={badge.description}
                                                    onChange={(e) => updateBadge(badge.id, 'description', e.target.value)}
                                                    placeholder="Short description"
                                                    className="h-10"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Icon</label>
                                                    <div className="flex gap-1 flex-wrap">
                                                        {iconOptions.map(opt => {
                                                            const Icon = opt.icon
                                                            return (
                                                                <button
                                                                    key={opt.value}
                                                                    onClick={() => updateBadge(badge.id, 'icon', opt.value)}
                                                                    className={`p-2 rounded-lg border transition-all ${badge.icon === opt.value ? 'border-primary bg-primary/10' : 'hover:bg-muted'}`}
                                                                >
                                                                    <Icon className="h-4 w-4" />
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Color</label>
                                                    <div className="flex gap-1 flex-wrap">
                                                        {colorOptions.map(opt => (
                                                            <button
                                                                key={opt.value}
                                                                onClick={() => updateBadge(badge.id, 'color', opt.value)}
                                                                className={`w-7 h-7 rounded-full ${opt.class} flex items-center justify-center transition-all ${badge.color === opt.value ? 'ring-2 ring-offset-1 ring-primary' : ''}`}
                                                            >
                                                                {badge.color === opt.value && <Check className="h-3 w-3" />}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop Layout */}
                                    <div className="hidden sm:flex items-start gap-4">
                                        {/* Preview */}
                                        <div className="flex flex-col items-center gap-2 min-w-[80px]">
                                            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${colorClass}`}>
                                                <IconComponent className="h-6 w-6" />
                                            </div>
                                            <span className="text-xs text-center font-medium">{badge.title}</span>
                                        </div>

                                        {/* Form */}
                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label>
                                                <Input
                                                    value={badge.title}
                                                    onChange={(e) => updateBadge(badge.id, 'title', e.target.value)}
                                                    placeholder="Badge title"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
                                                <Input
                                                    value={badge.description}
                                                    onChange={(e) => updateBadge(badge.id, 'description', e.target.value)}
                                                    placeholder="Short description"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Icon</label>
                                                <div className="flex gap-1 flex-wrap">
                                                    {iconOptions.map(opt => {
                                                        const Icon = opt.icon
                                                        return (
                                                            <button
                                                                key={opt.value}
                                                                onClick={() => updateBadge(badge.id, 'icon', opt.value)}
                                                                className={`p-2 rounded-lg border transition-all ${badge.icon === opt.value ? 'border-primary bg-primary/10' : 'hover:bg-muted'}`}
                                                            >
                                                                <Icon className="h-4 w-4" />
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Color</label>
                                                <div className="flex gap-1 flex-wrap">
                                                    {colorOptions.map(opt => (
                                                        <button
                                                            key={opt.value}
                                                            onClick={() => updateBadge(badge.id, 'color', opt.value)}
                                                            className={`w-8 h-8 rounded-full ${opt.class} flex items-center justify-center transition-all ${badge.color === opt.value ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                                                        >
                                                            {badge.color === opt.value && <Check className="h-4 w-4" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2">
                                            <Button
                                                variant={badge.enabled ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => updateBadge(badge.id, 'enabled', !badge.enabled)}
                                            >
                                                {badge.enabled ? 'Enabled' : 'Disabled'}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => removeBadge(badge.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        {badges.length === 0 && (
                            <div className="text-center py-6 sm:py-8 text-muted-foreground">
                                <p className="text-sm">No trust badges configured.</p>
                                <Button onClick={addBadge} variant="link" className="mt-2 text-sm">
                                    Add your first badge
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
