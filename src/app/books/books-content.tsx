"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedBookCard } from "@/components/features/AnimatedBookCard"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Search, SlidersHorizontal, X, LayoutGrid, List, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { GENRES } from "@/lib/data"
import { useSearchParams } from "next/navigation"
import { getBooks } from "@/lib/supabase/books"
import { Book } from "@/lib/types"
import { BookGridSkeleton } from "@/components/ui/loading-spinner"

export function BooksContent() {
    const searchParams = useSearchParams()
    const [priceRange, setPriceRange] = useState([5000])
    const [selectedGenres, setSelectedGenres] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedMood, setSelectedMood] = useState("")
    const [sortBy, setSortBy] = useState("relevance")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
    const [books, setBooks] = useState<Book[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Initialize from URL params
    useEffect(() => {
        const search = searchParams.get('search')
        const mood = searchParams.get('mood')
        const bestseller = searchParams.get('bestseller')

        if (search) setSearchQuery(search)
        if (mood) setSelectedMood(mood)
        if (bestseller) setSortBy("bestselling")
    }, [searchParams])

    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true)
            try {
                const data = await getBooks()
                setBooks(data)
            } catch (error) {
                console.error('Error fetching books:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchBooks()
    }, [])

    // Filter logic
    const filteredBooks = books.filter(book => {
        const matchesSearch = searchQuery === "" ||
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.description.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesGenre = selectedGenres.length === 0 ||
            book.genres?.some((g: string) => selectedGenres.includes(g))

        const matchesMood = selectedMood === "" ||
            (book.mood && book.mood.includes(selectedMood))

        const price = book.price.paperback || book.price.hardcover || 0
        const matchesPrice = price <= priceRange[0]

        return matchesSearch && matchesGenre && matchesMood && matchesPrice
    })

    // Sort logic
    const sortedBooks = [...filteredBooks].sort((a, b) => {
        const priceA = a.price.paperback || a.price.hardcover || 0
        const priceB = b.price.paperback || b.price.hardcover || 0

        switch (sortBy) {
            case "price-low":
                return priceA - priceB
            case "price-high":
                return priceB - priceA
            case "newest":
                return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
            case "bestselling":
                return (b.reviewCount || 0) - (a.reviewCount || 0)
            case "rating":
                return (b.rating || 0) - (a.rating || 0)
            default:
                return 0
        }
    })

    const toggleGenre = (genre: string) => {
        setSelectedGenres(prev =>
            prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
        )
    }

    const clearAllFilters = () => {
        setSearchQuery("")
        setSelectedGenres([])
        setSelectedMood("")
        setPriceRange([5000])
    }

    const hasActiveFilters = searchQuery || selectedGenres.length > 0 || selectedMood || priceRange[0] < 5000

    return (
        <div className="min-h-screen bg-background pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-8 sm:pb-12 md:pb-16">
            {/* Header */}
            <div className="container px-4 sm:px-6 mx-auto mb-6 sm:mb-8 md:mb-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto text-center space-y-3 sm:space-y-4"
                >
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-medium tracking-tight">
                        The Collection
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto font-light">
                        Explore our curated selection of literary treasures. From timeless classics to contemporary masterpieces.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-md mx-auto mt-4 sm:mt-6 group">
                        <div className="absolute inset-0 bg-accent/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search books..."
                                className="h-10 sm:h-12 pl-10 sm:pl-11 pr-4 bg-background/50 backdrop-blur-sm border-border/50 shadow-sm text-sm rounded-full focus:ring-accent/20 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="container px-4 sm:px-6 mx-auto">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Sidebar Filters - Mobile Overlay */}
                    <aside className={`
                        lg:w-56 xl:w-60 flex-shrink-0 space-y-6
                        ${isMobileFiltersOpen 
                            ? 'fixed inset-0 z-50 bg-background p-4 pt-6 overflow-y-auto' 
                            : 'hidden lg:block lg:sticky lg:top-24 lg:h-fit lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:scrollbar-none'
                        }
                    `}>
                        {/* Mobile Filter Header */}
                        <div className="flex items-center justify-between lg:hidden mb-4">
                            <h3 className="font-serif text-xl font-medium">Filters</h3>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9" 
                                onClick={() => setIsMobileFiltersOpen(false)}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="space-y-6">
                            {/* Active Mood */}
                            {selectedMood && (
                                <div>
                                    <h4 className="font-medium mb-3 text-xs uppercase tracking-wider text-muted-foreground">Active Mood</h4>
                                    <Badge variant="secondary" className="text-sm px-3 py-1.5 gap-2 w-full justify-between">
                                        {selectedMood}
                                        <X
                                            className="h-3.5 w-3.5 cursor-pointer hover:text-destructive transition-colors"
                                            onClick={() => setSelectedMood("")}
                                        />
                                    </Badge>
                                </div>
                            )}

                            {/* Price Range */}
                            <div>
                                <h4 className="font-medium mb-4 text-xs uppercase tracking-wider text-muted-foreground">Price Range</h4>
                                <Slider
                                    value={priceRange}
                                    onValueChange={setPriceRange}
                                    max={5000}
                                    step={100}
                                    className="my-4"
                                />
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-muted-foreground">NRS 0</span>
                                    <span className="text-foreground">NRS {priceRange[0]}</span>
                                </div>
                            </div>

                            <Separator className="bg-border/50" />

                            {/* Genres */}
                            <div>
                                <h4 className="font-medium mb-4 text-xs uppercase tracking-wider text-muted-foreground">Genres</h4>
                                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-2 scrollbar-none">
                                    {GENRES.map((genre) => (
                                        <div 
                                            key={genre} 
                                            className="flex items-center space-x-3 group cursor-pointer" 
                                            onClick={() => toggleGenre(genre)}
                                        >
                                            <Checkbox
                                                id={genre}
                                                checked={selectedGenres.includes(genre)}
                                                onCheckedChange={() => toggleGenre(genre)}
                                                className="rounded-sm border-muted-foreground/30 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground transition-all"
                                            />
                                            <label
                                                htmlFor={genre}
                                                className="text-sm leading-none cursor-pointer text-muted-foreground group-hover:text-foreground transition-colors"
                                            >
                                                {genre}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    className="w-full border-destructive/20 text-destructive hover:bg-destructive/5 hover:text-destructive"
                                    onClick={clearAllFilters}
                                >
                                    Clear All Filters
                                </Button>
                            )}

                            {/* Mobile Apply Button */}
                            <div className="lg:hidden pt-4">
                                <Button 
                                    className="w-full" 
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                >
                                    Show {sortedBooks.length} Results
                                </Button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6 sticky top-16 sm:top-20 z-30 bg-background/95 backdrop-blur-sm py-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:bg-transparent sm:backdrop-blur-none sm:static sm:py-0 border-b sm:border-none border-border/50">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="lg:hidden gap-1.5 h-9 text-sm"
                                    onClick={() => setIsMobileFiltersOpen(true)}
                                >
                                    <Filter className="h-4 w-4" />
                                    Filters
                                </Button>
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">{sortedBooks.length}</span> books
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* View Mode Toggle - Desktop only */}
                                <div className="hidden md:flex items-center gap-1 bg-secondary/50 rounded-full p-1 border border-border/50">
                                    <Button
                                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                                        size="sm"
                                        className="h-7 w-7 p-0 rounded-full"
                                        onClick={() => setViewMode("grid")}
                                    >
                                        <LayoutGrid className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "list" ? "secondary" : "ghost"}
                                        size="sm"
                                        className="h-7 w-7 p-0 rounded-full"
                                        onClick={() => setViewMode("list")}
                                    >
                                        <List className="h-3.5 w-3.5" />
                                    </Button>
                                </div>

                                {/* Sort Dropdown */}
                                <div className="relative">
                                    <select
                                        className="h-9 pl-3 pr-8 text-sm border border-border/50 rounded-full bg-background hover:bg-secondary/50 focus:ring-2 focus:ring-accent/20 transition-all appearance-none cursor-pointer outline-none"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="relevance">Relevant</option>
                                        <option value="price-low">Price ↑</option>
                                        <option value="price-high">Price ↓</option>
                                        <option value="newest">Newest</option>
                                        <option value="bestselling">Bestselling</option>
                                        <option value="rating">Top Rated</option>
                                    </select>
                                    <SlidersHorizontal className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Books Grid */}
                        {isLoading ? (
                            <BookGridSkeleton count={8} />
                        ) : sortedBooks.length > 0 ? (
                            <div className={`grid ${viewMode === "grid"
                                ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6"
                                : "grid-cols-1 gap-4"
                                }`}>
                                <AnimatePresence mode="popLayout">
                                    {sortedBooks.map((book, i) => (
                                        <motion.div
                                            key={book.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.3) }}
                                        >
                                            <AnimatedBookCard book={book} index={i} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-16 sm:py-24"
                            >
                                <div className="max-w-sm mx-auto space-y-4">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto">
                                        <Search className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground/40" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg sm:text-xl font-serif font-bold">No books found</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Try adjusting your filters or search terms.
                                        </p>
                                    </div>
                                    <Button onClick={clearAllFilters} variant="outline" size="sm" className="rounded-full px-6">
                                        Clear filters
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Load More */}
                        {sortedBooks.length > 0 && sortedBooks.length >= 8 && (
                            <div className="mt-8 sm:mt-12 flex justify-center">
                                <Button
                                    variant="outline"
                                    className="px-6 sm:px-8 h-10 sm:h-11 rounded-full border-border/50 hover:bg-secondary/50 text-sm font-medium transition-all hover:scale-105"
                                >
                                    Load More
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}