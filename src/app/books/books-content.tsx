"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedBookCard } from "@/components/features/AnimatedBookCard"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal, X, LayoutGrid, List, Filter, ArrowRight, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { GENRES } from "@/lib/data"
import { useSearchParams } from "next/navigation"
import { Book } from "@/lib/types"
import {
    Sheet,
    SheetContent,
    SheetClose,
} from "@/components/ui/sheet"

interface BooksContentProps {
    initialBooks: Book[]
}

export function BooksContent({ initialBooks }: BooksContentProps) {
    const searchParams = useSearchParams()
    const [minPrice, setMinPrice] = useState<number>(0)
    const [maxPrice, setMaxPrice] = useState<number>(5000)
    const [selectedGenres, setSelectedGenres] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedMood, setSelectedMood] = useState("")
    const [sortBy, setSortBy] = useState("relevance")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
    const [books] = useState<Book[]>(initialBooks)

    useEffect(() => {
        const search = searchParams.get('search')
        const mood = searchParams.get('mood')
        const bestseller = searchParams.get('bestseller')
        if (search) setSearchQuery(search)
        if (mood) setSelectedMood(mood)
        if (bestseller) setSortBy("bestselling")
    }, [searchParams])

    const filteredBooks = books.filter(book => {
        const matchesSearch = searchQuery === "" ||
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (book.description && book.description.toLowerCase().includes(searchQuery.toLowerCase()))
        const matchesGenre = selectedGenres.length === 0 ||
            book.genres?.some((g: string) => selectedGenres.includes(g))
        const matchesMood = selectedMood === "" ||
            (book.mood && book.mood.includes(selectedMood))
        const price = book.price.paperback || book.price.hardcover || 0
        const matchesPrice = price >= minPrice && price <= maxPrice
        return matchesSearch && matchesGenre && matchesMood && matchesPrice
    })

    const sortedBooks = [...filteredBooks].sort((a, b) => {
        const priceA = a.price.paperback || a.price.hardcover || 0
        const priceB = b.price.paperback || b.price.hardcover || 0
        switch (sortBy) {
            case "price-low": return priceA - priceB
            case "price-high": return priceB - priceA
            case "newest": return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
            case "bestselling": return (b.reviewCount || 0) - (a.reviewCount || 0)
            case "rating": return (b.rating || 0) - (a.rating || 0)
            default: return 0
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
        setMinPrice(0)
        setMaxPrice(5000)
    }

    const hasActiveFilters = searchQuery || selectedGenres.length > 0 || selectedMood || minPrice > 0 || maxPrice < 5000
    const activeFilterCount = selectedGenres.length + (selectedMood ? 1 : 0) + (minPrice > 0 || maxPrice < 5000 ? 1 : 0)

    const handleMinPriceChange = (value: string) => {
        const num = parseInt(value) || 0
        setMinPrice(Math.max(0, num))
    }

    const handleMaxPriceChange = (value: string) => {
        const num = parseInt(value) || 0
        setMaxPrice(Math.max(0, num))
    }

    // Shared Filter Content Component
    const FilterContent = () => (
        <div className="space-y-6">
            {/* Active Mood */}
            {selectedMood && (
                <div>
                    <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">
                        Active Mood
                    </h4>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/30">
                        <span className="text-sm font-medium">{selectedMood}</span>
                        <button
                            onClick={() => setSelectedMood("")}
                            className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-secondary/50 transition-colors"
                        >
                            <X className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                    </div>
                </div>
            )}

            {/* Price Range */}
            <div>
                <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">
                    Price Range
                </h4>
                <div className="flex gap-3">
                    <div className="flex-1">
                        <label className="text-xs text-muted-foreground mb-1.5 block">Min. Price</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">NRS</span>
                            <Input
                                type="number"
                                value={minPrice}
                                onChange={(e) => handleMinPriceChange(e.target.value)}
                                className="h-10 pl-12 pr-3 rounded-lg bg-secondary/30 border-border/50"
                                min={0}
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-muted-foreground mb-1.5 block">Max. Price</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">NRS</span>
                            <Input
                                type="number"
                                value={maxPrice}
                                onChange={(e) => handleMaxPriceChange(e.target.value)}
                                className="h-10 pl-12 pr-3 rounded-lg bg-secondary/30 border-border/50"
                                min={0}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border/50" />

            {/* Genres */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Genres
                    </h4>
                    {selectedGenres.length > 0 && (
                        <span className="text-xs font-medium bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                            {selectedGenres.length}
                        </span>
                    )}
                </div>
                <div className="space-y-1.5 max-h-[280px] overflow-y-auto scrollbar-none">
                    {GENRES.map((genre) => {
                        const isSelected = selectedGenres.includes(genre)
                        return (
                            <div
                                key={genre}
                                onClick={() => toggleGenre(genre)}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all border
                                    ${isSelected 
                                        ? 'bg-secondary/50 border-primary/50' 
                                        : 'hover:bg-secondary/30 border-transparent'
                                    }
                                `}
                            >
                                <div className={`
                                    h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0
                                    ${isSelected 
                                        ? 'border-primary bg-primary' 
                                        : 'border-muted-foreground/40'
                                    }
                                `}>
                                    {isSelected && (
                                        <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                                    )}
                                </div>
                                <span className={`text-sm ${isSelected ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                                    {genre}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
                <Button
                    variant="ghost"
                    onClick={clearAllFilters}
                    className="w-full rounded-full hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                >
                    <X className="h-4 w-4 mr-2" />
                    Clear All
                </Button>
            )}
        </div>
    )


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
                        Explore our curated selection of literary treasures.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-md mx-auto mt-4 sm:mt-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search books..."
                            className="h-11 pl-11 pr-4 rounded-full border-border/60 bg-background shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </motion.div>
            </div>

            <div className="container px-4 sm:px-6 mx-auto">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-none">
                        <div className="p-5 border-l border-border/50">
                            <div className="flex items-center justify-between mb-5 pb-4 border-b border-border/50">
                                <div>
                                    <h3 className="font-serif text-xl sm:text-2xl font-medium">Filters</h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                                        {activeFilterCount > 0 ? `${activeFilterCount} active` : 'Refine results'}
                                    </p>
                                </div>
                            </div>
                            <FilterContent />
                        </div>
                    </aside>

                    {/* Mobile Filter Sheet */}
                    <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                        <SheetContent 
                            side="left" 
                            className="w-full sm:w-[400px] md:w-[420px] p-0 flex flex-col border-r border-border/50 h-[100dvh]"
                        >
                            <div className="p-4 sm:p-6 border-b border-border/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-serif font-medium">Filters</h2>
                                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                                            {activeFilterCount > 0 ? `${activeFilterCount} active` : 'Refine results'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex-1 p-4 sm:p-6 overflow-y-auto scrollbar-none">
                                <FilterContent />
                            </div>
                            
                            <div className="p-4 sm:p-6 border-t border-border/50">
                                <SheetClose asChild>
                                    <Button className="w-full h-10 sm:h-12 rounded-full text-sm sm:text-base shadow-lg shadow-primary/10 hover:scale-[1.02] transition-transform gap-2">
                                        Show {sortedBooks.length} Results <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </SheetClose>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between gap-3 mb-5 sticky top-16 sm:top-20 z-30 bg-background py-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:static sm:py-0 border-b sm:border-none border-border/50">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="lg:hidden gap-2 h-9 rounded-full hover:bg-secondary/50"
                                    onClick={() => setMobileFilterOpen(true)}
                                >
                                    <Filter className="h-4 w-4" />
                                    Filters
                                    {activeFilterCount > 0 && (
                                        <span className="h-5 min-w-5 flex items-center justify-center text-xs font-medium bg-primary text-primary-foreground rounded-full px-1.5">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">{sortedBooks.length}</span> books
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* View Toggle */}
                                <div className="hidden md:flex items-center gap-1 bg-secondary/50 rounded-full p-0.5 border border-border/50">
                                    <button
                                        className={`h-7 w-7 flex items-center justify-center rounded-full transition-colors ${viewMode === "grid" ? "bg-background" : "hover:bg-background/50"}`}
                                        onClick={() => setViewMode("grid")}
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                    </button>
                                    <button
                                        className={`h-7 w-7 flex items-center justify-center rounded-full transition-colors ${viewMode === "list" ? "bg-background" : "hover:bg-background/50"}`}
                                        onClick={() => setViewMode("list")}
                                    >
                                        <List className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Sort */}
                                <div className="relative">
                                    <select
                                        className="h-9 pl-3 pr-8 text-sm border border-border/50 rounded-full bg-background appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-primary/20"
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
                                    <SlidersHorizontal className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Books Grid */}
                        {sortedBooks.length > 0 ? (
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
                                        <Search className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground/50" />
                                    </div>
                                    <div className="space-y-1 sm:space-y-2">
                                        <h3 className="font-serif text-lg sm:text-xl font-medium">No books found</h3>
                                        <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
                                            Try adjusting your filters or search terms.
                                        </p>
                                    </div>
                                    <Button onClick={clearAllFilters} variant="outline" className="rounded-full px-6 sm:px-8 text-sm">
                                        Clear filters
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Load More */}
                        {sortedBooks.length >= 8 && (
                            <div className="mt-10 flex justify-center">
                                <Button variant="outline" className="rounded-full px-8 hover:bg-secondary/50">
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
