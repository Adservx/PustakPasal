import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
    bookIds: string[];
    addToWishlist: (bookId: string) => void;
    removeFromWishlist: (bookId: string) => void;
    isInWishlist: (bookId: string) => boolean;
    toggleWishlist: (bookId: string) => void;
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
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
        }),
        {
            name: 'wishlist-storage',
        }
    )
);
