"use server"

import { createClient } from "@/lib/supabase/server"

export interface UserProfile {
    id: string
    full_name: string | null
    email: string | null
    phone: string | null
    address: string | null
    city: string | null
    district: string | null
    avatar_url: string | null
    is_profile_complete: boolean
    created_at: string
    updated_at: string
}

export interface UpdateProfileData {
    full_name: string
    email: string
    phone: string
    address: string
    city: string
    district: string
}

export async function getUserProfile(): Promise<UserProfile | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

    if (error) {
        console.error("Error fetching profile:", error)
        return null
    }

    return data
}

export async function updateUserProfile(profileData: UpdateProfileData): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        return { success: false, error: "Not authenticated" }
    }

    // Check if all required fields are filled
    const isComplete = !!(
        profileData.full_name?.trim() &&
        profileData.email?.trim() &&
        profileData.phone?.trim() &&
        profileData.address?.trim() &&
        profileData.city?.trim() &&
        profileData.district?.trim()
    )

    const { error } = await supabase
        .from("profiles")
        .update({
            full_name: profileData.full_name,
            email: profileData.email,
            phone: profileData.phone,
            address: profileData.address,
            city: profileData.city,
            district: profileData.district,
            is_profile_complete: isComplete,
            updated_at: new Date().toISOString()
        })
        .eq("id", user.id)

    if (error) {
        console.error("Error updating profile:", error)
        return { success: false, error: error.message }
    }

    return { success: true }
}

export async function isProfileComplete(): Promise<boolean> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return false

    const { data, error } = await supabase
        .from("profiles")
        .select("is_profile_complete")
        .eq("id", user.id)
        .single()

    if (error || !data) return false

    return data.is_profile_complete ?? false
}
