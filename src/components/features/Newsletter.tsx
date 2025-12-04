"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Coffee } from "lucide-react"

export function Newsletter() {
  return (
    <section className="py-12 sm:py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto text-center relative z-10 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass-card rounded-3xl p-6 sm:p-10 md:p-16 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />

          <div className="relative z-10 space-y-4 sm:space-y-6 md:space-y-8">
            <Coffee className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 mx-auto text-accent/80 mb-4 sm:mb-6 md:mb-8" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground">
              Stay in the loop.
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-light max-w-lg mx-auto">
              Join 10,000+ readers receiving our weekly curation of literary gems.
            </p>

            <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto pt-4 sm:pt-6" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="email@example.com"
                className="flex-1 h-11 sm:h-12 px-4 sm:px-6 rounded-full bg-background/50 border border-border focus:border-accent/50 focus:ring-1 focus:ring-accent/50 focus:outline-none transition-all text-center sm:text-left text-sm sm:text-base placeholder:text-muted-foreground/50"
              />
              <Button size="lg" className="h-11 sm:h-12 px-6 sm:px-8 rounded-full bg-foreground text-background hover:bg-foreground/90 hover:scale-105 transition-all duration-300 shadow-xl shadow-foreground/10 text-sm sm:text-base">
                Subscribe
              </Button>
            </form>
          </div>
        </motion.div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-[0.02] pointer-events-none select-none whitespace-nowrap">
        <span className="text-[25vw] sm:text-[20vw] font-serif font-bold">HAMRO PUSTAK</span>
      </div>
    </section>
  )
}
