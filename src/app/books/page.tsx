import { Suspense } from "react"
import { BooksContent } from "./books-content"

// Loading skeleton for the books page
function BooksPageSkeleton() {
    return (
        <div className="min-h-screen bg-background pt-40 pb-20">
            <div className="container px-4 mx-auto mb-12">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <div className="h-16 w-96 bg-secondary/50 rounded-lg animate-pulse mx-auto" />
                    <div className="h-6 w-full max-w-2xl bg-secondary/30 rounded animate-pulse mx-auto" />
                    <div className="h-14 w-full max-w-xl bg-secondary/50 rounded-full animate-pulse mx-auto mt-8" />
                </div>
            </div>
            <div className="container px-4 mx-auto">
                <div className="flex flex-col lg:flex-row gap-12">
                    <aside className="hidden lg:block lg:w-64 space-y-8">
                        <div className="h-40 bg-secondary/30 rounded-lg animate-pulse" />
                        <div className="h-60 bg-secondary/30 rounded-lg animate-pulse" />
                    </aside>
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="aspect-[2/3] bg-secondary/50 rounded-xl animate-pulse" />
                                    <div className="space-y-2">
                                        <div className="h-5 w-3/4 bg-secondary/50 rounded animate-pulse" />
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

export default function BooksPage() {
    return (
        <Suspense fallback={<BooksPageSkeleton />}>
            <BooksContent />
        </Suspense>
    )
}
