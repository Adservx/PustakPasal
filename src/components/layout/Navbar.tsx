"use client"

import Link from "next/link"
import { Search, User, Heart, Menu, X, BookOpen, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MegaMenu } from "@/components/layout/MegaMenu"
import { ModeToggle } from "@/components/mode-toggle"
import { CartDrawer } from "@/components/features/CartDrawer"
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWishlistStore } from "@/store/wishlist-store"
import { createClient } from "@/lib/supabase/client"

export function Navbar() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [isScrolled, setIsScrolled] = useState(false)
    const [isHidden, setIsHidden] = useState(false)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { bookIds } = useWishlistStore()
    const { scrollY } = useScroll()
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isMobileMenuOpen])

    useMotionValueEvent(scrollY, "change", (latest) => {
        const currentScrollY = latest

        // Show/Hide logic (disabled when mobile menu is open)
        if (!isMobileMenuOpen) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsHidden(true)
            } else {
                setIsHidden(false)
            }
        }

        setIsScrolled(currentScrollY > 20)
        setLastScrollY(currentScrollY)
    })

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            router.push(`/books?search=${encodeURIComponent(searchQuery)}`)
            setSearchQuery("")
            setIsSearchOpen(false)
            setIsMobileMenuOpen(false)
        }
    }

    return (
        <>
            <motion.header
                variants={{
                    visible: { y: 0 },
                    hidden: { y: -100 }
                }}
                animate={isHidden ? "hidden" : "visible"}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 md:pt-6 px-2 md:px-4 pointer-events-none"
            >
                <div className={`
                    pointer-events-auto
                    flex items-center justify-between gap-2 md:gap-4 px-4 md:px-8 py-3 md:py-4
                    rounded-full transition-all duration-500 backdrop-blur-2xl
                    ${isScrolled
                        ? 'bg-background/80 shadow-2xl border border-white/20 w-[99%] max-w-7xl ring-1 ring-black/5 dark:ring-white/10'
                        : 'bg-background/20 w-[99%] max-w-7xl border border-white/10'
                    }
                `}>
                    {/* Left: Logo */}
                    <Link href="/" className="group flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
                        <div className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-foreground to-foreground/80 text-background flex items-center justify-center font-serif font-bold text-lg sm:text-xl md:text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                            H
                        </div>
                        <span className="font-serif text-xs xs:text-sm sm:text-lg md:text-xl lg:text-2xl font-bold tracking-tight transition-colors text-gradient whitespace-nowrap hidden xs:inline">
                            Hamro Pustak Pasal
                        </span>
                        <span className="font-serif text-xs font-bold tracking-tight transition-colors text-gradient whitespace-nowrap xs:hidden">
                            Hamro Pustak
                        </span>
                    </Link>

                    {/* Center: Navigation (Desktop) */}
                    <div className="hidden lg:flex items-center justify-center flex-1">
                        <MegaMenu />
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1 md:gap-3">
                        {/* Mobile Search Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden h-9 w-9 rounded-full hover:bg-secondary/80 transition-colors"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            <Search className="h-4 w-4" />
                        </Button>

                        {/* Mobile Menu Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden h-9 w-9 md:h-12 md:w-12 rounded-full hover:bg-secondary/80 transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <Menu className="h-5 w-5 md:h-6 md:w-6" />
                        </Button>

                        {/* Search Toggle (Desktop) */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden md:flex h-12 w-12 rounded-full hover:bg-secondary/80 transition-all hover:scale-110"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            <Search className="h-5 w-5" />
                        </Button>

                        <div className="h-6 w-[1px] bg-border/50 mx-2 hidden md:block" />

                        <div className="hidden md:block">
                            <ModeToggle />
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative h-10 w-10 md:h-12 md:w-12 rounded-full hover:bg-secondary/80 hidden md:flex transition-all hover:scale-110"
                            onClick={() => router.push('/wishlist')}
                        >
                            <Heart className="h-5 w-5" />
                            {bookIds.length > 0 && (
                                <span className="absolute top-2 right-2 md:top-3 md:right-3 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
                            )}
                        </Button>

                        <CartDrawer />

                        <div className="h-6 w-[1px] bg-border/50 mx-2 hidden md:block" />

                        {user ? (
                            <div className="relative group hidden md:block">
                                <Link href="/admin">
                                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full hover:bg-secondary/80 transition-all hover:scale-110">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                                            {user.user_metadata?.avatar_url ? (
                                                <img src={user.user_metadata.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                                            ) : (
                                                <User className="h-4 w-4 text-primary" />
                                            )}
                                        </div>
                                    </Button>
                                </Link>
                                <div
                                    className="absolute right-0 top-full mt-2 w-48 rounded-xl shadow-2xl border border-white/20 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/10 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right glass-dropdown"
                                >
                                    <div className="px-3 py-2 border-b border-border/50 mb-2">
                                        <p className="font-medium text-sm truncate">{user.user_metadata?.full_name || 'User'}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                    </div>
                                    <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary/50 transition-colors">
                                        <User className="h-4 w-4" /> Account
                                    </Link>
                                    <button
                                        onClick={async () => {
                                            await supabase.auth.signOut()
                                            router.refresh()
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                                    >
                                        <span className="h-4 w-4">🚪</span> Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-2">
                                <Link href="/login">
                                    <Button variant="ghost" className="rounded-full">Login</Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="rounded-full px-6">Sign Up</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </motion.header>

            {/* Search Overlay (Mobile & Desktop) */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-[70px] md:top-[90px] left-0 right-0 z-[55] px-3 md:px-4 pt-2 pb-4 md:flex md:justify-center"
                    >
                        <div className="bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border p-3 md:w-full md:max-w-xl">
                            <div className="relative flex items-center gap-2">
                                <Search className="absolute left-4 text-muted-foreground h-4 w-4 md:h-5 md:w-5" />
                                <Input
                                    type="search"
                                    placeholder="Search books..."
                                    className="h-11 md:h-12 pl-10 md:pl-12 pr-4 bg-secondary/50 border-border rounded-xl focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-accent/50 w-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    autoFocus
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 md:h-10 md:w-10 rounded-full shrink-0 hover:bg-secondary"
                                    onClick={() => setIsSearchOpen(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-background/95 backdrop-blur-xl border-l border-border shadow-2xl z-[70] lg:hidden overflow-y-auto"
                        >
                            <div className="p-6 space-y-6">
                                {/* Header */}
                                <div className="flex items-center justify-between pb-4 border-b border-border">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-lg bg-foreground text-background flex items-center justify-center font-serif font-bold text-xl shadow-lg">
                                            H
                                        </div>
                                        <span className="font-serif text-lg font-bold text-gradient">Hamro Pustak Pasal</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <X className="h-6 w-6" />
                                    </Button>
                                </div>

                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                    <Input
                                        type="search"
                                        placeholder="Search books..."
                                        className="h-12 pl-12 pr-4 bg-secondary/50 border-border rounded-full focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-accent/50"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={handleSearch}
                                    />
                                </div>

                                {/* Navigation Links */}
                                <nav className="space-y-2">
                                    <Link
                                        href="/"
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary/50 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Home className="h-5 w-5" />
                                        <span className="font-medium">Home</span>
                                    </Link>
                                    <Link
                                        href="/books"
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary/50 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <BookOpen className="h-5 w-5" />
                                        <span className="font-medium">Browse Books</span>
                                    </Link>
                                    <Link
                                        href="/wishlist"
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary/50 transition-colors relative"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Heart className="h-5 w-5" />
                                        <span className="font-medium">Wishlist</span>
                                        {bookIds.length > 0 && (
                                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">{bookIds.length}</span>
                                        )}
                                    </Link>
                                </nav>

                                {/* Theme Toggle */}
                                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-secondary/30">
                                    <span className="font-medium">Theme</span>
                                    <ModeToggle />
                                </div>

                                {/* User Section */}
                                {user ? (
                                    <div className="space-y-2 pt-4 border-t border-border">
                                        <div className="px-4 py-2">
                                            <p className="font-medium text-sm">{user.user_metadata?.full_name || 'User'}</p>
                                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                        </div>
                                        <Link
                                            href="/admin"
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary/50 transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <User className="h-5 w-5" />
                                            <span className="font-medium">Admin Panel</span>
                                        </Link>
                                        <button
                                            onClick={async () => {
                                                await supabase.auth.signOut()
                                                setIsMobileMenuOpen(false)
                                                router.refresh()
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors"
                                        >
                                            <span className="h-5 w-5">🚪</span>
                                            <span className="font-medium">Logout</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2 pt-4 border-t border-border">
                                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button variant="outline" className="w-full rounded-full h-12">Login</Button>
                                        </Link>
                                        <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button className="w-full rounded-full h-12">Sign Up</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
