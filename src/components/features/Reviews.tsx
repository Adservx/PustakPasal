'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Reviews({ bookId }: { bookId: string }) {
    const [reviews, setReviews] = useState<any[]>([])
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')
    const [user, setUser] = useState<any>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        fetchReviews()
        checkUser()
    }, [bookId])

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
    }

    const fetchReviews = async () => {
        const { data } = await supabase
            .from('reviews')
            .select('*, profiles(full_name, avatar_url)')
            .eq('book_id', bookId)
            .order('created_at', { ascending: false })
        if (data) setReviews(data)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return alert('Please login to review')

        setIsSubmitting(true)
        const { error } = await supabase.from('reviews').insert({
            book_id: bookId,
            user_id: user.id,
            rating,
            comment
        })

        setIsSubmitting(false)
        if (error) {
            alert(error.message)
        } else {
            setComment('')
            setRating(5)
            fetchReviews()
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-border/50"
        >
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium font-serif mb-4 sm:mb-6">Reviews</h2>

            {user ? (
                <form onSubmit={handleSubmit} className="mb-6 sm:mb-8 p-3 sm:p-4 md:p-6 bg-secondary/30 rounded-lg sm:rounded-xl">
                    <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Write a Review</h3>
                    <div className="flex gap-1 sm:gap-2 mb-3 sm:mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`focus:outline-none transition-colors ${star <= rating ? 'text-yellow-400' : 'text-muted-foreground/30'}`}
                            >
                                <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                            </button>
                        ))}
                    </div>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-2.5 sm:p-3 rounded-lg border border-border/50 bg-background/50 text-sm sm:text-base mb-3 sm:mb-4 focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-all resize-none"
                        placeholder="Share your thoughts..."
                        rows={3}
                        required
                    />
                    <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="h-9 sm:h-10 px-4 sm:px-6 text-sm rounded-full"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                </form>
            ) : (
                <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-secondary/30 rounded-lg sm:rounded-xl text-center">
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Please <Link href="/login" className="text-accent hover:underline font-medium">login</Link> to write a review.
                    </p>
                </div>
            )}

            <div className="space-y-4 sm:space-y-6">
                {reviews.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="border-b border-border/50 pb-4 sm:pb-6 last:border-0">
                            <div className="flex items-start gap-3 sm:gap-4 mb-2">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary overflow-hidden flex-shrink-0">
                                    <img 
                                        src={review.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${review.profiles?.full_name || 'User'}&background=random`} 
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm sm:text-base truncate">{review.profiles?.full_name || 'Anonymous'}</p>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${i < review.rating ? 'fill-current' : 'text-muted-foreground/30'}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pl-11 sm:pl-14">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </motion.div>
    )
}
