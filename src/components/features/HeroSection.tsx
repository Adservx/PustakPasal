"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BookOpen, Mouse, Hand } from "lucide-react"
import { useRouter } from "next/navigation"

// Desktop scroll indicator component (between buttons)
function DesktopScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="hidden sm:flex flex-col items-center px-4 py-3 rounded-xl border border-muted-foreground/20 bg-white/5 backdrop-blur-sm"
    >
      <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-2">
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60"
        />
      </div>
      <motion.div
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="mt-2"
      >
        <Mouse className="w-4 h-4 text-muted-foreground/50" />
      </motion.div>
      <span className="text-[10px] text-muted-foreground/50 mt-1 font-medium tracking-wide uppercase">
        Scroll
      </span>
    </motion.div>
  )
}

// Mobile scroll indicator component (below buttons)
function MobileScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="flex sm:hidden flex-col items-center mt-1"
    >
      <div className="flex flex-col items-center px-3 py-2 rounded-lg border border-muted-foreground/20 bg-white/5 backdrop-blur-sm">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-1.5 overflow-hidden">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Hand className="w-3 h-3 text-muted-foreground/60 rotate-180" />
            </motion.div>
          </div>
        </motion.div>
        <span className="text-[9px] text-muted-foreground/50 mt-1.5 font-medium tracking-wide uppercase">
          Swipe
        </span>
      </div>
    </motion.div>
  )
}

export function HeroSection() {
  const router = useRouter()

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent/8 rounded-full blur-[150px] animate-blob" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/8 rounded-full blur-[150px] animate-blob animation-delay-2000" />
        <div className="absolute top-[30%] right-[20%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-noise opacity-[0.02] mix-blend-overlay" />
      </div>

      <div className="container mx-auto relative z-10 max-w-6xl">
        {/* Main Content */}
        <div className="text-center space-y-6 sm:space-y-8 md:space-y-10">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-medium leading-[1.1] tracking-tight">
              <span className="block text-gradient">Welcome to</span>
              <span className="block text-gradient-accent italic mt-2">Hamro Pustak Pasal</span>
            </h1>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-white/5 backdrop-blur-sm"
          >
            <BookOpen className="w-4 h-4 text-accent" />
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              Your Gateway to Nepali Literature
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Discover the rich world of Nepali literature and beyond. We bring you a carefully curated collection of books that celebrate stories, culture, and the joy of reading. From timeless classics to contemporary voices, find your next favorite read with us.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-row gap-2 sm:gap-4 justify-center items-center pt-2 flex-wrap"
          >
            <Button
              size="lg"
              className="h-10 sm:h-14 px-4 sm:px-10 rounded-full text-xs sm:text-base bg-foreground text-background hover:bg-foreground/90 hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl shadow-foreground/20 border-2 border-foreground"
              onClick={() => router.push('/books')}
            >
              Explore Our Collection
            </Button>
            
            {/* Desktop: Scroll indicator between buttons */}
            <DesktopScrollIndicator />
            
            <Button
              size="lg"
              className="h-10 sm:h-14 px-4 sm:px-10 rounded-full text-xs sm:text-base bg-foreground text-background hover:bg-foreground/90 hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl shadow-foreground/20 border-2 border-foreground"
              onClick={() => router.push('/books?bestseller=true')}
            >
              View Bestsellers
            </Button>
          </motion.div>

          {/* Mobile: Scroll indicator below buttons */}
          <MobileScrollIndicator />
        </div>
      </div>
    </section>
  )
}
