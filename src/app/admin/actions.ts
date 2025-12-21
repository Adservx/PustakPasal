'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteBook(id: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') throw new Error('Unauthorized')

    await supabase.from('books').delete().eq('id', id)
    revalidatePath('/admin')
}

async function uploadCapturedImage(supabase: Awaited<ReturnType<typeof createClient>>, imageDataUrl: string): Promise<string> {
    // Convert base64 data URL to blob
    const base64Data = imageDataUrl.split(',')[1]
    const byteCharacters = atob(base64Data)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    
    // Generate unique filename
    const filename = `book-cover-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
        .from('book-covers')
        .upload(filename, byteArray, {
            contentType: 'image/jpeg',
            upsert: false
        })
    
    if (error) {
        console.error('Storage upload error:', error)
        throw new Error('Failed to upload image')
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
        .from('book-covers')
        .getPublicUrl(data.path)
    
    return urlData.publicUrl
}

export async function createBook(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') throw new Error('Unauthorized')

    const formats = JSON.parse(formData.get('formats') as string || '[]')
    const genres = JSON.parse(formData.get('genres') as string || '[]')
    const mood = JSON.parse(formData.get('mood') as string || '[]')

    // Handle cover image - either from camera capture or URL
    let coverUrl = formData.get('cover_url') as string || ''
    const capturedImage = formData.get('captured_image') as string
    
    if (capturedImage) {
        // Upload captured image to storage
        coverUrl = await uploadCapturedImage(supabase, capturedImage)
    }

    const badgeTypeValue = formData.get('badge_type') as string
    const book = {
        title: formData.get('title') as string,
        author: formData.get('author') as string,
        description: formData.get('description') as string || '',
        excerpt: formData.get('excerpt') as string || '',
        cover_url: coverUrl,
        price_hardcover: parseFloat(formData.get('price_hardcover') as string) || null,
        price_paperback: parseFloat(formData.get('price_paperback') as string) || null,
        price_ebook: parseFloat(formData.get('price_ebook') as string) || null,
        price_audiobook: parseFloat(formData.get('price_audiobook') as string) || null,
        formats,
        genres,
        mood,
        publisher: formData.get('publisher') as string || '',
        pages: parseInt(formData.get('pages') as string) || null,
        isbn: formData.get('isbn') as string || '',
        is_bestseller: formData.get('is_bestseller') === 'true',
        is_new: formData.get('is_new') === 'true',
        badge_type: badgeTypeValue && badgeTypeValue.trim() !== '' ? badgeTypeValue : null,
    }

    const { error } = await supabase.from('books').insert(book)

    if (error) {
        console.error(error)
        throw new Error('Failed to create book')
    }

    revalidatePath('/admin')
    redirect('/admin')
}

export async function updateBook(id: string, formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') throw new Error('Unauthorized')

    const formats = JSON.parse(formData.get('formats') as string || '[]')
    const genres = JSON.parse(formData.get('genres') as string || '[]')
    const mood = JSON.parse(formData.get('mood') as string || '[]')

    // Handle cover image - either from camera capture or URL
    let coverUrl = formData.get('cover_url') as string || ''
    const capturedImage = formData.get('captured_image') as string
    
    if (capturedImage) {
        // Upload captured image to storage
        coverUrl = await uploadCapturedImage(supabase, capturedImage)
    }

    const badgeTypeValue = formData.get('badge_type') as string
    const updates = {
        title: formData.get('title') as string,
        author: formData.get('author') as string,
        description: formData.get('description') as string || '',
        excerpt: formData.get('excerpt') as string || '',
        cover_url: coverUrl,
        price_hardcover: parseFloat(formData.get('price_hardcover') as string) || null,
        price_paperback: parseFloat(formData.get('price_paperback') as string) || null,
        price_ebook: parseFloat(formData.get('price_ebook') as string) || null,
        price_audiobook: parseFloat(formData.get('price_audiobook') as string) || null,
        formats,
        genres,
        mood,
        publisher: formData.get('publisher') as string || '',
        pages: parseInt(formData.get('pages') as string) || null,
        isbn: formData.get('isbn') as string || '',
        is_bestseller: formData.get('is_bestseller') === 'true',
        is_new: formData.get('is_new') === 'true',
        badge_type: badgeTypeValue && badgeTypeValue.trim() !== '' ? badgeTypeValue : null,
    }

    const { error } = await supabase.from('books').update(updates).eq('id', id)

    if (error) {
        console.error(error)
        throw new Error('Failed to update book')
    }

    revalidatePath('/admin')
    revalidatePath(`/books/${id}`)
    return { success: true }
}
