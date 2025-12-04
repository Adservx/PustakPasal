'use client'

import { BookForm } from '@/components/features/BookForm'
import { createBook } from '../actions'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function AddBookPage() {
    const router = useRouter()

    const handleSubmit = async (formData: FormData) => {
        await createBook(formData)
        router.push('/admin')
    }

    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-4">
            <div className="container mx-auto max-w-2xl">
                <Link href="/admin" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Link>
                <div className="glass-panel rounded-2xl p-6 md:p-8">
                    <h1 className="text-3xl font-serif font-bold mb-6">Add New Book</h1>
                    <BookForm mode="create" onSubmit={handleSubmit} />
                </div>
            </div>
        </div>
    )
}
