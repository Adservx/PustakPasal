"use client"

import { memo, useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Book } from "@/lib/types"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedBookCard } from "./AnimatedBookCard"
import Link from "next/link"

interface CategoryBookSliderProps {
    title: string
    subtitle?: string
    books: Book[]
    href?: string
    accentColor?: string
}

export const CategoryBookSlider = memo(function CategoryBookSlider({
    title,
    subtitle,
    books,
    href,
    accentColor = "accent"
}: CategoryBookSliderProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)

    const checkScrollability = () => {
        const container = scrollContainerRef.current
        if (container) {
            setCanScrollLeft(container.scrollLeft > 0)
            setCanScrollRight(
                container.scrollLeft < container.scrollWidth - container.clientWidth - 10
            )
        }
    }

    useEffect(() => {
        checkScrollability()
        const container = scrollContainerRef.current
        if (container) {
            container.addEventListener('scroll', checkScrollability)
            window.addEventListener('resize', checkScrollability)
            return () => {
                container.removeEventListener('scroll', checkScrollability)
                window.removeEventListener('resize', checkScrollability)
            }
        }
    }, [books])

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current
        if (container) {
            const scrollAmount = container.clientWidth * 0.8
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    // Mouse drag handlers for desktop
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0))
        setScrollLeft(scrollContainerRef.current?.scrollLeft || 0)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return
        e.preventDefault()
        const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0)
        const walk = (x - startX) * 1.5
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = scrollLeft - walk
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleMouseLeave = () => {
        setIsDragging(false)
    }

    // Simple touch handlers - let browser handle smooth scrolling natively
    const handleTouchStart = () => {
        setIsDragging(true)
    }

    const handleTouchEnd = () => {
        setIsDragging(false)
    }

    if (books.length === 0) return null

    return (
        <section className="py-8 sm:py-12 md:py-16 relative">
            {/* Section Header - with container padding */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-8 gap-4"
                >
                    <div className="space-y-1 sm:space-y-2">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium">{title}</h2>
                        {subtitle && (
                            <p className="text-muted-foreground text-sm sm:text-base max-w-md font-light">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Navigation Buttons - Hidden on very small screens */}
                        <div className="hidden sm:flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className={`h-10 w-10 rounded-full border-border/50 transition-all duration-300 ${canScrollLeft
                                    ? 'hover:bg-secondary/80 hover:scale-110'
                                    : 'opacity-40 cursor-not-allowed'
                                    }`}
                                onClick={() => scroll('left')}
                                disabled={!canScrollLeft}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className={`h-10 w-10 rounded-full border-border/50 transition-all duration-300 ${canScrollRight
                                    ? 'hover:bg-secondary/80 hover:scale-110'
                                    : 'opacity-40 cursor-not-allowed'
                                    }`}
                                onClick={() => scroll('right')}
                                disabled={!canScrollRight}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Books Slider - full width with scroll padding */}
            <div className="relative group">
                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    className={`flex gap-4 sm:gap-6 overflow-x-auto overflow-y-hidden scrollbar-none pb-4 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
                        }`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    style={{
                        scrollSnapType: 'x proximity',
                        WebkitOverflowScrolling: 'touch',
                        touchAction: 'pan-x pan-y',
                        scrollPaddingLeft: '1rem',
                        scrollPaddingRight: '1rem'
                    }}
                >
                    {/* Left transparent spacer - matches container padding */}
                    <div className="flex-shrink-0 w-4 sm:w-6 lg:w-[calc((100vw-1280px)/2+2rem)]" aria-hidden="true" />

                    {books.map((book, index) => (
                        <div
                            key={book.id}
                            className="flex-shrink-0 w-[120px] xs:w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]"
                            style={{ scrollSnapAlign: 'start' }}
                        >
                            <AnimatedBookCard book={book} index={index} />
                        </div>
                    ))}

                    {/* View All Card at the end */}
                    {href && (
                        <div
                            className="flex-shrink-0 w-[120px] xs:w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]"
                            style={{ scrollSnapAlign: 'start' }}
                        >
                            <Link href={href} className="block h-full">
                                <div className="aspect-[2/3] rounded-lg border border-border/50 bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-foreground/20">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-foreground/10 flex items-center justify-center group-hover:bg-foreground/20 transition-colors duration-300">
                                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-foreground group-hover:translate-x-1 transition-transform duration-300" />
                                    </div>
                                    <span className="text-sm sm:text-base font-medium text-foreground/80 group-hover:text-foreground transition-colors duration-300">
                                        View All
                                    </span>
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* Right transparent spacer */}
                    <div className="flex-shrink-0 w-4 sm:w-6 lg:w-[calc((100vw-1280px)/2+2rem)]" aria-hidden="true" />
                </div>

                {/* Mobile Navigation Dots */}
                <div className="flex sm:hidden justify-center gap-1.5 mt-4">
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${!canScrollLeft && canScrollRight ? 'w-4 bg-foreground' : 'w-1.5 bg-muted-foreground/30'
                        }`} />
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${canScrollLeft && canScrollRight ? 'w-4 bg-foreground' : 'w-1.5 bg-muted-foreground/30'
                        }`} />
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${canScrollLeft && !canScrollRight ? 'w-4 bg-foreground' : 'w-1.5 bg-muted-foreground/30'
                        }`} />
                </div>
            </div>
        </section>
    )
})
