import { Suspense } from "react"
import { BooksContent } from "./books-content"
import { getBooks } from "@/lib/supabase/books-server"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Loading skeleton for the books page
function BooksPageSkeleton() {
    return (
        <div className="min-h-screen bg-background pt-24 sm:pt-32 md:pt-40 pb-12 sm:pb-16 md:pb-20">
            <div className="container px-3 sm:px-4 md:px-6 mx-auto mb-8 sm:mb-10 md:mb-12">
                <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
                    <div className="h-12 sm:h-14 md:h-16 w-64 sm:w-80 md:w-96 bg-secondary/50 rounded-lg animate-pulse mx-auto" />
                    <div className="h-5 sm:h-6 w-full max-w-xl sm:max-w-2xl bg-secondary/30 rounded animate-pulse mx-auto" />
                    <div className="h-11 sm:h-12 md:h-14 w-full max-w-md sm:max-w-xl bg-secondary/50 rounded-full animate-pulse mx-auto mt-6 sm:mt-8" />
                </div>
            </div>
            <div className="container px-3 sm:px-4 md:px-6 mx-auto">
                <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-12">
                    <aside className="hidden lg:block lg:w-56 xl:w-64 space-y-6 sm:space-y-8">
                        <div className="h-40 bg-secondary/30 rounded-lg animate-pulse" />
                        <div className="h-60 bg-secondary/30 rounded-lg animate-pulse" />
                    </aside>
                    <div className="flex-1">
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="space-y-2 sm:space-y-3 md:space-y-4">
                                    <div className="aspect-[2/3] bg-secondary/50 rounded-lg sm:rounded-xl animate-pulse" />
                                    <div className="space-y-1.5 sm:space-y-2">
                                        <div className="h-4 sm:h-5 w-3/4 bg-secondary/50 rounded animate-pulse" />
                                        <div className="h-3 w-1/2 bg-secondary/30 rounded animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default async function BooksPage() {
    // Fetch books on the server
    const books = await getBooks()
    
    return (
        <Suspense fallback={<BooksPageSkeleton />}>
            <BooksContent initialBooks={books} />
        </Suspense>
    )
}
