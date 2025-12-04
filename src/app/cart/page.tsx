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
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
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
        <div className="min-h-screen bg-background pt-40 pb-20">
            <div className="container px-4 md:px-6">
                <div className="mb-8">
                    <Link href="/books" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold">Shopping Cart</h1>
                    <p className="text-muted-foreground mt-2">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
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
                                        <CardContent className="p-6">
                                            <div className="flex gap-4">
                                                <div className="relative h-32 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
                                                    <Image
                                                        src={book.coverUrl}
                                                        alt={book.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <h3 className="font-bold font-serif text-lg line-clamp-1">{book.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{book.author}</p>
                                                    <p className="text-sm font-medium capitalize">
                                                        <span className="text-muted-foreground">Format:</span> {item.format}
                                                    </p>
                                                    <p className="text-lg font-bold text-primary">Rs. {item.price.toFixed(2)}</p>
                                                </div>
                                                <div className="flex flex-col items-end justify-between">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => removeItem(item.bookId, item.format)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-full"
                                                            onClick={() => updateQuantity(item.bookId, item.format, Math.max(1, item.quantity - 1))}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-full"
                                                            onClick={() => updateQuantity(item.bookId, item.format, item.quantity + 1)}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
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
                    <div className="space-y-6">
                        <Card className="glass-panel shadow-xl sticky top-24">
                            <CardHeader>
                                <CardTitle className="font-serif text-2xl">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
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
                                <div className="flex justify-between font-bold text-xl">
                                    <span>Total</span>
                                    <span className="text-primary">Rs. {total.toFixed(2)}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex-col gap-4">
                                <Button className="w-full h-12 text-base rounded-full shadow-lg" size="lg">
                                    Proceed to Checkout
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full rounded-full"
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
