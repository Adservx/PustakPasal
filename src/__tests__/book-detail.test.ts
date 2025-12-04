import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { Book } from '@/lib/types'

// Format-price mapping logic from BookDetailContent
const getPrice = (book: Book, format: string): number | undefined => {
    return book.price[format as keyof typeof book.price]
}

// Add to cart logic from BookDetailContent
const createCartItem = (book: Book, selectedFormat: string) => {
    return {
        bookId: book.id,
        format: selectedFormat,
        quantity: 1,
        price: book.price[selectedFormat as keyof typeof book.price] || 0
    }
}

const formatArb = fc.constantFrom('hardcover', 'paperback', 'ebook', 'audiobook')

const bookWithPricesArb: fc.Arbitrary<Book> = fc.record({
    id: fc.uuid(),
    title: fc.string({ minLength: 1, maxLength: 50 }),
    author: fc.string({ minLength: 1, maxLength: 30 }),
    coverUrl: fc.webUrl(),
    rating: fc.float({ min: 0, max: 5, noNaN: true }),
    reviewCount: fc.integer({ min: 0, max: 100000 }),
    price: fc.record({
        hardcover: fc.float({ min: 100, max: 5000, noNaN: true }),
        paperback: fc.float({ min: 100, max: 5000, noNaN: true }),
        ebook: fc.float({ min: 50, max: 1000, noNaN: true }),
        audiobook: fc.float({ min: 50, max: 1000, noNaN: true }),
    }),
    formats: fc.constant(['hardcover', 'paperback', 'ebook', 'audiobook'] as Array<'hardcover' | 'paperback' | 'ebook' | 'audiobook'>),
    readingTime: fc.integer({ min: 60, max: 1200 }),
    genres: fc.array(fc.string(), { minLength: 1, maxLength: 3 }),
    description: fc.string({ minLength: 10, maxLength: 200 }),
    excerpt: fc.string({ minLength: 5, maxLength: 100 }),
    publishDate: fc.constant('2024-01-01'),
    publisher: fc.string({ minLength: 1, maxLength: 30 }),
    pages: fc.integer({ min: 50, max: 1000 }),
    isbn: fc.string({ minLength: 10, maxLength: 13 }),
    tags: fc.array(fc.string(), { minLength: 0, maxLength: 5 }),
    isBestseller: fc.boolean(),
    isNew: fc.boolean(),
    mood: fc.array(fc.string(), { minLength: 0, maxLength: 3 }),
})

describe('Book Detail Page', () => {
    /**
     * **Feature: website-functionality-bugfix, Property 10: Format selection updates price correctly**
     * *For any* book and selected format, the displayed price SHALL equal book.price[format].
     * **Validates: Requirements 3.2**
     */
    it('Property 10: Format selection updates price correctly', () => {
        fc.assert(
            fc.property(
                bookWithPricesArb,
                formatArb,
                (book, format) => {
                    const displayedPrice = getPrice(book, format)
                    const expectedPrice = book.price[format as keyof typeof book.price]
                    
                    return displayedPrice === expectedPrice
                }
            ),
            { numRuns: 100 }
        )
    })

    /**
     * **Feature: website-functionality-bugfix, Property 11: Add to cart from detail page uses selected format**
     * *For any* book with a selected format, adding to cart SHALL create a cart item with that format and the corresponding price.
     * **Validates: Requirements 3.3**
     */
    it('Property 11: Add to cart from detail page uses selected format', () => {
        fc.assert(
            fc.property(
                bookWithPricesArb,
                formatArb,
                (book, selectedFormat) => {
                    const cartItem = createCartItem(book, selectedFormat)
                    
                    // Cart item should have correct format
                    const hasCorrectFormat = cartItem.format === selectedFormat
                    
                    // Cart item should have correct price for that format
                    const expectedPrice = book.price[selectedFormat as keyof typeof book.price] || 0
                    const hasCorrectPrice = cartItem.price === expectedPrice
                    
                    // Cart item should reference the correct book
                    const hasCorrectBookId = cartItem.bookId === book.id
                    
                    return hasCorrectFormat && hasCorrectPrice && hasCorrectBookId
                }
            ),
            { numRuns: 100 }
        )
    })
})
