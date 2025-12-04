import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EditBookClient } from './EditBookClient'

export const dynamic = 'force-dynamic'

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    // Check auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') {
        redirect('/admin')
    }

    const { data: book } = await supabase.from('books').select('*').eq('id', id).single()

    if (!book) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-32">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Book not found</h1>
                    <p className="text-muted-foreground">The book you're looking for doesn't exist.</p>
                </div>
            </div>
        )
    }

    return <EditBookClient book={book} bookId={id} />
}
