import { Suspense } from "react"
import nextDynamic from "next/dynamic"
import { getBooks } from "@/lib/supabase/books-server"
import { Book } from "@/lib/types"
import { CollectionLoadingSkeleton } from "@/components/ui/loading-spinner"

// Force dynamic rendering since we fetch from Supabase
export const dynamic = 'force-dynamic'

// Dynamic imports for client components - reduces initial bundle
const HeroSection = nextDynamic(
  () => import("@/components/features/HeroSection").then(mod => ({ default: mod.HeroSection })),
  {
    loading: () => <HeroSkeleton />,
    ssr: true
  }
)

const MoodGrid = nextDynamic(
  () => import("@/components/features/MoodGrid").then(mod => ({ default: mod.MoodGrid })),
  { ssr: true }
)

const BookShowcase = nextDynamic(
  () => import("@/components/features/BookShowcase").then(mod => ({ default: mod.BookShowcase })),
  {
    loading: () => <CollectionLoadingSkeleton />,
    ssr: true
  }
)



// Lightweight skeleton components
function HeroSkeleton() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 sm:pt-24 md:pt-32 lg:pt-40 pb-6 sm:pb-10 px-3 sm:px-4">
      <div className="container mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-8 md:gap-12 lg:gap-24 items-center">
          <div className="space-y-4 sm:space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="h-6 w-48 bg-secondary/50 rounded-full animate-pulse mx-auto lg:mx-0" />
            <div className="space-y-3">
              <div className="h-16 sm:h-20 md:h-24 w-64 bg-secondary/50 rounded-lg animate-pulse mx-auto lg:mx-0" />
              <div className="h-16 sm:h-20 md:h-24 w-48 bg-secondary/50 rounded-lg animate-pulse mx-auto lg:mx-0" />
            </div>
            <div className="h-6 w-full max-w-lg bg-secondary/30 rounded animate-pulse mx-auto lg:mx-0" />
          </div>
          <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="aspect-[2/3] w-[140px] xs:w-[180px] sm:w-[240px] md:w-[320px] lg:w-[380px] bg-secondary/50 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}

// Server Component - fetches data on server
async function getHomePageData(): Promise<Book[]> {
  try {
    return await getBooks()
  } catch (error) {
    console.error("Failed to fetch books:", error)
    return []
  }
}

export default async function Home() {
  const books = await getHomePageData()
  const featuredBook = books[0] || null

  return (
    <div className="min-h-screen bg-background selection:bg-accent/30 overflow-x-clip">
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection featuredBook={featuredBook} />
      </Suspense>

      <Suspense>
        <MoodGrid />
      </Suspense>

      <Suspense fallback={<CollectionLoadingSkeleton />}>
        <BookShowcase books={books} />
      </Suspense>


    </div>
  )
}
