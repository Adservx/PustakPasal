import { createClient } from '@/lib/supabase/client'

export interface TrustBadge {
    id: string
    icon: 'truck' | 'shield' | 'rotate-ccw' | 'clock' | 'gift' | 'percent'
    title: string
    description: string
    enabled: boolean
    color: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose' | 'cyan'
}

export interface SocialLink {
    id: string
    platform: 'facebook' | 'instagram' | 'x' | 'youtube' | 'tiktok' | 'whatsapp' | 'linkedin' | 'telegram'
    url: string
    enabled: boolean
}

export async function getTrustBadges(): Promise<TrustBadge[]> {
    const supabase = createClient()
    
    const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'trust_badges')
        .single()
    
    if (error || !data) {
        // Return default badges if fetch fails
        return [
            { id: '1', icon: 'truck', title: 'Free Delivery', description: 'On orders above NRS 500', enabled: true, color: 'emerald' },
            { id: '2', icon: 'shield', title: 'Secure Payment', description: '100% secure checkout', enabled: true, color: 'blue' },
            { id: '3', icon: 'rotate-ccw', title: 'Easy Returns', description: '7-day return policy', enabled: true, color: 'purple' }
        ]
    }
    
    return data.value as TrustBadge[]
}

export async function updateTrustBadges(badges: TrustBadge[]): Promise<boolean> {
    const supabase = createClient()
    
    const { error } = await supabase
        .from('site_settings')
        .upsert({
            key: 'trust_badges',
            value: badges,
            updated_at: new Date().toISOString()
        }, { onConflict: 'key' })
    
    return !error
}

export async function getSocialLinks(): Promise<SocialLink[]> {
    const supabase = createClient()
    
    const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'social_links')
        .single()
    
    if (error || !data) {
        return [
            { id: '1', platform: 'facebook', url: '', enabled: true },
            { id: '2', platform: 'instagram', url: '', enabled: true },
            { id: '3', platform: 'x', url: '', enabled: true }
        ]
    }
    
    return data.value as SocialLink[]
}

export async function updateSocialLinks(links: SocialLink[]): Promise<boolean> {
    const supabase = createClient()
    
    const { error } = await supabase
        .from('site_settings')
        .upsert({
            key: 'social_links',
            value: links,
            updated_at: new Date().toISOString()
        }, { onConflict: 'key' })
    
    return !error
}
