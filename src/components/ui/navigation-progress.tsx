"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function NavigationProgress() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isNavigating, setIsNavigating] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        setIsNavigating(false)
        setProgress(100)
        
        const timeout = setTimeout(() => {
            setProgress(0)
        }, 200)

        return () => clearTimeout(timeout)
    }, [pathname, searchParams])

    useEffect(() => {
        const handleStart = () => {
            setIsNavigating(true)
            setProgress(0)
            
            // Simulate progress
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(interval)
                        return 90
                    }
                    return prev + 10
                })
            }, 100)

            return () => clearInterval(interval)
        }

        // Listen for link clicks
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const anchor = target.closest("a")
            
            if (anchor && anchor.href && !anchor.target && !anchor.download) {
                const url = new URL(anchor.href)
                if (url.origin === window.location.origin && url.pathname !== pathname) {
                    handleStart()
                }
            }
        }

        document.addEventListener("click", handleClick)
        return () => document.removeEventListener("click", handleClick)
    }, [pathname])

    return (
        <AnimatePresence>
            {isNavigating && (
                <motion.div
                    className="fixed top-0 left-0 right-0 z-[100] h-1 bg-foreground/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="h-full bg-foreground"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "easeOut" }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
