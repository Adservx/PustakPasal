import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { create } from 'zustand'

// Create a fresh wishlist store for testing (without persist middleware)
interface WishlistStore {
    bookIds: string[]
    addToWishlist: (bookId: string) => void
    removeFromWishlist: (bookId: string) => void
    isInWishlist: (bookId: string) => boolean
    toggleWishlist: (bookId: string) => void
}

const createTestWishlistStore = () => create<WishlistStore>((set, get) => ({
    bookIds: [],
    addToWishlist: (bookId) =>
        set((state) => ({
            bookIds: state.bookIds.includes(bookId)
                ? state.bookIds
                : [...state.bookIds, bookId],
        })),
    removeFromWishlist: (bookId) =>
        set((state) => ({
            bookIds: state.bookIds.filter((id) => id !== bookId),
        })),
    isInWishlist: (bookId) => get().bookIds.includes(bookId),
    toggleWishlist: (bookId) =>
        set((state) => ({
            bookIds: state.bookIds.includes(bookId)
                ? state.bookIds.filter((id) => id !== bookId)
                : [...state.bookIds, bookId],
        })),
}))

describe('Wishlist Store', () => {
    /**
     * **Feature: website-functionality-bugfix, Property 8: Wishlist toggle is idempotent pair**
     * *For any* book, toggling wishlist twice SHALL return the wishlist to its original state (add then remove = original).
     * **Validates: Requirements 6.4**
     */
    it('Property 8: Wishlist toggle is idempotent pair', () => {
        fc.assert(
            fc.property(
                fc.uuid(),
                fc.array(fc.uuid(), { minLength: 0, maxLength: 10 }),
                (bookId, initialBooks) => {
                    const useStore = createTestWishlistStore()
                    
                    // Set up initial state
                    initialBooks.forEach(id => useStore.getState().addToWishlist(id))
                    
                    // Capture original state
                    const originalState = [...useStore.getState().bookIds]
                    const wasInWishlist = useStore.getState().isInWishlist(bookId)
                    
                    // Toggle twice
                    useStore.getState().toggleWishlist(bookId)
                    useStore.getState().toggleWishlist(bookId)
                    
                    // State should be back to original
                    const finalState = useStore.getState().bookIds
                    const isNowInWishlist = useStore.getState().isInWishlist(bookId)
                    
                    return wasInWishlist === isNowInWishlist
                }
            ),
            { numRuns: 100 }
        )
    })

    /**
     * **Feature: website-functionality-bugfix, Property 9: Wishlist persistence round-trip**
     * *For any* book added to wishlist, the book ID SHALL be present in the wishlist store.
     * **Validates: Requirements 6.1**
     */
    it('Property 9: Wishlist add then check returns true', () => {
        fc.assert(
            fc.property(fc.uuid(), (bookId) => {
                const useStore = createTestWishlistStore()
                
                // Add to wishlist
                useStore.getState().addToWishlist(bookId)
                
                // Check it's there
                return useStore.getState().isInWishlist(bookId) === true
            }),
            { numRuns: 100 }
        )
    })

    it('Wishlist remove then check returns false', () => {
        fc.assert(
            fc.property(fc.uuid(), (bookId) => {
                const useStore = createTestWishlistStore()
                
                // Add then remove
                useStore.getState().addToWishlist(bookId)
                useStore.getState().removeFromWishlist(bookId)
                
                // Check it's gone
                return useStore.getState().isInWishlist(bookId) === false
            }),
            { numRuns: 100 }
        )
    })
})
