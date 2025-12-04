import { createClient } from '@/lib/supabase/server';
import { MOCK_BOOKS } from '@/lib/data';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = await createClient();

    const books = MOCK_BOOKS.map(book => ({
        title: book.title,
        author: book.author,
        cover_url: book.coverUrl,
        rating: book.rating,
        review_count: book.reviewCount,
        price_hardcover: book.price.hardcover,
        price_paperback: book.price.paperback,
        price_ebook: book.price.ebook,
        price_audiobook: book.price.audiobook,
        formats: book.formats,
        reading_time: book.readingTime,
        genres: book.genres,
        description: book.description,
        excerpt: book.excerpt,
        publish_date: book.publishDate,
        publisher: book.publisher,
        pages: book.pages,
        isbn: book.isbn,
        tags: book.tags,
        is_bestseller: book.isBestseller,
        is_new: book.isNew,
        mood: book.mood
    }));

    const { error } = await supabase.from('books').insert(books);

    if (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: books.length });
}
