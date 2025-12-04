"use client"

import { useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, Heart, Share2, BookOpen, Clock, ShoppingCart, ArrowLeft, Check, ArrowRight } from "lucide-react"
import { AnimatedBookCard } from "@/components/features/AnimatedBookCard"
import { useCartStore } from "@/store/cart-store"
import { useWishlistStore } from "@/store/wishlist-store"
import Link from "next/link"
import Image from "next/image"
import { Book } from "@/lib/types"
import { Reviews } from "./Reviews"

export function BookDetailContent({ book, relatedBooks }: { book: Book, relatedBooks: Book[] }) {
    const [selectedFormat, setSelectedFormat] = useState<string>('hardcover')
    const { addItem } = useCartStore()
    const { toggleWishlist, isInWishlist } = useWishlistStore()
    const { scrollY } = useScroll()

    const y1 = useTransform(scrollY, [0, 500], [0, 200])
    const opacity = useTransform(scrollY, [0, 300], [1, 0])
    const scale = useTransform(scrollY, [0, 300], [1, 0.9])

    const handleAddToCart = () => {
        addItem({
            bookId: book.id,
            format: selectedFormat as any,
            quantity: 1,
            price: book.price[selectedFormat as keyof typeof book.price] || 0
        })
    }

    const getPrice = (format: string) => book.price[format as keyof typeof book.price]

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="relative h-[60vh] md:h-[70vh] overflow-hidden bg-secondary/20">
                <motion.div
                    style={{ y: y1, opacity }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background z-10" />
                    <div className="w-full h-full opacity-30 bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&h=900&fit=crop')] bg-cover bg-center blur-sm scale-110" />
                </motion.div>

                <div className="container relative z-20 h-full flex items-center px-4 md:px-6 pt-32">
                    <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[400px_1fr] gap-8 md:gap-16 items-center w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 50, rotateY: -15 }}
                            animate={{ opacity: 1, y: 0, rotateY: 0 }}
                            transition={{ type: "spring", duration: 1.5, bounce: 0.3 }}
                            style={{ scale }}
                            className="relative aspect-[2/3] rounded-xl shadow-2xl overflow-hidden hidden md:block border-4 border-white/10"
                        >
                            <Image
                                src={book.coverUrl}
                                alt={book.title}
                                fill
                                className="object-cover"
                                priority
                                unoptimized={book.coverUrl.includes('wikimedia.org') || book.coverUrl.includes('unsplash.com')}
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-50 pointer-events-none mix-blend-overlay" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="space-y-8 text-center md:text-left"
                        >
                            <Link href="/books" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors group">
                                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Collection
                            </Link>

                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    {book.isBestseller && <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20">Bestseller</Badge>}
                                    {book.isNew && <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20">New Release</Badge>}
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> {Math.floor(book.readingTime / 60)}h {book.readingTime % 60}m
                                    </Badge>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-medium font-serif tracking-tight leading-[0.9] text-balance">{book.title}</h1>
                                <p className="text-xl md:text-3xl text-muted-foreground font-light">
                                    by <span className="text-foreground font-medium">{book.author}</span>
                                </p>
                            </div>

                            <div className="flex items-center justify-center md:justify-start gap-4">
                                <div className="flex items-center text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`h-5 w-5 ${i < Math.floor(book.rating) ? "fill-current" : "text-muted/20"}`} />
                                    ))}
                                </div>
                                <span className="text-muted-foreground font-medium">{book.rating} <span className="text-muted-foreground/50 mx-2">•</span> {book.reviewCount?.toLocaleString()} reviews</span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                                <Button size="lg" className="h-14 px-10 text-lg gap-2 rounded-full shadow-xl shadow-primary/10 hover:scale-105 transition-all" onClick={handleAddToCart}>
                                    <ShoppingCart className="h-5 w-5" /> Add to Cart
                                </Button>
                                <Button size="lg" variant="outline" className="h-14 px-8 text-lg gap-2 rounded-full border-border/50 hover:bg-secondary/50" onClick={() => toggleWishlist(book.id)}>
                                    <Heart className={`h-5 w-5 ${isInWishlist(book.id) ? "fill-red-500 text-red-500" : ""}`} />
                                    {isInWishlist(book.id) ? "Saved" : "Save"}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="container px-4 md:px-6 -mt-20 relative z-30">
                <div className="grid lg:grid-cols-[1fr_400px] gap-12">
                    <div className="space-y-12">
                        <div className="md:hidden flex justify-center -mt-32 mb-8">
                            <div className="relative w-48 aspect-[2/3] rounded-xl shadow-2xl overflow-hidden border-4 border-white/10">
                                <Image
                                    src={book.coverUrl}
                                    alt={book.title}
                                    fill
                                    className="object-cover"
                                    unoptimized={book.coverUrl.includes('wikimedia.org') || book.coverUrl.includes('unsplash.com')}
                                />
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-sm border border-border/50"
                        >
                            <h2 className="text-3xl font-medium font-serif mb-6">Synopsis</h2>
                            <p className="text-lg leading-relaxed text-muted-foreground font-light">
                                {book.description}
                            </p>
                            <div className="mt-8 p-8 bg-secondary/30 rounded-2xl border-l-4 border-accent italic text-xl text-muted-foreground font-serif">
                                "{book.excerpt}"
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="grid sm:grid-cols-2 gap-6"
                        >
                            <div className="bg-card/50 backdrop-blur-sm p-8 rounded-3xl border border-border/50 shadow-sm">
                                <h3 className="font-semibold mb-6 flex items-center gap-2 text-lg">
                                    <BookOpen className="h-5 w-5 text-primary" /> Book Details
                                </h3>
                                <dl className="space-y-4 text-sm">
                                    <div className="flex justify-between py-2 border-b border-border/50">
                                        <dt className="text-muted-foreground">Publisher</dt>
                                        <dd className="font-medium">{book.publisher}</dd>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-border/50">
                                        <dt className="text-muted-foreground">Publish Date</dt>
                                        <dd className="font-medium">{book.publishDate}</dd>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-border/50">
                                        <dt className="text-muted-foreground">Pages</dt>
                                        <dd className="font-medium">{book.pages}</dd>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-border/50">
                                        <dt className="text-muted-foreground">ISBN</dt>
                                        <dd className="font-medium">{book.isbn}</dd>
                                    </div>
                                </dl>
                            </div>

                            <div className="bg-card/50 backdrop-blur-sm p-8 rounded-3xl border border-border/50 shadow-sm">
                                <h3 className="font-semibold mb-6 flex items-center gap-2 text-lg">
                                    <Check className="h-5 w-5 text-primary" /> Genres & Moods
                                </h3>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {book.genres?.map((g: string) => (
                                        <Badge key={g} variant="secondary" className="px-3 py-1">{g}</Badge>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {book.mood?.map((m: string) => (
                                        <Badge key={m} variant="outline" className="border-primary/20 text-primary px-3 py-1">{m}</Badge>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        <Reviews bookId={book.id} />

                    </div>

                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-card/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-border/50 sticky top-24"
                        >
                            <h3 className="font-medium font-serif text-2xl mb-6">Select Format</h3>
                            <div className="space-y-3">
                                {book.formats?.map((format: string) => (
                                    <div
                                        key={format}
                                        onClick={() => setSelectedFormat(format)}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center group ${selectedFormat === format
                                            ? "border-primary bg-primary/5"
                                            : "border-border/50 hover:border-primary/30 hover:bg-secondary/50"
                                            }`}
                                    >
                                        <div>
                                            <div className="font-bold capitalize text-lg">{format}</div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {format === 'audiobook' ? 'Instant Access' : 'Ships in 2 days'}
                                            </div>
                                        </div>
                                        <div className={`text-xl font-bold transition-colors ${selectedFormat === format ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                            ${getPrice(format)?.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-8 bg-border/50" />

                            <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-muted-foreground">Total</span>
                                    <span className="font-bold text-3xl font-serif">${getPrice(selectedFormat)?.toFixed(2)}</span>
                                </div>
                                <Button className="w-full h-14 text-lg rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform" onClick={handleAddToCart}>
                                    Add to Cart
                                </Button>
                                <Button variant="ghost" className="w-full rounded-full hover:bg-secondary/50">
                                    <Share2 className="mr-2 h-4 w-4" /> Share this book
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="mt-32">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-4xl font-medium font-serif">You might also like</h2>
                        <Button variant="link" className="gap-2 text-lg group">View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                        {relatedBooks.map((recBook, i) => (
                            <AnimatedBookCard key={recBook.id} book={recBook} index={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
