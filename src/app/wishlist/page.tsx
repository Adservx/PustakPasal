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
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pt-40 pb-16">
            <div className="container px-4 md:px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Heart className="h-8 w-8 text-primary fill-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
                        My Wishlist
                    </h1>
                    <p className="text-muted-foreground text-lg">
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
                        className="text-center py-20"
                    >
                        <div className="max-w-md mx-auto space-y-6">
                            <div className="w-32 h-32 mx-auto rounded-full bg-muted flex items-center justify-center">
                                <Heart className="h-16 w-16 text-muted-foreground/40" />
                            </div>
                            <h3 className="text-2xl font-bold">No Books Yet</h3>
                            <p className="text-muted-foreground">
                                Explore our collection and add your favorite books to your wishlist!
                            </p>
                            <Button
                                size="lg"
                                className="gap-2"
                                onClick={() => router.push('/books')}
                            >
                                <ShoppingBag className="h-5 w-5" />
                                Browse Books
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
