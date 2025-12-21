"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg" | "xl"
    className?: string
    text?: string
}

const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
    xl: "h-16 w-16"
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
            <div className={cn("relative", sizeClasses[size])}>
                {/* Outer ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-accent/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />
                {/* Spinning arc */}
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                {/* Inner dot */}
                <motion.div
                    className="absolute inset-[25%] rounded-full bg-accent/30"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>
            {text && (
                <motion.p
                    className="text-sm text-muted-foreground font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {text}
                </motion.p>
            )}
        </div>
    )
}

export function PageLoader({ text = "Loading..." }: { text?: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-6"
            >
                {/* Logo */}
                <motion.div
                    className="h-16 w-16 rounded-2xl bg-gradient-to-br from-foreground to-foreground/80 text-background flex items-center justify-center font-serif font-bold text-3xl shadow-2xl"
                    animate={{
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    H
                </motion.div>

                {/* Loading bar */}
                <div className="w-48 h-1 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-foreground rounded-full"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{ width: "50%" }}
                    />
                </div>

                <motion.p
                    className="text-muted-foreground font-medium"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    {text}
                </motion.p>
            </motion.div>
        </div>
    )
}

export function BookCardSkeleton() {
    return (
        <div className="space-y-4">
            <div className="aspect-[2/3] bg-secondary/50 rounded-xl animate-pulse" />
            <div className="space-y-2">
                <div className="h-5 w-3/4 bg-secondary/50 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-secondary/30 rounded animate-pulse" />
            </div>
        </div>
    )
}

export function BookGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-8 sm:gap-y-10 md:gap-y-12">
            {[...Array(count)].map((_, i) => (
                <BookCardSkeleton key={i} />
            ))}
        </div>
    )
}

export function CategorySliderSkeleton({ count = 6 }: { count?: number }) {
    return (
        <section className="py-8 sm:py-12 md:py-16 relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Skeleton */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-8 gap-4">
                    <div className="space-y-2 sm:space-y-3">
                        <div className="h-8 sm:h-10 w-48 sm:w-56 bg-secondary/50 rounded-lg animate-pulse" />
                        <div className="h-4 sm:h-5 w-64 sm:w-80 bg-secondary/30 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-secondary/50 animate-pulse" />
                            <div className="h-10 w-10 rounded-full bg-secondary/50 animate-pulse" />
                        </div>
                        <div className="h-5 w-16 bg-secondary/30 rounded animate-pulse" />
                    </div>
                </div>

                {/* Books Slider Skeleton */}
                <div className="relative">
                    <div className="flex gap-4 sm:gap-6 overflow-hidden pb-4">
                        {[...Array(count)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex-shrink-0 w-[160px] xs:w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
                            >
                                <div className="aspect-[2/3] bg-secondary/50 rounded-lg sm:rounded-xl animate-pulse mb-3 sm:mb-4" />
                                <div className="space-y-2">
                                    <div className="h-4 sm:h-5 w-3/4 bg-secondary/50 rounded animate-pulse" />
                                    <div className="h-3 sm:h-4 w-1/2 bg-secondary/30 rounded animate-pulse" />
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="h-3 w-16 bg-secondary/40 rounded animate-pulse" />
                                        <div className="h-5 w-12 bg-secondary/50 rounded animate-pulse" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Mobile dots skeleton */}
                    <div className="flex sm:hidden justify-center gap-1.5 mt-4">
                        <div className="h-1.5 w-4 rounded-full bg-secondary/50 animate-pulse" />
                        <div className="h-1.5 w-1.5 rounded-full bg-secondary/30 animate-pulse" />
                        <div className="h-1.5 w-1.5 rounded-full bg-secondary/30 animate-pulse" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export function CollectionLoadingSkeleton({ categoryCount = 3 }: { categoryCount?: number }) {
    return (
        <div className="bg-secondary/20 border-y border-border/30">
            {/* Section Intro Skeleton */}
            <section className="py-10 sm:py-14 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-4 sm:mb-8"
                    >
                        <div className="flex items-center gap-2 sm:gap-4 justify-center mb-4 sm:mb-6">
                            <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-border" />
                            <div className="h-4 sm:h-5 w-36 sm:w-48 bg-secondary/50 rounded animate-pulse" />
                            <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-border" />
                        </div>
                        <div className="h-4 sm:h-5 w-full max-w-md mx-auto bg-secondary/30 rounded animate-pulse" />
                    </motion.div>
                </div>
            </section>

            {/* Category Sliders Skeleton */}
            <div className="space-y-4 sm:space-y-8 md:space-y-12 pb-8 sm:pb-12 md:pb-16">
                {[...Array(categoryCount)].map((_, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <CategorySliderSkeleton />
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
