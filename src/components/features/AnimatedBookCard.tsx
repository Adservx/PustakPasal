"use client"

import { memo, useState, useCallback } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Book } from "@/lib/types"
import { Star, Heart, ShoppingBag, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWishlistStore } from "@/store/wishlist-store"
import { useCartStore } from "@/store/cart-store"
import Link from "next/link"
import Image from "next/image"

// Helper to validate if a URL is properly formatted
function isValidImageUrl(url: string | undefined | null): boolean {
    if (!url) return false
    // Allow relative paths
    if (url.startsWith('/')) return true
    try {
        const parsedUrl = new URL(url)
        // Check if it has a valid hostname (not just "images" or similar)
        return parsedUrl.hostname.includes('.') || parsedUrl.hostname === 'localhost'
    } catch {
        return false
    }
}

interface AnimatedBookCardProps {
    book: Book
    index?: number
}

export const AnimatedBookCard = memo(function AnimatedBookCard({ book, index = 0 }: AnimatedBookCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [imageError, setImageError] = useState(false)
    const { toggleWishlist, isInWishlist } = useWishlistStore()
    const { addItem } = useCartStore()

    // Validate cover URL
    const hasValidCover = isValidImageUrl(book.coverUrl)

    // 3D Tilt Effect
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 })
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 })

    const onMouseMove = useCallback(({ currentTarget, clientX, clientY }: React.MouseEvent) => {
        const { left, top, width, height } = currentTarget.getBoundingClientRect()
        x.set(clientX - left - width / 2)
        y.set(clientY - top - height / 2)
    }, [x, y])

    const rotateX = useTransform(mouseY, [-100, 100], [5, -5])
    const rotateY = useTransform(mouseX, [-100, 100], [-5, 5])

    const handleAddToCart = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const format = book.formats[0]
        addItem({
            bookId: book.id,
            format,
            quantity: 1,
            price: book.price[format] || 0,
        })
    }, [book.id, book.formats, book.price, addItem])

    const handleToggleWishlist = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        toggleWishlist(book.id)
    }, [book.id, toggleWishlist])

    const handleMouseLeave = useCallback(() => {
        x.set(0)
        y.set(0)
        setIsHovered(false)
    }, [x, y])

    const handleMouseEnter = useCallback(() => setIsHovered(true), [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.15) }}
            onMouseMove={onMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            className="group perspective-1000"
            style={{ touchAction: 'pan-y pan-x' }}
        >
            <Link href={`/books/${book.id}`} className="block h-full" draggable={false}>
                <motion.div
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                    className="relative h-full transition-all duration-200 ease-out"
                >
                    {/* Cover Image Container */}
                    <div className="relative aspect-[2/3] mb-2 sm:mb-3 overflow-hidden rounded-md sm:rounded-lg bg-secondary shadow-sm sm:shadow-md transition-all duration-500 group-hover:shadow-xl border border-white/10">
                        {hasValidCover && !imageError ? (
                            <Image
                                src={book.coverUrl}
                                alt={book.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 475px) 120px, (max-width: 640px) 140px, (max-width: 768px) 160px, (max-width: 1024px) 180px, 200px"
                                priority={index < 4}
                                loading={index < 4 ? "eager" : "lazy"}
                                draggable={false}
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center p-2 sm:p-3 transition-transform duration-700 group-hover:scale-110">
                                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-amber-400 mb-1 sm:mb-2" />
                                <p className="text-white font-serif text-center text-[8px] sm:text-[10px] md:text-xs font-medium line-clamp-2">{book.title}</p>
                            </div>
                        )}

                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay" />

                        {/* Dark Gradient Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Overlay Actions - Hidden on mobile, shown on hover for desktop */}
                        <div className={`
                            absolute bottom-1 sm:bottom-2 left-0 right-0 hidden sm:flex items-center justify-center gap-1 sm:gap-2 transform translate-y-4 transition-all duration-300
                            ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0'}
                        `}>
                            <Button
                                size="icon"
                                variant="secondary"
                                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full glass-card hover:bg-white text-foreground hover:scale-110 active:scale-95 transition-all shadow-md"
                                onClick={handleToggleWishlist}
                            >
                                <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${isInWishlist(book.id) ? "fill-red-500 text-red-500" : ""}`} />
                            </Button>
                            <Button
                                size="icon"
                                variant="secondary"
                                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full glass-card hover:bg-white text-foreground hover:scale-110 active:scale-95 transition-all shadow-md"
                                onClick={handleAddToCart}
                            >
                                <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                        </div>

                        {/* Badges */}
                        <div className="absolute top-1 left-1 sm:top-2 sm:left-2 flex flex-col gap-1">
                            {book.isBestseller && (
                                <Badge className="glass-card text-foreground border-none font-serif tracking-wide text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0.5">
                                    Bestseller
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-1 sm:space-y-1.5 group-hover:-translate-y-0.5 transition-transform duration-300 px-0.5">
                        <div className="space-y-0.5">
                            <h3 className="font-serif font-bold text-xs sm:text-sm leading-tight line-clamp-1 group-hover:text-accent transition-colors text-left">
                                {book.title}
                            </h3>
                            <p className="text-[8px] sm:text-[9px] md:text-[10px] text-muted-foreground font-medium tracking-wide uppercase text-left line-clamp-1">
                                {book.author}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-1 sm:pt-1.5 border-t border-border/40">
                            <span className="font-bold text-foreground text-[11px] sm:text-xs">
                                NRS {book.price[book.formats[0]]?.toFixed(0)}
                            </span>
                            <div className="flex items-center gap-0.5 bg-secondary/50 px-1 py-0.5 rounded">
                                <Star className="h-2 w-2 sm:h-2.5 sm:w-2.5 fill-yellow-400 text-yellow-400" />
                                <span className="text-[8px] sm:text-[9px] font-medium">{book.rating.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    )
})
