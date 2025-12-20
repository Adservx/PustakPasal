"use client"

import { motion, useMotionValue, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, MapPin, Phone, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Book } from "@/lib/types"

// Helper to validate if a URL is properly formatted
function isValidImageUrl(url: string | undefined | null): boolean {
  if (!url) return false
  try {
    const parsedUrl = new URL(url)
    // Check if it has a valid hostname (not just "images" or similar)
    return parsedUrl.hostname.includes('.') || parsedUrl.hostname === 'localhost'
  } catch {
    return false
  }
}

// Default placeholder for books without valid covers
const PLACEHOLDER_COVER = "/placeholder-book.svg"

function HeroBook({ book }: { book: Book }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Validate the cover URL
  const coverUrl = isValidImageUrl(book.coverUrl) ? book.coverUrl : PLACEHOLDER_COVER
  const hasValidCover = isValidImageUrl(book.coverUrl)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left - width / 2)
    mouseY.set(clientY - top - height / 2)
  }

  return (
    <motion.div
      className="relative perspective-1000 cursor-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0)
        mouseY.set(0)
      }}
      initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
      animate={{ opacity: 1, scale: 1, rotateY: -6 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      <motion.div
        style={{
          rotateX: useTransform(mouseY, [-300, 300], [15, -15]),
          rotateY: useTransform(mouseX, [-300, 300], [-15, 15]),
        }}
        className="relative z-10 transform-style-3d transition-transform duration-100 ease-out"
      >
        <div className="relative aspect-[2/3] w-[100px] xs:w-[120px] sm:w-[160px] md:w-[220px] lg:w-[280px] xl:w-[340px] rounded-lg shadow-2xl overflow-hidden border-2 md:border-4 border-white/5">
          {hasValidCover ? (
            <Image
              src={coverUrl}
              alt={book.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 475px) 140px, (max-width: 640px) 180px, (max-width: 768px) 240px, (max-width: 1024px) 320px, 380px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
              <BookOpen className="w-16 h-16 md:w-24 md:h-24 text-amber-400 mb-4" />
              <p className="text-white font-serif text-center text-sm md:text-lg font-medium line-clamp-2">{book.title}</p>
              <p className="text-gray-400 text-xs md:text-sm mt-2">{book.author}</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-50 pointer-events-none mix-blend-overlay" />
        </div>
        <div className="absolute -z-10 top-10 -right-10 w-full h-full bg-accent/20 blur-3xl rounded-full animate-pulse" />
      </motion.div>
    </motion.div>
  )
}

interface HeroSectionProps {
  featuredBook: Book | null
}

export function HeroSection({ featuredBook }: HeroSectionProps) {
  const router = useRouter()

  return (
    <section className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center pt-24 xs:pt-28 sm:pt-28 md:pt-32 lg:pt-36 pb-4 sm:pb-6 md:pb-10 px-3 sm:px-4 md:px-6 overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px] animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="container mx-auto relative z-10 px-3 xs:px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Single row: Text Left, Image Right */}
        <div className="flex flex-col lg:flex-row items-center gap-4 xs:gap-6 sm:gap-10 lg:gap-14 xl:gap-20">

          {/* Left: Typography */}
          <motion.div
            className="flex-1 space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6 text-center lg:text-left order-2 lg:order-1 w-full relative z-20"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-full border border-border/50 bg-white/5 backdrop-blur-sm text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-medium text-muted-foreground"
            >
              <Sparkles className="w-2.5 xs:w-3 sm:w-3.5 h-2.5 xs:h-3 sm:h-3.5 text-accent" />
              <span className="hidden xs:inline">Reimagining the Digital Bookstore</span>
              <span className="xs:hidden">Digital Bookstore</span>
            </motion.div>

            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-medium leading-[0.95] tracking-tight">
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="block text-gradient"
              >
                Curating
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="block text-gradient-accent italic"
              >
                Wonder.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-xs xs:text-sm sm:text-base md:text-lg text-muted-foreground/80 max-w-md mx-auto lg:mx-0 leading-relaxed font-light px-1 xs:px-0"
            >
              Step into a sanctuary of stories. From timeless classics to modern masterpieces, find the book that speaks to your soul.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col xs:flex-row gap-2 xs:gap-2.5 sm:gap-3 justify-center lg:justify-start pt-1 sm:pt-3 w-full px-1 xs:px-0"
            >
              <Button
                size="lg"
                className="h-10 xs:h-11 sm:h-12 px-5 xs:px-6 sm:px-8 rounded-full text-xs xs:text-sm sm:text-base bg-foreground text-background hover:bg-foreground/90 hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl shadow-foreground/20 w-full xs:w-auto"
                onClick={() => router.push('/books')}
              >
                Start Journey
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-10 xs:h-11 sm:h-12 px-5 xs:px-6 sm:px-8 rounded-full text-xs xs:text-sm sm:text-base border-border/50 hover:bg-secondary/50 backdrop-blur-sm hover:border-foreground/20 hover:scale-105 active:scale-95 transition-all duration-300 w-full xs:w-auto"
                onClick={() => router.push('/books?bestseller=true')}
              >
                The Collection
              </Button>
            </motion.div>

            {/* Branch Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="pt-4 xs:pt-6 sm:pt-8 mt-2 xs:mt-3 sm:mt-4"
            >
              <p className="text-[9px] xs:text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 xs:mb-3 text-center lg:text-left">Visit Our Locations</p>
              <div className="grid grid-cols-2 gap-2 xs:gap-2.5 sm:gap-3 max-w-xs xs:max-w-sm mx-auto lg:mx-0">
                <div className="group relative p-2 xs:p-2.5 sm:p-3 rounded-lg xs:rounded-xl glass-card hover:border-accent/30 transition-all duration-300">
                  <div className="flex items-start gap-1.5 xs:gap-2">
                    <div className="p-1.5 xs:p-2 rounded-lg bg-background/50 shadow-sm group-hover:scale-110 transition-transform">
                      <MapPin className="w-3 xs:w-3.5 sm:w-4 h-3 xs:h-3.5 sm:h-4 text-accent" />
                    </div>
                    <div className="space-y-0.5 xs:space-y-1 min-w-0 text-left flex-1">
                      <h4 className="font-semibold text-xs sm:text-sm text-foreground">Kathmandu</h4>
                      <div className="flex items-center gap-1 xs:gap-1.5 text-[10px] xs:text-xs text-muted-foreground">
                        <Phone className="w-2.5 xs:w-3 h-2.5 xs:h-3 flex-shrink-0" />
                        <span className="truncate">+977 1-4567890</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="group relative p-2 xs:p-2.5 sm:p-3 rounded-lg xs:rounded-xl glass-card hover:border-accent/30 transition-all duration-300">
                  <div className="flex items-start gap-2 xs:gap-3">
                    <div className="p-1.5 xs:p-2 rounded-lg bg-background/50 shadow-sm group-hover:scale-110 transition-transform">
                      <MapPin className="w-3 xs:w-3.5 sm:w-4 h-3 xs:h-3.5 sm:h-4 text-accent" />
                    </div>
                    <div className="space-y-0.5 xs:space-y-1 min-w-0 text-left flex-1">
                      <h4 className="font-semibold text-xs sm:text-sm text-foreground">Birganj</h4>
                      <div className="flex items-center gap-1 xs:gap-1.5 text-[10px] xs:text-xs text-muted-foreground">
                        <Phone className="w-2.5 xs:w-3 h-2.5 xs:h-3 flex-shrink-0" />
                        <span className="truncate">+977 51-234567</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Hero Book Image */}
          <div className="relative flex justify-center lg:justify-end order-1 lg:order-2 flex-shrink-0 mb-2 xs:mb-0">
            {featuredBook && <HeroBook book={featuredBook} />}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground/50"
      >
        <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-current to-transparent" />
      </motion.div>
    </section>
  )
}
