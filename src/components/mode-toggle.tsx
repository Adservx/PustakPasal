"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
    const { setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const handleToggle = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                <Sun className="h-5 w-5" />
            </Button>
        )
    }

    const isDark = resolvedTheme === "dark"

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            className="h-10 w-10 rounded-full hover:bg-secondary"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            {isDark ? (
                <Moon className="h-5 w-5" />
            ) : (
                <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
