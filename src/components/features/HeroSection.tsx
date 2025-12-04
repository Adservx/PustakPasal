"use client"

import { motion, useScroll, useTransform, useMotionValue } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, MapPin, Phone } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Book } from "@/lib/types"

function HeroBook({ book }: { book: Book }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

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
        <div className="relative aspect-[2/3] w-[140px] xs:w-[180px] sm:w-[240px] md:w-[320px] lg:w-[380px] rounded-lg shadow-2xl overflow-hidden border-2 md:border-4 border-white/5">
          <Image
            src={book.coverUrl}
            alt={book.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 475px) 140px, (max-width: 640px) 180px, (max-width: 768px) 240px, (max-width: 1024px) 320px, 380px"
          />
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
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 1000], [0, 200])

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 sm:pt-24 md:pt-32 lg:pt-40 pb-6 sm:pb-10 px-3 sm:px-4">
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px] animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="container mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-8 md:gap-12 lg:gap-24 items-center">
          {/* Typography */}
          <motion.div
            style={{ y: y1 }}
            className="space-y-4 sm:space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full border border-border/50 bg-white/5 backdrop-blur-sm text-[10px] sm:text-xs md:text-sm font-medium text-muted-foreground"
            >
              <Sparkles className="w-2.5 sm:w-3 md:w-3.5 h-2.5 sm:h-3 md:h-3.5 text-accent" />
              <span className="hidden sm:inline">Reimagining the Digital Bookstore</span>
              <span className="sm:hidden">Digital Bookstore</span>
            </motion.div>

            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-medium leading-[0.95] md:leading-[0.9] tracking-tight text-balance">
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
              className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground/80 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light px-2 sm:px-0"
            >
              Step into a sanctuary of stories. From timeless classics to modern masterpieces, find the book that speaks to your soul.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4 justify-center lg:justify-start pt-2 sm:pt-4 px-2 sm:px-0"
            >
              <Button
                size="lg"
                className="h-10 sm:h-12 md:h-14 px-6 sm:px-8 md:px-10 rounded-full text-xs sm:text-sm md:text-base bg-foreground text-background hover:bg-foreground/90 hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl shadow-foreground/20 w-full sm:w-auto"
                onClick={() => router.push('/books')}
              >
                Start Journey
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-10 sm:h-12 md:h-14 px-6 sm:px-8 md:px-10 rounded-full text-xs sm:text-sm md:text-base border-border/50 hover:bg-secondary/50 backdrop-blur-sm hover:border-foreground/20 hover:scale-105 active:scale-95 transition-all duration-300 w-full sm:w-auto"
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
              className="pt-6 sm:pt-8 md:pt-12 mt-6 sm:mt-8 mx-2 sm:mx-0"
            >
              <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 sm:mb-4">Visit Our Locations</p>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                <div className="group relative p-3 sm:p-4 rounded-xl glass-card hover:border-accent/30 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-background/50 shadow-sm group-hover:scale-110 transition-transform">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm text-foreground">Kathmandu</h4>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">+977 1-4567890</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="group relative p-3 sm:p-4 rounded-xl glass-card hover:border-accent/30 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-background/50 shadow-sm group-hover:scale-110 transition-transform">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm text-foreground">Birganj</h4>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">+977 51-234567</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual */}
          <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
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
