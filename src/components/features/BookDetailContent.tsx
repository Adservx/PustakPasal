"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Star,
    Heart,
    Share2,
    BookOpen,
    Clock,
    ShoppingCart,
    Check,
    ArrowRight,
    Truck,
    Shield,
    RotateCcw,
    Gift,
    Percent,
    LucideIcon,
} from "lucide-react"
import { AnimatedBookCard } from "@/components/features/AnimatedBookCard"
import { useCartStore } from "@/store/cart-store"
import { useWishlistStore } from "@/store/wishlist-store"
import Link from "next/link"
import Image from "next/image"
import { Book } from "@/lib/types"
import { Reviews } from "./Reviews"
import { getTrustBadges, TrustBadge } from "@/lib/site-settings"
import { BuyNowModal } from "./BuyNowModal"
import { toast } from "sonner"

const iconMap: Record<string, LucideIcon> = {
    'truck': Truck,
    'shield': Shield,
    'rotate-ccw': RotateCcw,
    'clock': Clock,
    'gift': Gift,
    'percent': Percent,
}

const colorMap: Record<string, string> = {
    'emerald': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600',
    'blue': 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
    'purple': 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
    'amber': 'bg-amber-100 dark:bg-amber-900/30 text-amber-600',
    'rose': 'bg-rose-100 dark:bg-rose-900/30 text-rose-600',
    'cyan': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600',
}

export function BookDetailContent({ book, relatedBooks }: { book: Book; relatedBooks: Book[] }) {
    const [selectedFormat, setSelectedFormat] = useState<string>(book.formats?.[0] || "paperback")
    const [trustBadges, setTrustBadges] = useState<TrustBadge[]>([])
    const [showBuyNowModal, setShowBuyNowModal] = useState(false)
    const { addItem } = useCartStore()
    const { toggleWishlist, isInWishlist } = useWishlistStore()

    useEffect(() => {
        getTrustBadges().then(setTrustBadges)
    }, [])

    const handleAddToCart = () => {
        addItem({
            bookId: book.id,
            format: selectedFormat as any,
            quantity: 1,
            price: book.price[selectedFormat as keyof typeof book.price] || 0,
        })
        toast.success("Added to cart!", {
            description: `${book.title} (${selectedFormat}) added to your cart`,
        })
    }

    const handleBuyNow = () => {
        setShowBuyNowModal(true)
    }

    const getPrice = (format: string) => book.price[format as keyof typeof book.price]

    return (
        <div className="min-h-screen bg-gradient-to-b from-secondary/20 to-background">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-secondary/40 to-transparent pt-20 sm:pt-24 pb-8">
                <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/books" className="hover:text-foreground transition-colors">Books</Link>
                        <span>/</span>
                        <span className="text-foreground truncate max-w-[200px]">{book.title}</span>
                    </nav>

                    {/* Main Product Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left - Book Cover */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col items-center lg:sticky lg:top-24 lg:self-start"
                        >
                            <div className="relative group">
                                {/* Main Cover */}
                                <div className="relative w-64 sm:w-72 md:w-80 aspect-[2/3] rounded-2xl shadow-2xl overflow-hidden bg-secondary">
                                    <Image
                                        src={book.coverUrl}
                                        alt={book.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        priority
                                    />
                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                
                                {/* Badges */}
                                <div className="absolute top-3 left-3 flex flex-col gap-2">
                                    {book.isBestseller && (
                                        <Badge className="bg-amber-500 text-white shadow-lg">
                                            ⭐ Bestseller
                                        </Badge>
                                    )}
                                    {book.isNew && (
                                        <Badge className="bg-emerald-500 text-white shadow-lg">
                                            ✨ New Release
                                        </Badge>
                                    )}
                                </div>

                                {/* Quick Actions */}
                                <div className="absolute top-3 right-3 flex flex-col gap-2">
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-10 w-10 rounded-full shadow-lg bg-white/90 hover:bg-white"
                                        onClick={() => toggleWishlist(book.id)}
                                    >
                                        <Heart className={`h-5 w-5 ${isInWishlist(book.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-10 w-10 rounded-full shadow-lg bg-white/90 hover:bg-white"
                                    >
                                        <Share2 className="h-5 w-5 text-gray-600" />
                                    </Button>
                                </div>
                            </div>

                            {/* Reading Time Badge */}
                            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground bg-background/80 backdrop-blur px-4 py-2 rounded-full">
                                <Clock className="h-4 w-4" />
                                <span>{Math.floor(book.readingTime / 60)}h {book.readingTime % 60}m read</span>
                            </div>
                        </motion.div>

                        {/* Right - Book Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-6"
                        >
                        {/* Title & Author */}
                            <div>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold tracking-tight mb-3">
                                    {book.title}
                                </h1>
                                <p className="text-lg text-muted-foreground">
                                    by <Link href="#" className="text-foreground font-medium hover:text-primary transition-colors">{book.author}</Link>
                                </p>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            className={`h-5 w-5 ${i < Math.floor(book.rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} 
                                        />
                                    ))}
                                </div>
                                <span className="text-lg font-semibold">{book.rating}</span>
                                <span className="text-muted-foreground">({book.reviewCount?.toLocaleString()} reviews)</span>
                            </div>

                            {/* Price Section */}
                            <div className="bg-card rounded-2xl p-6 border shadow-sm space-y-4">
                                {/* Format Selection */}
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground mb-3 block">
                                        Choose Format
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {book.formats?.map((format: string) => (
                                            <button
                                                key={format}
                                                onClick={() => setSelectedFormat(format)}
                                                className={`relative p-3 rounded-xl border-2 transition-all text-left ${
                                                    selectedFormat === format
                                                        ? "border-primary bg-primary/5 shadow-sm"
                                                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                                                }`}
                                            >
                                                <span className="block text-sm font-medium capitalize">{format}</span>
                                                <span className="block text-lg font-bold mt-1">NRS {getPrice(format)}</span>
                                                {selectedFormat === format && (
                                                    <div className="absolute top-2 right-2">
                                                        <Check className="h-4 w-4 text-primary" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-2">
                                    <Button
                                        size="lg"
                                        className="flex-1 h-12 text-base font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-white"
                                        onClick={handleBuyNow}
                                    >
                                        Buy Now
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="flex-1 h-12 text-base font-semibold rounded-xl gap-2"
                                        onClick={handleAddToCart}
                                    >
                                        <ShoppingCart className="h-5 w-5" />
                                        Add to Cart
                                    </Button>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            {trustBadges.filter(b => b.enabled).length > 0 && (
                                <div className="grid grid-cols-3 gap-4 py-4">
                                    {trustBadges.filter(b => b.enabled).slice(0, 3).map((badge) => {
                                        const IconComponent = iconMap[badge.icon] || Truck
                                        const colorClass = colorMap[badge.color] || colorMap.emerald
                                        return (
                                            <div key={badge.id} className="flex flex-col items-center text-center gap-2">
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${colorClass}`}>
                                                    <IconComponent className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <span className="text-xs font-medium block">{badge.title}</span>
                                                    <span className="text-[10px] text-muted-foreground">{badge.description}</span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            {/* Short Description */}
                            <p className="text-muted-foreground leading-relaxed">
                                {book.description?.slice(0, 200)}...
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>


            {/* Details Section */}
            <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Synopsis */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-card rounded-2xl p-6 sm:p-8 border shadow-sm"
                        >
                            <h2 className="text-2xl font-serif font-semibold mb-4 flex items-center gap-2">
                                <BookOpen className="h-6 w-6 text-primary" />
                                About This Book
                            </h2>
                            <div className="prose prose-gray dark:prose-invert max-w-none">
                                <p className="text-muted-foreground leading-relaxed text-base">
                                    {book.description}
                                </p>
                                {book.excerpt && (
                                    <blockquote className="mt-6 pl-6 border-l-4 border-primary/30 italic text-muted-foreground bg-muted/30 py-4 pr-4 rounded-r-lg">
                                        "{book.excerpt}"
                                    </blockquote>
                                )}
                            </div>
                        </motion.section>

                        {/* Reviews */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <Reviews bookId={book.id} />
                        </motion.section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Book Details Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-card rounded-2xl p-6 border shadow-sm"
                        >
                            <h3 className="font-semibold mb-4 text-lg">Book Details</h3>
                            <dl className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-border/50">
                                    <dt className="text-muted-foreground">Publisher</dt>
                                    <dd className="font-medium text-right max-w-[150px] truncate">{book.publisher}</dd>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border/50">
                                    <dt className="text-muted-foreground">Published</dt>
                                    <dd className="font-medium">{book.publishDate}</dd>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border/50">
                                    <dt className="text-muted-foreground">Pages</dt>
                                    <dd className="font-medium">{book.pages} pages</dd>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border/50">
                                    <dt className="text-muted-foreground">Language</dt>
                                    <dd className="font-medium">Nepali</dd>
                                </div>
                                <div className="flex justify-between py-2">
                                    <dt className="text-muted-foreground">ISBN</dt>
                                    <dd className="font-medium text-xs">{book.isbn}</dd>
                                </div>
                            </dl>
                        </motion.div>

                        {/* Genres & Mood Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-card rounded-2xl p-6 border shadow-sm"
                        >
                            {/* Genres */}
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3 text-lg">Genres</h3>
                                <div className="flex flex-wrap gap-2">
                                    {book.genres?.map((genre: string) => (
                                        <Badge 
                                            key={genre} 
                                            variant="outline"
                                            className="rounded-full px-3 py-1"
                                        >
                                            {genre}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Mood */}
                            {book.mood && book.mood.length > 0 && (
                                <div className="pt-4 border-t border-border/50">
                                    <h3 className="font-semibold mb-3 text-lg">Reading Mood</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {book.mood.map((m: string) => (
                                            <Badge 
                                                key={m} 
                                                variant="secondary"
                                                className="rounded-full px-3 py-1"
                                            >
                                                {m}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Back to Books */}
                        <Link href="/books">
                            <Button variant="outline" className="w-full gap-2 rounded-xl">
                                Browse More Books
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Related Books */}
            {relatedBooks.length > 0 && (
                <div className="bg-secondary/30 py-12">
                    <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-serif font-semibold">You Might Also Like</h2>
                                <p className="text-muted-foreground mt-1">Discover similar books you'll love</p>
                            </div>
                            <Link href="/books">
                                <Button variant="ghost" className="gap-2">
                                    View All <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                            {relatedBooks.slice(0, 5).map((relatedBook, i) => (
                                <AnimatedBookCard key={relatedBook.id} book={relatedBook} index={i} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Buy Now Modal */}
            {showBuyNowModal && (
                <BuyNowModal
                    item={{
                        bookId: book.id,
                        title: book.title,
                        author: book.author,
                        coverUrl: book.coverUrl,
                        format: selectedFormat,
                        price: getPrice(selectedFormat) || 0,
                        quantity: 1,
                    }}
                    onClose={() => setShowBuyNowModal(false)}
                />
            )}
        </div>
    )
}
