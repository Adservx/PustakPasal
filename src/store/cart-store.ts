import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/lib/types';

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (bookId: string, format: string) => void;
    updateQuantity: (bookId: string, format: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) =>
                set((state) => {
                    const existingIndex = state.items.findIndex(
                        (i) => i.bookId === item.bookId && i.format === item.format
                    );
                    if (existingIndex > -1) {
                        const newItems = [...state.items];
                        newItems[existingIndex].quantity += item.quantity;
                        return { items: newItems };
                    }
                    return { items: [...state.items, item] };
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
        }),
        {
            name: 'cart-storage',
        }
    )
);
