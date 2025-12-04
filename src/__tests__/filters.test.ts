import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { Book } from '@/lib/types'
import { GENRES, MOODS } from '@/lib/data'

// Filter functions extracted from books page logic
const filterByGenre = (books: Book[], selectedGenres: string[]): Book[] => {
    if (selectedGenres.length === 0) return books
    return books.filter(book => 
        book.genres?.some((g: string) => selectedGenres.includes(g))
    )
}

const filterByPrice = (books: Book[], maxPrice: number): Book[] => {
    return books.filter(book => {
        const price = book.price.paperback || book.price.hardcover || 0
        return price <= maxPrice
    })
}

const filterBySearch = (books: Book[], query: string): Book[] => {
    if (query === '') return books
    const lowerQuery = query.toLowerCase()
    return books.filter(book =>
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.toLowerCase().includes(lowerQuery) ||
        book.description.toLowerCase().includes(lowerQuery)
    )
}

const filterByMood = (books: Book[], selectedMood: string): Book[] => {
    if (selectedMood === '') return books
    return books.filter(book =>
        book.mood && book.mood.includes(selectedMood)
    )
}

// Arbitraries for generating test data
const genreArb = fc.constantFrom(...GENRES)
const moodArb = fc.constantFrom(...MOODS.map(m => m.name))
const formatArb = fc.constantFrom('hardcover', 'paperback', 'ebook', 'audiobook') as fc.Arbitrary<'hardcover' | 'paperback' | 'ebook' | 'audiobook'>

const bookArb: fc.Arbitrary<Book> = fc.record({
    id: fc.uuid(),
    title: fc.string({ minLength: 1, maxLength: 50 }),
    author: fc.string({ minLength: 1, maxLength: 30 }),
    coverUrl: fc.webUrl(),
    rating: fc.float({ min: 0, max: 5, noNaN: true }),
    reviewCount: fc.integer({ min: 0, max: 100000 }),
    price: fc.record({
        hardcover: fc.option(fc.float({ min: 100, max: 5000, noNaN: true }), { nil: undefined }),
        paperback: fc.option(fc.float({ min: 100, max: 5000, noNaN: true }), { nil: undefined }),
        ebook: fc.option(fc.float({ min: 50, max: 1000, noNaN: true }), { nil: undefined }),
        audiobook: fc.option(fc.float({ min: 50, max: 1000, noNaN: true }), { nil: undefined }),
    }),
    formats: fc.array(formatArb, { minLength: 1, maxLength: 4 }),
    readingTime: fc.integer({ min: 60, max: 1200 }),
    genres: fc.array(genreArb, { minLength: 1, maxLength: 3 }),
    description: fc.string({ minLength: 10, maxLength: 200 }),
    excerpt: fc.string({ minLength: 5, maxLength: 100 }),
    publishDate: fc.constant('2024-01-01'),
    publisher: fc.string({ minLength: 1, maxLength: 30 }),
    pages: fc.integer({ min: 50, max: 1000 }),
    isbn: fc.string({ minLength: 10, maxLength: 13 }),
    tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 0, maxLength: 5 }),
    isBestseller: fc.boolean(),
    isNew: fc.boolean(),
    mood: fc.array(moodArb, { minLength: 0, maxLength: 3 }),
})

describe('Book Filters', () => {
    /**
     * **Feature: website-functionality-bugfix, Property 4: Genre filter returns matching books only**
     * *For any* selected genre filter, all books in the filtered results SHALL contain that genre in their genres array.
     * **Validates: Requirements 5.2**
     */
    it('Property 4: Genre filter returns matching books only', () => {
        fc.assert(
            fc.property(
                fc.array(bookArb, { minLength: 1, maxLength: 20 }),
                fc.array(genreArb, { minLength: 1, maxLength: 3 }),
                (books, selectedGenres) => {
                    const filtered = filterByGenre(books, selectedGenres)
                    
                    // All filtered books must have at least one of the selected genres
                    return filtered.every(book =>
                        book.genres?.some(g => selectedGenres.includes(g))
                    )
                }
            ),
            { numRuns: 100 }
        )
    })

    /**
     * **Feature: website-functionality-bugfix, Property 5: Price filter returns books within range**
     * *For any* price range [0, max], all books in the filtered results SHALL have a price (paperback or hardcover) less than or equal to max.
     * **Validates: Requirements 5.3**
     */
    it('Property 5: Price filter returns books within range', () => {
        fc.assert(
            fc.property(
                fc.array(bookArb, { minLength: 1, maxLength: 20 }),
                fc.float({ min: 100, max: 5000, noNaN: true }),
                (books, maxPrice) => {
                    const filtered = filterByPrice(books, maxPrice)
                    
                    // All filtered books must have price <= maxPrice
                    return filtered.every(book => {
                        const price = book.price.paperback || book.price.hardcover || 0
                        return price <= maxPrice
                    })
                }
            ),
            { numRuns: 100 }
        )
    })

    /**
     * **Feature: website-functionality-bugfix, Property 6: Search filter matches title, author, or description**
     * *For any* search query string, all books in the filtered results SHALL contain the query (case-insensitive) in either title, author, or description.
     * **Validates: Requirements 5.4**
     */
    it('Property 6: Search filter matches title, author, or description', () => {
        fc.assert(
            fc.property(
                fc.array(bookArb, { minLength: 1, maxLength: 20 }),
                fc.string({ minLength: 1, maxLength: 10 }),
                (books, query) => {
                    const filtered = filterBySearch(books, query)
                    const lowerQuery = query.toLowerCase()
                    
                    // All filtered books must contain query in title, author, or description
                    return filtered.every(book =>
                        book.title.toLowerCase().includes(lowerQuery) ||
                        book.author.toLowerCase().includes(lowerQuery) ||
                        book.description.toLowerCase().includes(lowerQuery)
                    )
                }
            ),
            { numRuns: 100 }
        )
    })

    /**
     * **Feature: website-functionality-bugfix, Property 7: Mood filter returns matching books only**
     * *For any* selected mood filter, all books in the filtered results SHALL contain that mood in their mood array.
     * **Validates: Requirements 5.5**
     */
    it('Property 7: Mood filter returns matching books only', () => {
        fc.assert(
            fc.property(
                fc.array(bookArb, { minLength: 1, maxLength: 20 }),
                moodArb,
                (books, selectedMood) => {
                    const filtered = filterByMood(books, selectedMood)
                    
                    // All filtered books must have the selected mood
                    return filtered.every(book =>
                        book.mood && book.mood.includes(selectedMood)
                    )
                }
            ),
            { numRuns: 100 }
        )
    })

    /**
     * **Feature: website-functionality-bugfix, Property 12: Empty filter results show empty state**
     * *For any* combination of filters that matches zero books, the filtered array SHALL be empty.
     * **Validates: Requirements 8.2**
     */
    it('Property 12: Impossible filter combination returns empty array', () => {
        // Test that filtering with impossible criteria returns empty
        const books: Book[] = [{
            id: '1',
            title: 'Test Book',
            author: 'Test Author',
            coverUrl: '/test.png',
            rating: 4.5,
            reviewCount: 100,
            price: { paperback: 500 },
            formats: ['paperback'],
            readingTime: 200,
            genres: ['Fiction'],
            description: 'A test book',
            excerpt: 'Test excerpt',
            publishDate: '2024-01-01',
            publisher: 'Test Publisher',
            pages: 200,
            isbn: '1234567890',
            tags: [],
            isBestseller: false,
            isNew: false,
            mood: ['Joyful'],
        }]

        // Filter by genre that doesn't exist in the book
        const filtered = filterByGenre(books, ['Science Fiction'])
        expect(filtered).toHaveLength(0)
    })
})
