import { Book } from '@/lib/types';

// Map of book titles to their local generated cover paths
const LOCAL_COVER_MAP: Record<string, string> = {
    'muna madan': '/books/muna-madan.png',
    'palpasa cafe': '/books/palpasa-cafe.png',
    'karnali blues': '/books/karnali-blues.png',
    'seto dharti': '/books/seto-dharti.png',
    'sirish ko phool': '/books/sirish-ko-phool.png',
    'china harayeko manche': '/books/china-harayeko-manche.png',
    'jiwan kada ki phool': '/books/jiwan-kada-ki-phool.png',
    'radha': '/books/radha.png',
    'summer love': '/books/summer-love.png',
    'pagal basti': '/books/pagal-basti.png',
    'pagalbasti': '/books/pagal-basti.png',
};

function getBookCoverUrl(title: string, remoteCoverUrl: string): string {
    const normalizedTitle = title.toLowerCase().trim();
    const localCover = LOCAL_COVER_MAP[normalizedTitle];
    return localCover || remoteCoverUrl;
}

export function mapBookData(book: any): Book {
    return {
        id: book.id,
        title: book.title,
        author: book.author,
        coverUrl: getBookCoverUrl(book.title, book.cover_url),
        rating: Number(book.rating),
        reviewCount: book.review_count,
        price: {
            hardcover: book.price_hardcover,
            paperback: book.price_paperback,
            ebook: book.price_ebook,
            audiobook: book.price_audiobook,
        },
        formats: book.formats,
        readingTime: book.reading_time,
        genres: book.genres,
        description: book.description,
        excerpt: book.excerpt,
        publishDate: book.publish_date,
        publisher: book.publisher,
        pages: book.pages,
        isbn: book.isbn,
        tags: book.tags,
        isBestseller: book.is_bestseller,
        isNew: book.is_new,
        mood: book.mood,
    };
}
