"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { CategoryBookSlider } from "./CategoryBookSlider"
import { Book } from "@/lib/types"

interface BookShowcaseProps {
  books: Book[]
}

// Category configurations with custom styling
const CATEGORY_CONFIG = [
  {
    key: 'bestseller',
    title: 'Bestsellers',
    subtitle: 'Most loved by our readers',
    filter: (book: Book) => book.isBestseller,
    href: '/books?bestseller=true'
  },
  {
    key: 'new',
    title: 'New Arrivals',
    subtitle: 'Fresh from the publishers',
    filter: (book: Book) => book.isNew || new Date(book.publishDate) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    href: '/books?sort=newest'
  },
  {
    key: 'fiction',
    title: 'Popular Fiction',
    subtitle: 'Stories that captivate your imagination',
    filter: (book: Book) => book.genres?.some(g =>
      ['Fiction', 'Literary Fiction', 'Contemporary Fiction', 'Romance', 'Thriller', 'Mystery'].includes(g)
    ),
    href: '/books?genre=Fiction'
  },
  {
    key: 'nonfiction',
    title: 'Non-Fiction Picks',
    subtitle: 'Knowledge that transforms',
    filter: (book: Book) => book.genres?.some(g =>
      ['Non-Fiction', 'Self-Help', 'Biography', 'History', 'Science', 'Business'].includes(g)
    ),
    href: '/books?genre=Non-Fiction'
  },
  {
    key: 'fantasy',
    title: 'Fantasy & Sci-Fi',
    subtitle: 'Explore worlds beyond imagination',
    filter: (book: Book) => book.genres?.some(g =>
      ['Fantasy', 'Science Fiction', 'Sci-Fi', 'Dystopian', 'Magic Realism'].includes(g)
    ),
    href: '/books?genre=Fantasy'
  },
  {
    key: 'toprated',
    title: 'Highly Rated',
    subtitle: 'Reader favorites with stellar reviews',
    filter: (book: Book) => (book.rating || 0) >= 4.5,
    href: '/books?sort=rating'
  },
]

export function BookShowcase({ books }: BookShowcaseProps) {
  // Organize books by category
  const categorizedBooks = useMemo(() => {
    return CATEGORY_CONFIG.map(category => ({
      ...category,
      books: books.filter(category.filter).slice(0, 12)
    })).filter(category => category.books.length >= 3) // Only show categories with at least 3 books
  }, [books])

  // If no specific categories have enough books, show a general "Trending Now" section
  const showFallback = categorizedBooks.length === 0

  return (
    <div className="bg-secondary/20 border-y border-border/30">
      {/* Section Intro */}
      <section className="py-10 sm:py-14 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-4 sm:mb-8"
          >
            <div className="flex items-center gap-2 sm:gap-4 justify-center mb-4 sm:mb-6">
              <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-border" />
              <span className="text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground font-medium whitespace-nowrap">
                Explore Our Collection
              </span>
              <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-border" />
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto font-light">
              Discover books curated for every taste. Scroll through our handpicked selections.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Sliders */}
      {showFallback ? (
        <CategoryBookSlider
          title="Trending Now"
          subtitle="Popular picks from our collection"
          books={books.slice(0, 12)}
          href="/books"
        />
      ) : (
        <div className="space-y-4 sm:space-y-8 md:space-y-12 pb-8 sm:pb-12 md:pb-16">
          {categorizedBooks.map((category, index) => (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1 }}
            >
              <CategoryBookSlider
                title={category.title}
                subtitle={category.subtitle}
                books={category.books}
                href={category.href}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
