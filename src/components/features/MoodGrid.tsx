"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { MOODS } from "@/lib/data"
import { useRouter } from "next/navigation"

export function MoodGrid() {
  const router = useRouter()

  return (
    <section className="py-6 sm:py-10 md:py-16 relative z-10">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-4 sm:mb-6 md:mb-8 gap-2 sm:gap-4">
          <div className="space-y-0.5 sm:space-y-1 text-center md:text-left">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif font-medium">Find your vibe</h2>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-md font-light">
              Literature matched to your emotional landscape.
            </p>
          </div>
          <Button variant="link" className="text-foreground gap-1.5 group text-xs sm:text-sm p-0 h-auto" onClick={() => router.push('/books')}>
            View all collections
            <ArrowRight className="w-3 sm:w-3.5 h-3 sm:h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-start">
          {MOODS.slice(0, 8).map((mood, i) => (
            <motion.button
              key={mood.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-full px-2.5 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 border border-border/50 bg-secondary/30 hover:bg-secondary/60 transition-all duration-300 shadow-sm hover:shadow-md"
              onClick={() => router.push(`/books?mood=${encodeURIComponent(mood.name)}`)}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r ${mood.color} transition-opacity duration-300`} />
              <span className="text-sm sm:text-base relative z-10">{mood.emoji}</span>
              <span className="text-[11px] sm:text-xs font-medium text-foreground relative z-10">{mood.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
