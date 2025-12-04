"use client"

import { memo, useState, useCallback } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Book } from "@/lib/types"
import { Star, Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWishlistStore } from "@/store/wishlist-store"
import { useCartStore } from "@/store/cart-store"
import Link from "next/link"
import Image from "next/image"

interface AnimatedBookCardProps {
    book: Book
    index?: number
}

export const AnimatedBookCard = memo(function AnimatedBookCard({ book, index = 0 }: AnimatedBookCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const { toggleWishlist, isInWishlist } = useWishlistStore()
    const { addItem } = useCartStore()

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
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseMove={onMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            className="group perspective-1000"
        >
            <Link href={`/books/${book.id}`} className="block h-full">
                <motion.div
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                    className="relative h-full transition-all duration-200 ease-out"
                >
                    {/* Cover Image Container */}
                    <div className="relative aspect-[2/3] mb-5 overflow-hidden rounded-xl bg-secondary shadow-lg transition-all duration-500 group-hover:shadow-2xl border border-white/10">
                        <Image
                            src={book.coverUrl}
                            alt={book.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 475px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            priority={index < 2}
                            loading={index < 2 ? "eager" : "lazy"}
                        />

                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay" />

                        {/* Dark Gradient Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Overlay Actions */}
                        <div className={`
                            absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3 transform translate-y-4 transition-all duration-300
                            ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0'}
                        `}>
                            <Button
                                size="icon"
                                variant="secondary"
                                className="h-10 w-10 rounded-full glass-card hover:bg-white text-foreground hover:scale-110 active:scale-95 transition-all shadow-lg"
                                onClick={handleToggleWishlist}
                            >
                                <Heart className={`h-5 w-5 ${isInWishlist(book.id) ? "fill-red-500 text-red-500" : ""}`} />
                            </Button>
                            <Button
                                size="icon"
                                variant="secondary"
                                className="h-10 w-10 rounded-full glass-card hover:bg-white text-foreground hover:scale-110 active:scale-95 transition-all shadow-lg"
                                onClick={handleAddToCart}
                            >
                                <ShoppingBag className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {book.isBestseller && (
                                <Badge className="glass-card text-foreground border-none font-serif tracking-wide">
                                    Bestseller
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-3 group-hover:-translate-y-1 transition-transform duration-300 p-2">
                        <div className="space-y-1">
                            <h3 className="font-serif font-bold text-base sm:text-lg leading-tight line-clamp-1 group-hover:text-accent transition-colors text-left">
                                {book.title}
                            </h3>
                            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium tracking-wide uppercase text-left">
                                {book.author}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border/40">
                            <span className="font-bold text-foreground text-base sm:text-lg">
                                NRS {book.price[book.formats[0]]?.toFixed(0)}
                            </span>
                            <div className="flex items-center gap-1 bg-secondary/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                                <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-yellow-400 text-yellow-400" />
                                <span className="text-[10px] sm:text-xs font-medium">{book.rating.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    )
})
