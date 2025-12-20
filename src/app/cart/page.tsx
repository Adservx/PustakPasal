'use client'

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react"
import { useCartStore } from "@/store/cart-store"
import { useEffect, useState } from "react"
import { getBooks } from "@/lib/supabase/books"
import { Book } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function CartPage() {
    const { items, updateQuantity, removeItem, clearCart } = useCartStore()
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

    const getBookForItem = (bookId: string) => {
        return books.find(b => b.id === bookId)
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal > 0 ? 150 : 0 // Rs. 150 shipping
    const tax = subtotal * 0.13 // 13% VAT
    const total = subtotal + shipping + tax

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-40">
                <LoadingSpinner size="xl" text="Loading your cart..." />
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4 pt-40">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6 max-w-md"
                >
                    <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mx-auto">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-serif font-bold">Your cart is empty</h2>
                        <p className="text-muted-foreground">
                            Start adding some books to your collection
                        </p>
                    </div>
                    <Link href="/books">
                        <Button size="lg" className="gap-2 rounded-full">
                            <ArrowLeft className="h-5 w-5" /> Browse Books
                        </Button>
                    </Link>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pt-24 sm:pt-32 md:pt-40 pb-20 sm:pb-24">
            <div className="container px-3 sm:px-4 md:px-6">
                <div className="mb-6 sm:mb-8">
                    <Link href="/books" className="inline-flex items-center text-sm sm:text-base text-muted-foreground hover:text-foreground mb-3 sm:mb-4 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
                    </Link>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold">Shopping Cart</h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-3 sm:space-y-4 order-2 lg:order-1">
                        {items.map((item, index) => {
                            const book = getBookForItem(item.bookId)
                            if (!book) return null

                            return (
                                <motion.div
                                    key={`${item.bookId}-${item.format}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                        <CardContent className="p-3 sm:p-4 md:p-6">
                                            <div className="flex gap-3 sm:gap-4">
                                                <div className="relative h-24 w-16 sm:h-28 sm:w-20 md:h-32 md:w-24 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
                                                    <Image
                                                        src={book.coverUrl}
                                                        alt={book.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 flex flex-col min-w-0">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="font-bold font-serif text-sm sm:text-base md:text-lg line-clamp-2 sm:line-clamp-1">{book.title}</h3>
                                                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{book.author}</p>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 sm:h-9 sm:w-9 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                                                            onClick={() => removeItem(item.bookId, item.format)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <p className="text-xs sm:text-sm font-medium capitalize mt-1">
                                                        <span className="text-muted-foreground">Format:</span> {item.format}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-auto pt-2 sm:pt-3">
                                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                                                                onClick={() => updateQuantity(item.bookId, item.format, Math.max(1, item.quantity - 1))}
                                                            >
                                                                <Minus className="h-3 w-3" />
                                                            </Button>
                                                            <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium">{item.quantity}</span>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                                                                onClick={() => updateQuantity(item.bookId, item.format, item.quantity + 1)}
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                        <p className="text-sm sm:text-base md:text-lg font-bold text-primary">Rs. {item.price.toFixed(0)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
                        <Card className="glass-panel shadow-xl lg:sticky lg:top-24">
                            <CardHeader className="p-4 sm:p-6">
                                <CardTitle className="font-serif text-xl sm:text-2xl">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0 sm:pt-0">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-medium">Rs. {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="font-medium">Rs. {shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax (VAT 13%)</span>
                                    <span className="font-medium">Rs. {tax.toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg sm:text-xl">
                                    <span>Total</span>
                                    <span className="text-primary">Rs. {total.toFixed(2)}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex-col gap-2 sm:gap-3 md:gap-4 p-4 sm:p-6 pt-0 sm:pt-0">
                                <Button className="w-full h-11 sm:h-12 text-sm sm:text-base rounded-full shadow-lg" size="lg">
                                    Proceed to Checkout
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full h-10 sm:h-11 text-sm rounded-full"
                                    onClick={clearCart}
                                >
                                    Clear Cart
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
