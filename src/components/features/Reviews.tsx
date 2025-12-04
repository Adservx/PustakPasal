'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Star } from 'lucide-react'

export function Reviews({ bookId }: { bookId: string }) {
    const [reviews, setReviews] = useState<any[]>([])
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')
    const [user, setUser] = useState<any>(null)
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

        const { error } = await supabase.from('reviews').insert({
            book_id: bookId,
            user_id: user.id,
            rating,
            comment
        })

        if (error) {
            alert(error.message)
        } else {
            setComment('')
            fetchReviews()
        }
    }

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Reviews</h2>

            {user ? (
                <form onSubmit={handleSubmit} className="mb-8 p-6 bg-secondary/20 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                    <div className="flex gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`focus:outline-none ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                                <Star className="w-6 h-6 fill-current" />
                            </button>
                        ))}
                    </div>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-3 rounded-lg border dark:bg-gray-800 mb-4"
                        placeholder="Share your thoughts..."
                        rows={4}
                        required
                    />
                    <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                        Submit Review
                    </button>
                </form>
            ) : (
                <div className="mb-8 p-6 bg-secondary/20 rounded-xl text-center">
                    <p>Please <a href="/login" className="text-blue-500 hover:underline">login</a> to write a review.</p>
                </div>
            )}

            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                <img src={review.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${review.profiles?.full_name || 'User'}`} alt="Avatar" />
                            </div>
                            <div>
                                <p className="font-semibold">{review.profiles?.full_name || 'Anonymous'}</p>
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
