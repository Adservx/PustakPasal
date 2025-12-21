"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/cart-store"
import { useState, useEffect } from "react"
import Image from "next/image"
import { getBooks } from "@/lib/supabase/books"
import { Book } from "@/lib/types"
import Link from "next/link"
import { createPortal } from "react-dom"
import { BuyNowModal } from "./BuyNowModal"

export function CartDrawer() {
    const [isOpen, setIsOpen] = useState(false)
    const [books, setBooks] = useState<Book[]>([])
    const [mounted, setMounted] = useState(false)
    const [buyNowItem, setBuyNowItem] = useState<any>(null)
    const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCartStore()

    useEffect(() => {
        setMounted(true)
        async function fetchBooks() {
            const allBooks = await getBooks()
            setBooks(allBooks)
        }
        fetchBooks()
    }, [])

    const totalItems = getTotalItems()

    const drawerContent = (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-[9999]"
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                        }}
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 h-[100dvh] w-full sm:w-[400px] md:w-[420px] bg-background z-[10000] shadow-2xl flex flex-col border-l border-border/50"
                        style={{ backgroundColor: "hsl(var(--background))" }}
                    >
                        <div className="p-4 sm:p-6 border-b border-border/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-serif font-medium">Your Bag</h2>
                                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                                        {totalItems} {totalItems === 1 ? "item" : "items"}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:bg-secondary/50"
                                >
                                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 p-4 sm:p-6 overflow-hidden">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary/50 flex items-center justify-center">
                                        <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground/50" />
                                    </div>
                                    <div className="space-y-1 sm:space-y-2">
                                        <h3 className="font-serif text-lg sm:text-xl font-medium">Your bag is empty</h3>
                                        <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
                                            Looks like you have not added any books yet.
                                        </p>
                                    </div>
                                    <Link href="/books" onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="rounded-full px-6 sm:px-8 text-sm">
                                            Start Browsing
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4 sm:space-y-5">
                                    {items.slice(0, 3).map((item, index) => {
                                        const book = books.find((b) => b.id === item.bookId)
                                        if (!book) return null
                                        return (
                                            <motion.div
                                                key={`${item.bookId}-${item.format}`}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-secondary/20 border border-border/30"
                                            >
                                                <div className="relative h-20 w-14 sm:h-24 sm:w-18 rounded-lg overflow-hidden shadow-sm border border-border/50 flex-shrink-0">
                                                    <Image src={book.coverUrl} alt={book.title} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between min-w-0">
                                                    <div className="space-y-0.5">
                                                        <div className="flex justify-between items-start gap-2">
                                                            <h3 className="font-serif font-bold text-sm sm:text-base line-clamp-1">{book.title}</h3>
                                                            <button onClick={() => removeItem(item.bookId, item.format)} className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
                                                                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                            </button>
                                                        </div>
                                                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{book.author}</p>
                                                        <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">{item.format}</p>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <div className="flex items-center gap-2 bg-secondary/50 rounded-full p-0.5 border border-border/50">
                                                            <button className="h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center rounded-full hover:bg-background transition-colors" onClick={() => item.quantity > 1 ? updateQuantity(item.bookId, item.format, item.quantity - 1) : removeItem(item.bookId, item.format)}>
                                                                <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                                            </button>
                                                            <span className="text-xs sm:text-sm font-medium w-4 text-center">{item.quantity}</span>
                                                            <button className="h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center rounded-full hover:bg-background transition-colors" onClick={() => updateQuantity(item.bookId, item.format, item.quantity + 1)}>
                                                                <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                                            </button>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setBuyNowItem({
                                                                        bookId: book.id,
                                                                        title: book.title,
                                                                        author: book.author,
                                                                        coverUrl: book.coverUrl,
                                                                        format: item.format,
                                                                        price: item.price,
                                                                        quantity: item.quantity,
                                                                    })
                                                                    setIsOpen(false)
                                                                }}
                                                                className="text-xs px-2 py-1 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors"
                                                            >
                                                                Buy
                                                            </button>
                                                            <span className="font-bold text-sm sm:text-base">Rs. {(item.price * item.quantity).toFixed(0)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                    {items.length > 3 && (
                                        <Link href="/cart" onClick={() => setIsOpen(false)} className="block text-center text-sm text-primary hover:underline py-2">
                                            +{items.length - 3} more item{items.length - 3 > 1 ? "s" : ""} in cart
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-4 sm:p-6 border-t border-border/50 space-y-4 sm:space-y-5">
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-medium">Rs. {getTotalPrice().toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span className="font-medium">Rs. 150</span>
                                    </div>
                                    <Separator className="bg-border/50" />
                                    <div className="flex justify-between font-serif font-bold text-lg sm:text-xl">
                                        <span>Total</span>
                                        <span className="text-primary">Rs. {(getTotalPrice() + 150).toFixed(0)}</span>
                                    </div>
                                </div>
                                <div className="space-y-2 sm:space-y-3">
                                    <Link href="/cart" onClick={() => setIsOpen(false)} className="block">
                                        <Button className="w-full h-10 sm:h-12 rounded-full text-sm sm:text-base shadow-lg shadow-primary/10 hover:scale-[1.02] transition-transform gap-2">
                                            Checkout <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" size="sm" className="w-full rounded-full hover:bg-secondary/50 text-muted-foreground hover:text-foreground text-xs sm:text-sm" onClick={clearCart}>
                                        Clear Bag
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
                className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-secondary/50"
                aria-label="Cart"
            >
                <ShoppingCart className="h-4 w-4" />
                {mounted && totalItems > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center"
                    >
                        {totalItems > 9 ? "9+" : totalItems}
                    </motion.span>
                )}
            </Button>

            {mounted && createPortal(drawerContent, document.body)}

            {/* Buy Now Modal */}
            {buyNowItem && (
                <BuyNowModal
                    item={buyNowItem}
                    onClose={() => setBuyNowItem(null)}
                />
            )}
        </>
    )
}
