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
import { LoadingSpinner, BookGridSkeleton } from "@/components/ui/loading-spinner"

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
            const data = await getBooks()
            setBooks(data)
            setIsLoading(false)
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
        <div className="min-h-screen bg-background pt-24 sm:pt-28 md:pt-32 lg:pt-40 pb-12 sm:pb-16 md:pb-20">
            {/* Header */}
            <div className="container px-3 sm:px-4 md:px-6 mx-auto mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4 md:space-y-6"
                >
                    <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-medium tracking-tight">
                        The Collection
                    </h1>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto font-light px-2 sm:px-4">
                        Explore our curated selection of literary treasures. From timeless classics to contemporary masterpieces.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-xl mx-auto mt-4 sm:mt-6 md:mt-8 group px-1 sm:px-2">
                        <div className="absolute inset-0 bg-accent/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
                            <Input
                                placeholder="Search books..."
                                className="h-10 sm:h-11 md:h-12 lg:h-14 pl-9 sm:pl-10 md:pl-12 pr-4 bg-background/50 backdrop-blur-sm border-border/50 shadow-sm text-sm md:text-base rounded-full focus:ring-accent/20 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="container px-3 sm:px-4 md:px-6 mx-auto">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12">
                    {/* Sidebar Filters */}
                    <aside className={`
                        lg:w-52 xl:w-56 2xl:w-64 flex-shrink-0 space-y-5 sm:space-y-6 md:space-y-8
                        ${isMobileFiltersOpen ? 'fixed inset-0 z-50 bg-background p-4 sm:p-5 md:p-6 overflow-y-auto safe-top safe-bottom' : 'hidden lg:block'}
                    `}>
                        <div className="flex items-center justify-between lg:hidden mb-4 sm:mb-5 md:mb-6 pt-2">
                            <h3 className="font-serif text-lg sm:text-xl md:text-2xl">Filters</h3>
                            <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10" onClick={() => setIsMobileFiltersOpen(false)}>
                                <X className="h-5 w-5 sm:h-6 sm:w-6" />
                            </Button>
                        </div>

                        <div className="space-y-8">
                            {/* Active Mood */}
                            {selectedMood && (
                                <div>
                                    <h4 className="font-medium mb-3 text-sm uppercase tracking-wider text-muted-foreground">Active Mood</h4>
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
                                <h4 className="font-medium mb-4 text-sm uppercase tracking-wider text-muted-foreground">Price Range</h4>
                                <Slider
                                    value={priceRange}
                                    onValueChange={setPriceRange}
                                    max={5000}
                                    step={100}
                                    className="my-6"
                                />
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-muted-foreground">NRS 0</span>
                                    <span className="text-foreground">NRS {priceRange[0]}</span>
                                </div>
                            </div>

                            <Separator className="bg-border/50" />

                            {/* Genres */}
                            <div>
                                <h4 className="font-medium mb-4 text-sm uppercase tracking-wider text-muted-foreground">Genres</h4>
                                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-none">
                                    {GENRES.map((genre) => (
                                        <div key={genre} className="flex items-center space-x-3 group cursor-pointer" onClick={() => toggleGenre(genre)}>
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
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Toolbar */}
                        <div className="flex flex-col xs:flex-row items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6 md:mb-8 sticky top-20 z-30 bg-background/80 backdrop-blur-md py-3 sm:py-4 -mx-3 sm:-mx-4 px-3 sm:px-4 md:mx-0 md:px-0 md:bg-transparent md:backdrop-blur-none md:static md:py-0">
                            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full xs:w-auto">
                                <Button
                                    variant="outline"
                                    className="lg:hidden gap-1.5 sm:gap-2 flex-1 xs:flex-none h-9 sm:h-10 text-xs sm:text-sm"
                                    onClick={() => setIsMobileFiltersOpen(true)}
                                >
                                    <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    Filters
                                </Button>
                                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                                    Showing <span className="font-medium text-foreground">{sortedBooks.length}</span> results
                                </p>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3 w-full xs:w-auto justify-end">
                                {/* View Mode Toggle */}
                                <div className="hidden sm:flex items-center gap-1 bg-secondary/50 rounded-full p-0.5 sm:p-1 border border-border/50">
                                    <Button
                                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                                        size="sm"
                                        className="h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-full"
                                        onClick={() => setViewMode("grid")}
                                    >
                                        <LayoutGrid className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "list" ? "secondary" : "ghost"}
                                        size="sm"
                                        className="h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-full"
                                        onClick={() => setViewMode("list")}
                                    >
                                        <List className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    </Button>
                                </div>

                                {/* Sort Dropdown */}
                                <div className="relative flex-1 xs:flex-none">
                                    <select
                                        className="h-9 sm:h-10 w-full xs:w-auto pl-3 sm:pl-4 pr-7 sm:pr-8 text-xs sm:text-sm border border-border/50 rounded-full bg-background hover:bg-secondary/50 focus:ring-2 focus:ring-accent/20 transition-all appearance-none cursor-pointer outline-none"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="relevance">Most Relevant</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="newest">Newest First</option>
                                        <option value="bestselling">Best Selling</option>
                                        <option value="rating">Highest Rated</option>
                                    </select>
                                    <SlidersHorizontal className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Books Grid */}
                        {isLoading ? (
                            <BookGridSkeleton count={8} />
                        ) : sortedBooks.length > 0 ? (
                            <div className={`grid ${viewMode === "grid"
                                ? "grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-x-8 gap-y-4 xs:gap-y-5 sm:gap-y-6 md:gap-y-8 lg:gap-y-10 xl:gap-y-12"
                                : "grid-cols-1 gap-y-4 sm:gap-y-6"
                                }`}>
                                <AnimatePresence mode="popLayout">
                                    {sortedBooks.map((book, i) => (
                                        <motion.div
                                            key={book.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.3, delay: i * 0.05 }}
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
                                className="text-center py-32"
                            >
                                <div className="max-w-md mx-auto space-y-6">
                                    <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mx-auto">
                                        <Search className="h-10 w-10 text-muted-foreground/40" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-serif font-bold">No books found</h3>
                                        <p className="text-muted-foreground">
                                            We couldn't find any matches for your current filters.
                                        </p>
                                    </div>
                                    <Button onClick={clearAllFilters} variant="outline" className="rounded-full px-8">
                                        Clear all filters
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Load More */}
                        {sortedBooks.length > 0 && (
                            <div className="mt-10 sm:mt-14 md:mt-16 lg:mt-20 flex justify-center">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="px-6 sm:px-8 md:px-10 h-11 sm:h-12 md:h-14 rounded-full border-border/50 hover:bg-secondary/50 text-sm sm:text-base font-medium transition-all hover:scale-105"
                                >
                                    Load More Books
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
