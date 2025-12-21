'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { GENRES, MOODS } from '@/lib/data'
import { Loader2, Camera, Image as ImageIcon, X } from 'lucide-react'
import { BadgeType } from '@/lib/types'
import { CameraCapture } from './CameraCapture'

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
    const [showCamera, setShowCamera] = useState(false)
    const [capturedImage, setCapturedImage] = useState<string | null>(null)
    const [coverUrlInput, setCoverUrlInput] = useState(initialData?.cover_url || '')

    // Sync state with initialData when it changes (important for edit mode)
    useEffect(() => {
        if (initialData) {
            setSelectedFormats(initialData.formats || ['paperback'])
            setSelectedGenres(initialData.genres || [])
            setSelectedMoods(initialData.mood || [])
            setIsBestseller(initialData.is_bestseller || false)
            setIsNew(initialData.is_new || false)
            setBadgeType(initialData.badge_type || null)
            setCoverUrlInput(initialData.cover_url || '')
        }
    }, [initialData])

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

    const handleCameraCapture = (imageDataUrl: string) => {
        setCapturedImage(imageDataUrl)
        setCoverUrlInput('') // Clear URL input when using camera
    }

    const clearCapturedImage = () => {
        setCapturedImage(null)
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
        
        // Handle captured image - if we have a captured image, include it
        if (capturedImage) {
            formData.set('captured_image', capturedImage)
        }
        
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
                
                {/* Book Cover Section */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium">Book Cover</label>
                    
                    {/* Captured Image Preview */}
                    {capturedImage && (
                        <div className="relative inline-block">
                            <img
                                src={capturedImage}
                                alt="Captured book cover"
                                className="w-40 h-56 object-cover rounded-lg border-2 border-accent shadow-lg"
                            />
                            <button
                                type="button"
                                onClick={clearCapturedImage}
                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <p className="text-xs text-muted-foreground mt-2 text-center">
                                📸 Captured from camera
                            </p>
                        </div>
                    )}
                    
                    {/* Camera and URL Options */}
                    {!capturedImage && (
                        <div className="space-y-3">
                            {/* Camera Capture Button */}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowCamera(true)}
                                className="w-full h-24 border-2 border-dashed border-accent/50 hover:border-accent hover:bg-accent/5 transition-all"
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <Camera className="h-8 w-8 text-accent" />
                                    <span className="text-sm font-medium">Take Photo of Book Cover</span>
                                </div>
                            </Button>
                            
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-border" />
                                <span className="text-xs text-muted-foreground">OR</span>
                                <div className="flex-1 h-px bg-border" />
                            </div>
                            
                            {/* URL Input */}
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        name="cover_url"
                                        type="url"
                                        value={coverUrlInput}
                                        onChange={(e) => setCoverUrlInput(e.target.value)}
                                        placeholder="Enter image URL..."
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            
                            {/* URL Preview */}
                            {coverUrlInput && (
                                <div className="relative inline-block">
                                    <img
                                        src={coverUrlInput}
                                        alt="Cover preview"
                                        className="w-32 h-44 object-cover rounded-lg border shadow"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none'
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
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
                {/* Show currently selected genres that aren't in the predefined list */}
                {selectedGenres.filter(g => !GENRES.includes(g)).length > 0 && (
                    <div className="mb-2">
                        <p className="text-xs text-muted-foreground mb-1">Currently selected (legacy):</p>
                        <div className="flex flex-wrap gap-2">
                            {selectedGenres.filter(g => !GENRES.includes(g)).map(genre => (
                                <button
                                    key={genre}
                                    type="button"
                                    onClick={() => toggleGenre(genre)}
                                    className="px-3 py-1 rounded-full text-sm border bg-primary text-primary-foreground border-primary"
                                >
                                    {genre} ✕
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <div className="flex flex-wrap gap-2">
                    {GENRES.map(genre => (
                        <button
                            key={genre}
                            type="button"
                            onClick={() => toggleGenre(genre)}
                            className={`px-3 py-1 rounded-full text-sm border transition-colors flex items-center gap-1 ${
                                selectedGenres.includes(genre)
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-secondary/50 border-border hover:bg-secondary'
                            }`}
                        >
                            {selectedGenres.includes(genre) && <span>✓</span>}
                            {genre}
                        </button>
                    ))}
                </div>
            </div>

            {/* Moods */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Moods</h3>
                {/* Show currently selected moods that aren't in the predefined list */}
                {selectedMoods.filter(m => !MOODS.find(mood => mood.name === m)).length > 0 && (
                    <div className="mb-2">
                        <p className="text-xs text-muted-foreground mb-1">Currently selected (legacy):</p>
                        <div className="flex flex-wrap gap-2">
                            {selectedMoods.filter(m => !MOODS.find(mood => mood.name === m)).map(mood => (
                                <button
                                    key={mood}
                                    type="button"
                                    onClick={() => toggleMood(mood)}
                                    className="px-3 py-1 rounded-full text-sm border bg-primary text-primary-foreground border-primary"
                                >
                                    {mood} ✕
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <div className="flex flex-wrap gap-2">
                    {MOODS.map(mood => (
                        <button
                            key={mood.name}
                            type="button"
                            onClick={() => toggleMood(mood.name)}
                            className={`px-3 py-1 rounded-full text-sm border transition-colors flex items-center gap-1 ${
                                selectedMoods.includes(mood.name)
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-secondary/50 border-border hover:bg-secondary'
                            }`}
                        >
                            {selectedMoods.includes(mood.name) && <span>✓</span>}
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

            {/* Camera Capture Modal */}
            {showCamera && (
                <CameraCapture
                    onCapture={handleCameraCapture}
                    onClose={() => setShowCamera(false)}
                />
            )}
        </form>
    )
}
