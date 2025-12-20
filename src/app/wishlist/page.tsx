"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useWishlistStore } from "@/store/wishlist-store"
import { AnimatedBookCard } from "@/components/features/AnimatedBookCard"
import { Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getBooks } from "@/lib/supabase/books"
import { Book } from "@/lib/types"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function WishlistPage() {
    const router = useRouter()
    const { bookIds } = useWishlistStore()
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchBooks() {
            const allBooks = await getBooks()
            setBooks(allBooks)
            setLoading(false)
        }
        fetchBooks()
    }, [])

    const wishlistedBooks = books.filter(book => bookIds.includes(book.id))

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-40">
                <LoadingSpinner size="xl" text="Loading your wishlist..." />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pt-24 sm:pt-32 md:pt-40 pb-12 sm:pb-16">
            <div className="container px-3 sm:px-4 md:px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8 sm:mb-10 md:mb-12"
                >
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary/10 mb-3 sm:mb-4">
                        <Heart className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary fill-primary" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-serif mb-2 sm:mb-3 md:mb-4">
                        My Wishlist
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-2">
                        {wishlistedBooks.length === 0
                            ? "Your wishlist is empty. Start adding books you love!"
                            : `You have ${wishlistedBooks.length} ${wishlistedBooks.length === 1 ? 'book' : 'books'} in your wishlist`
                        }
                    </p>
                </motion.div>

                {/* Wishlist Content */}
                {wishlistedBooks.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center py-12 sm:py-16 md:py-20"
                    >
                        <div className="max-w-md mx-auto space-y-4 sm:space-y-5 md:space-y-6 px-4">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto rounded-full bg-muted flex items-center justify-center">
                                <Heart className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-muted-foreground/40" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold">No Books Yet</h3>
                            <p className="text-sm sm:text-base text-muted-foreground">
                                Explore our collection and add your favorite books to your wishlist!
                            </p>
                            <Button
                                size="lg"
                                className="gap-2 h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base rounded-full"
                                onClick={() => router.push('/books')}
                            >
                                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                                Browse Books
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                        <AnimatePresence mode="popLayout">
                            {wishlistedBooks.map((book, i) => (
                                <motion.div
                                    key={book.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ delay: i * 0.05 }}
                                    layout
                                >
                                    <AnimatedBookCard book={book} index={i} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    )
}
