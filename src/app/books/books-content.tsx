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
            const data = await getBooks()
            setBooks(data)
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
        <div className="min-h-screen bg-background pt-40 pb-20">
            {/* Header */}
            <div className="container px-4 mx-auto mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto text-center space-y-6"
                >
                    <h1 className="text-5xl md:text-7xl font-serif font-medium tracking-tight">
                        The Collection
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
                        Explore our curated selection of literary treasures. From timeless classics to contemporary masterpieces.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-xl mx-auto mt-8 group">
                        <div className="absolute inset-0 bg-accent/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <Input
                                placeholder="Search by title, author, or keyword..."
                                className="h-14 pl-12 pr-4 bg-background/50 backdrop-blur-sm border-border/50 shadow-sm text-base rounded-full focus:ring-accent/20 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="container px-4 mx-auto">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filters */}
                    <aside className={`
                        lg:w-64 flex-shrink-0 space-y-8
                        ${isMobileFiltersOpen ? 'fixed inset-0 z-50 bg-background p-6 overflow-y-auto' : 'hidden lg:block'}
                    `}>
                        <div className="flex items-center justify-between lg:hidden mb-6">
                            <h3 className="font-serif text-2xl">Filters</h3>
                            <Button variant="ghost" size="icon" onClick={() => setIsMobileFiltersOpen(false)}>
                                <X className="h-6 w-6" />
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
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sticky top-20 z-30 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:bg-transparent sm:backdrop-blur-none sm:static sm:py-0">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    className="lg:hidden gap-2 flex-1 sm:flex-none"
                                    onClick={() => setIsMobileFiltersOpen(true)}
                                >
                                    <Filter className="h-4 w-4" />
                                    Filters
                                </Button>
                                <p className="text-sm text-muted-foreground hidden sm:block">
                                    Showing <span className="font-medium text-foreground">{sortedBooks.length}</span> results
                                </p>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                {/* View Mode Toggle */}
                                <div className="hidden sm:flex items-center gap-1 bg-secondary/50 rounded-full p-1 border border-border/50">
                                    <Button
                                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                                        size="sm"
                                        className="h-8 w-8 p-0 rounded-full"
                                        onClick={() => setViewMode("grid")}
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "list" ? "secondary" : "ghost"}
                                        size="sm"
                                        className="h-8 w-8 p-0 rounded-full"
                                        onClick={() => setViewMode("list")}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Sort Dropdown */}
                                <div className="relative">
                                    <select
                                        className="h-10 pl-4 pr-8 text-sm border border-border/50 rounded-full bg-background hover:bg-secondary/50 focus:ring-2 focus:ring-accent/20 transition-all appearance-none cursor-pointer outline-none"
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
                                    <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Books Grid */}
                        {sortedBooks.length > 0 ? (
                            <div className={`grid gap-x-8 gap-y-12 ${viewMode === "grid"
                                ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                                : "grid-cols-1"
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
                            <div className="mt-20 flex justify-center">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="px-10 h-14 rounded-full border-border/50 hover:bg-secondary/50 text-base font-medium transition-all hover:scale-105"
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
