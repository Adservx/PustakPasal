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

const GatewaySection = nextDynamic(
  () => import("@/components/features/GatewaySection").then(mod => ({ default: mod.GatewaySection })),
  { ssr: true }
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
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-6">
      <div className="container mx-auto relative z-10 max-w-6xl">
        <div className="text-center space-y-6 sm:space-y-8 md:space-y-10">
          <div className="h-8 w-64 bg-secondary/50 rounded-full animate-pulse mx-auto" />
          <div className="space-y-4">
            <div className="h-12 sm:h-16 md:h-20 w-72 bg-secondary/50 rounded-lg animate-pulse mx-auto" />
            <div className="h-12 sm:h-16 md:h-20 w-56 bg-secondary/50 rounded-lg animate-pulse mx-auto" />
          </div>
          <div className="h-6 w-full max-w-2xl bg-secondary/30 rounded animate-pulse mx-auto" />
          <div className="h-6 w-3/4 max-w-xl bg-secondary/30 rounded animate-pulse mx-auto" />
          <div className="flex gap-4 justify-center pt-4">
            <div className="h-12 w-48 bg-secondary/50 rounded-full animate-pulse" />
            <div className="h-12 w-40 bg-secondary/30 rounded-full animate-pulse" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-6 rounded-2xl bg-secondary/20 animate-pulse">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary/50" />
                  <div className="h-4 w-24 bg-secondary/50 rounded" />
                  <div className="h-3 w-32 bg-secondary/30 rounded" />
                </div>
              </div>
            ))}
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

  return (
    <div className="min-h-screen bg-background selection:bg-accent/30 overflow-x-clip">
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      <Suspense>
        <GatewaySection />
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
