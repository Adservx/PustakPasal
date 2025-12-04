"use client"

import { AnimatedBookCard } from "@/components/features/AnimatedBookCard"
import { Book } from "@/lib/types"

interface BookShowcaseProps {
  books: Book[]
}

export function BookShowcase({ books }: BookShowcaseProps) {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-secondary/30 border-y border-border/50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-4 mb-8 sm:mb-12 md:mb-16">
          <div className="h-[1px] flex-1 bg-border" />
          <span className="text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground font-medium whitespace-nowrap">Trending Now</span>
          <div className="h-[1px] flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-8 sm:gap-y-10 md:gap-y-12">
          {books.slice(0, 4).map((book, i) => (
            <AnimatedBookCard key={book.id} book={book} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
