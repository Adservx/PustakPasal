import { createClient } from "@/lib/supabase/server"
import { BookDetailContent } from "@/components/features/BookDetailContent"
import { notFound } from "next/navigation"
import { mapBookData } from "@/lib/supabase/books"

export const dynamic = 'force-dynamic'

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: book } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single()

    if (!book) {
        notFound()
    }

    const { data: relatedBooks } = await supabase
        .from('books')
        .select('*')
        .neq('id', id)
        .limit(5)

    const mappedBook = mapBookData(book)
    const mappedRelatedBooks = (relatedBooks || []).map(mapBookData)

    return <BookDetailContent book={mappedBook} relatedBooks={mappedRelatedBooks} />
}
