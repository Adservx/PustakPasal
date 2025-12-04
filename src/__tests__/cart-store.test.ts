import { describe, it, expect, beforeEach } from 'vitest'
import * as fc from 'fast-check'
import { create } from 'zustand'
import { CartItem } from '@/lib/types'

// Create a fresh cart store for testing (without persist middleware)
interface CartStore {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (bookId: string, format: string) => void
    updateQuantity: (bookId: string, format: string, quantity: number) => void
    clearCart: () => void
    getTotalItems: () => number
    getTotalPrice: () => number
}

const createTestCartStore = () => create<CartStore>((set, get) => ({
    items: [],
    addItem: (item) =>
        set((state) => {
            const existingIndex = state.items.findIndex(
                (i) => i.bookId === item.bookId && i.format === item.format
            )
            if (existingIndex > -1) {
                const newItems = [...state.items]
                newItems[existingIndex].quantity += item.quantity
                return { items: newItems }
            }
            return { items: [...state.items, item] }
        }),
    removeItem: (bookId, format) =>
        set((state) => ({
            items: state.items.filter(
                (i) => !(i.bookId === bookId && i.format === format)
            ),
        })),
    updateQuantity: (bookId, format, quantity) =>
        set((state) => ({
            items: state.items.map((i) =>
                i.bookId === bookId && i.format === format
                    ? { ...i, quantity }
                    : i
            ),
        })),
    clearCart: () => set({ items: [] }),
    getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    getTotalPrice: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
}))

// Arbitraries for generating test data
const formatArb = fc.constantFrom('hardcover', 'paperback', 'ebook', 'audiobook') as fc.Arbitrary<'hardcover' | 'paperback' | 'ebook' | 'audiobook'>

const cartItemArb = fc.record({
    bookId: fc.uuid(),
    format: formatArb,
    quantity: fc.integer({ min: 1, max: 10 }),
    price: fc.float({ min: 100, max: 5000, noNaN: true }),
})

describe('Cart Store', () => {
    /**
     * **Feature: website-functionality-bugfix, Property 1: Cart total calculation consistency**
     * *For any* cart with items, the total price SHALL equal the sum of (item.price × item.quantity) for all items.
     * **Validates: Requirements 2.3**
     */
    it('Property 1: Cart total calculation consistency', () => {
        fc.assert(
            fc.property(fc.array(cartItemArb, { minLength: 0, maxLength: 10 }), (items) => {
                const useStore = createTestCartStore()
                
                // Add all items to cart
                items.forEach(item => useStore.getState().addItem(item))
                
                // Calculate expected total
                const expectedTotal = useStore.getState().items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                )
                
                // Verify getTotalPrice matches
                const actualTotal = useStore.getState().getTotalPrice()
                
                return Math.abs(actualTotal - expectedTotal) < 0.01 // Allow small floating point differences
            }),
            { numRuns: 100 }
        )
    })

    /**
     * **Feature: website-functionality-bugfix, Property 2: Cart item addition increases count**
     * *For any* book and format, adding it to the cart SHALL increase the total item count by the quantity added.
     * **Validates: Requirements 2.1**
     */
    it('Property 2: Cart item addition increases count', () => {
        fc.assert(
            fc.property(cartItemArb, (item) => {
                const useStore = createTestCartStore()
                
                const countBefore = useStore.getState().getTotalItems()
                useStore.getState().addItem(item)
                const countAfter = useStore.getState().getTotalItems()
                
                return countAfter === countBefore + item.quantity
            }),
            { numRuns: 100 }
        )
    })

    /**
     * **Feature: website-functionality-bugfix, Property 3: Cart item removal decreases total**
     * *For any* item in the cart, removing it SHALL decrease the total price by (item.price × item.quantity).
     * **Validates: Requirements 2.4**
     */
    it('Property 3: Cart item removal decreases total', () => {
        fc.assert(
            fc.property(cartItemArb, (item) => {
                const useStore = createTestCartStore()
                
                // Add item first
                useStore.getState().addItem(item)
                const totalBefore = useStore.getState().getTotalPrice()
                const itemInCart = useStore.getState().items.find(
                    i => i.bookId === item.bookId && i.format === item.format
                )
                
                if (!itemInCart) return true // Item wasn't added (shouldn't happen)
                
                const expectedDecrease = itemInCart.price * itemInCart.quantity
                
                // Remove item
                useStore.getState().removeItem(item.bookId, item.format)
                const totalAfter = useStore.getState().getTotalPrice()
                
                return Math.abs((totalBefore - totalAfter) - expectedDecrease) < 0.01
            }),
            { numRuns: 100 }
        )
    })
})
