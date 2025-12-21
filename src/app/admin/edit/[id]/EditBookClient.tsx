'use client'

import { BookForm, BookFormData } from '@/components/features/BookForm'
import { updateBook } from '../../actions'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface EditBookClientProps {
    book: any
    bookId: string
}

export function EditBookClient({ book, bookId }: EditBookClientProps) {
    const router = useRouter()
    const [showSuccess, setShowSuccess] = useState(false)

    const initialData: Partial<BookFormData> = {
        title: book.title,
        author: book.author,
        description: book.description,
        excerpt: book.excerpt,
        cover_url: book.cover_url,
        price_hardcover: book.price_hardcover,
        price_paperback: book.price_paperback,
        price_ebook: book.price_ebook,
        price_audiobook: book.price_audiobook,
        formats: book.formats || [],
        genres: book.genres || [],
        publisher: book.publisher,
        pages: book.pages,
        isbn: book.isbn,
        is_bestseller: book.is_bestseller,
        is_new: book.is_new,
        badge_type: book.badge_type,
        mood: book.mood || [],
    }

    const handleSubmit = async (formData: FormData) => {
        try {
            const result = await updateBook(bookId, formData)
            if (result?.success) {
                setShowSuccess(true)
                // Wait for notification to show, then redirect
                setTimeout(() => {
                    router.push('/admin')
                    router.refresh()
                }, 1500)
            }
        } catch (error) {
            console.error('Update failed:', error)
        }
    }

    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-4">
            <div className="container mx-auto max-w-2xl">
                <Link href="/admin" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Link>
                <div className="glass-panel rounded-2xl p-6 md:p-8">
                    <h1 className="text-3xl font-serif font-bold mb-6">Edit Book</h1>
                    <BookForm 
                        mode="edit" 
                        initialData={initialData} 
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>

            {/* Success notification */}
            {showSuccess && (
                <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-bottom-4">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Book updated successfully!</span>
                </div>
            )}
        </div>
    )
}
