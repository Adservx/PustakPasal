'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { GENRES, MOODS } from '@/lib/data'
import { Loader2 } from 'lucide-react'
import { BadgeType } from '@/lib/types'

export interface BookFormData {
    title: string
    author: string
    description: string
    excerpt: string
    cover_url: string
    price_hardcover: number | null
    price_paperback: number | null
    price_ebook: number | null
    price_audiobook: number | null
    formats: string[]
    genres: string[]
    publisher: string
    pages: number | null
    isbn: string
    is_bestseller: boolean
    is_new: boolean
    badge_type: BadgeType
    mood: string[]
}

interface BookFormProps {
    mode: 'create' | 'edit'
    initialData?: Partial<BookFormData>
    onSubmit: (data: FormData) => Promise<void>
    submitLabel?: string
}

const FORMAT_OPTIONS = ['hardcover', 'paperback', 'ebook', 'audiobook']

const BADGE_OPTIONS: { value: BadgeType; label: string; emoji: string }[] = [
    { value: null, label: 'No Badge', emoji: '➖' },
    { value: 'bestseller', label: 'Bestseller', emoji: '🏆' },
    { value: 'new', label: 'New Release', emoji: '✨' },
    { value: 'trending', label: 'Trending', emoji: '🔥' },
    { value: 'featured', label: 'Featured', emoji: '⭐' },
    { value: 'limited', label: 'Limited Edition', emoji: '💎' },
    { value: 'sale', label: 'On Sale', emoji: '🏷️' },
]

export function BookForm({ mode, initialData, onSubmit, submitLabel }: BookFormProps) {
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [selectedFormats, setSelectedFormats] = useState<string[]>(
        initialData?.formats || ['paperback']
    )
    const [selectedGenres, setSelectedGenres] = useState<string[]>(
        initialData?.genres || []
    )
    const [selectedMoods, setSelectedMoods] = useState<string[]>(
        initialData?.mood || []
    )
    const [isBestseller, setIsBestseller] = useState(initialData?.is_bestseller || false)
    const [isNew, setIsNew] = useState(initialData?.is_new || false)
    const [badgeType, setBadgeType] = useState<BadgeType>(initialData?.badge_type || null)

    const toggleFormat = (format: string) => {
        setSelectedFormats(prev =>
            prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
        )
    }

    const toggleGenre = (genre: string) => {
        setSelectedGenres(prev =>
            prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
        )
    }

    const toggleMood = (mood: string) => {
        setSelectedMoods(prev =>
            prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]
        )
    }

    const validateForm = (formData: FormData): boolean => {
        const newErrors: Record<string, string> = {}
        
        const title = formData.get('title') as string
        const author = formData.get('author') as string
        
        if (!title || title.trim() === '') {
            newErrors.title = 'Title is required'
        }
        if (!author || author.trim() === '') {
            newErrors.author = 'Author is required'
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        if (loading) return // Prevent double submission
        
        const formData = new FormData(e.currentTarget)
        
        // Add array fields
        formData.set('formats', JSON.stringify(selectedFormats))
        formData.set('genres', JSON.stringify(selectedGenres))
        formData.set('mood', JSON.stringify(selectedMoods))
        formData.set('is_bestseller', String(isBestseller))
        formData.set('is_new', String(isNew))
        formData.set('badge_type', badgeType || '')
        
        if (!validateForm(formData)) {
            return
        }
        
        setLoading(true)
        try {
            await onSubmit(formData)
        } catch (error) {
            console.error('Form submission error:', error)
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                
                <div>
                    <label className="block mb-1 text-sm font-medium">Title *</label>
                    <Input
                        name="title"
                        defaultValue={initialData?.title}
                        className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                
                <div>
                    <label className="block mb-1 text-sm font-medium">Author *</label>
                    <Input
                        name="author"
                        defaultValue={initialData?.author}
                        className={errors.author ? 'border-red-500' : ''}
                    />
                    {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
                </div>
                
                <div>
                    <label className="block mb-1 text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        defaultValue={initialData?.description}
                        className="w-full p-2 border rounded dark:bg-gray-700 min-h-[100px]"
                        rows={4}
                    />
                </div>
                
                <div>
                    <label className="block mb-1 text-sm font-medium">Excerpt</label>
                    <textarea
                        name="excerpt"
                        defaultValue={initialData?.excerpt}
                        className="w-full p-2 border rounded dark:bg-gray-700"
                        rows={2}
                    />
                </div>
                
                <div>
                    <label className="block mb-1 text-sm font-medium">Cover URL</label>
                    <Input
                        name="cover_url"
                        type="url"
                        defaultValue={initialData?.cover_url}
                        placeholder="https://..."
                    />
                </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Pricing (NRS)</h3>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Hardcover</label>
                        <Input
                            name="price_hardcover"
                            type="number"
                            step="0.01"
                            defaultValue={initialData?.price_hardcover ?? ''}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Paperback</label>
                        <Input
                            name="price_paperback"
                            type="number"
                            step="0.01"
                            defaultValue={initialData?.price_paperback ?? ''}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">E-book</label>
                        <Input
                            name="price_ebook"
                            type="number"
                            step="0.01"
                            defaultValue={initialData?.price_ebook ?? ''}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Audiobook</label>
                        <Input
                            name="price_audiobook"
                            type="number"
                            step="0.01"
                            defaultValue={initialData?.price_audiobook ?? ''}
                        />
                    </div>
                </div>
            </div>

            {/* Formats */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Available Formats</h3>
                <div className="flex flex-wrap gap-4">
                    {FORMAT_OPTIONS.map(format => (
                        <div key={format} className="flex items-center space-x-2">
                            <Checkbox
                                id={`format-${format}`}
                                checked={selectedFormats.includes(format)}
                                onCheckedChange={() => toggleFormat(format)}
                            />
                            <label htmlFor={`format-${format}`} className="text-sm capitalize cursor-pointer">
                                {format}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Genres */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                    {GENRES.map(genre => (
                        <button
                            key={genre}
                            type="button"
                            onClick={() => toggleGenre(genre)}
                            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                                selectedGenres.includes(genre)
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-secondary/50 border-border hover:bg-secondary'
                            }`}
                        >
                            {genre}
                        </button>
                    ))}
                </div>
            </div>

            {/* Moods */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Moods</h3>
                <div className="flex flex-wrap gap-2">
                    {MOODS.map(mood => (
                        <button
                            key={mood.name}
                            type="button"
                            onClick={() => toggleMood(mood.name)}
                            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                                selectedMoods.includes(mood.name)
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-secondary/50 border-border hover:bg-secondary'
                            }`}
                        >
                            {mood.emoji} {mood.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Publishing Details */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Publishing Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Publisher</label>
                        <Input
                            name="publisher"
                            defaultValue={initialData?.publisher}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Pages</label>
                        <Input
                            name="pages"
                            type="number"
                            defaultValue={initialData?.pages ?? ''}
                        />
                    </div>
                </div>
                
                <div>
                    <label className="block mb-1 text-sm font-medium">ISBN</label>
                    <Input
                        name="isbn"
                        defaultValue={initialData?.isbn}
                    />
                </div>
            </div>

            {/* Status Badge */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Status Badge</h3>
                
                {/* Badge Selection - Visual Buttons */}
                <div>
                    <label className="block mb-3 text-sm font-medium">Select a badge to display on the book card</label>
                    <div className="flex flex-wrap gap-2">
                        {BADGE_OPTIONS.map(option => (
                            <button
                                key={option.value ?? 'none'}
                                type="button"
                                onClick={() => setBadgeType(option.value)}
                                className={`px-3 py-2 rounded-lg text-sm border-2 transition-all duration-200 flex items-center gap-2 ${
                                    badgeType === option.value
                                        ? 'border-accent bg-accent/10 text-accent font-medium ring-2 ring-accent/20'
                                        : 'border-border bg-secondary/30 hover:bg-secondary/50 hover:border-accent/50'
                                }`}
                            >
                                <span className="text-base">{option.emoji}</span>
                                <span>{option.label}</span>
                            </button>
                        ))}
                    </div>
                    {badgeType && (
                        <div className="mt-3 p-3 rounded-lg bg-accent/5 border border-accent/20">
                            <p className="text-sm text-accent font-medium">
                                ✓ Badge "{BADGE_OPTIONS.find(o => o.value === badgeType)?.label}" will be displayed on this book
                            </p>
                            <button
                                type="button"
                                onClick={() => setBadgeType(null)}
                                className="text-xs text-muted-foreground hover:text-destructive mt-1 underline"
                            >
                                Remove badge
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Legacy Status Flags - Hidden section */}
            <div className="space-y-4 opacity-50">
                <h3 className="text-sm font-medium border-b pb-2 text-muted-foreground">Legacy Status (deprecated)</h3>
                <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="is_bestseller"
                            checked={isBestseller}
                            onCheckedChange={(checked) => setIsBestseller(checked === true)}
                        />
                        <label htmlFor="is_bestseller" className="text-sm cursor-pointer text-muted-foreground">
                            Bestseller
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="is_new"
                            checked={isNew}
                            onCheckedChange={(checked) => setIsNew(checked === true)}
                        />
                        <label htmlFor="is_new" className="text-sm cursor-pointer text-muted-foreground">
                            New Release
                        </label>
                    </div>
                </div>
            </div>

            <Button 
                type="submit" 
                disabled={loading} 
                className={`w-full ${mode === 'edit' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}`}
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {mode === 'create' ? 'Creating...' : 'Updating...'}
                    </>
                ) : (
                    submitLabel || (mode === 'create' ? 'Create Book' : 'Update Book')
                )}
            </Button>
        </form>
    )
}
