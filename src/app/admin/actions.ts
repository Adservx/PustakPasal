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

export async function createBook(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') throw new Error('Unauthorized')

    const formats = JSON.parse(formData.get('formats') as string || '[]')
    const genres = JSON.parse(formData.get('genres') as string || '[]')
    const mood = JSON.parse(formData.get('mood') as string || '[]')

    const book = {
        title: formData.get('title') as string,
        author: formData.get('author') as string,
        description: formData.get('description') as string || '',
        excerpt: formData.get('excerpt') as string || '',
        cover_url: formData.get('cover_url') as string || '',
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

    const updates = {
        title: formData.get('title') as string,
        author: formData.get('author') as string,
        description: formData.get('description') as string || '',
        excerpt: formData.get('excerpt') as string || '',
        cover_url: formData.get('cover_url') as string || '',
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
        updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('books').update(updates).eq('id', id)

    if (error) {
        console.error(error)
        throw new Error('Failed to update book')
    }

    revalidatePath('/admin')
    redirect('/admin')
}
