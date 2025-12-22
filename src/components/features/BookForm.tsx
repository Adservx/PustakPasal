'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { GENRES, MOODS } from '@/lib/data'
import { Loader2, Camera, Image as ImageIcon, X, Plus, Trash2 } from 'lucide-react'
import { CameraCapture } from './CameraCapture'
import { getStatusBadges, createStatusBadge, deleteStatusBadge, StatusBadge } from '@/app/admin/actions'

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
    badge_type: string | null
    mood: string[]
}

interface BookFormProps {
    mode: 'create' | 'edit'
    initialData?: Partial<BookFormData>
    onSubmit: (data: FormData) => Promise<void>
    submitLabel?: string
}

const FORMAT_OPTIONS = ['hardcover', 'paperback', 'ebook', 'audiobook']

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
    const [badgeType, setBadgeType] = useState<string | null>(initialData?.badge_type || null)
    const [showCamera, setShowCamera] = useState(false)
    const [capturedImage, setCapturedImage] = useState<string | null>(null)
    const [coverUrlInput, setCoverUrlInput] = useState(initialData?.cover_url || '')
    const galleryInputRef = useRef<HTMLInputElement>(null)
    
    // Status badges state
    const [statusBadges, setStatusBadges] = useState<StatusBadge[]>([])
    const [loadingBadges, setLoadingBadges] = useState(true)
    const [showCreateBadge, setShowCreateBadge] = useState(false)
    const [newBadgeLabel, setNewBadgeLabel] = useState('')
    const [newBadgeEmoji, setNewBadgeEmoji] = useState('🏷️')
    const [creatingBadge, setCreatingBadge] = useState(false)
    const [badgeError, setBadgeError] = useState<string | null>(null)

    // Fetch status badges on mount
    useEffect(() => {
        async function fetchBadges() {
            setLoadingBadges(true)
            const badges = await getStatusBadges()
            setStatusBadges(badges)
            setLoadingBadges(false)
        }
        fetchBadges()
    }, [])

    // Sync state with initialData only on initial mount (important for edit mode)
    const initialDataRef = useRef(initialData)
    useEffect(() => {
        const data = initialDataRef.current
        if (data) {
            setSelectedFormats(data.formats || ['paperback'])
            setSelectedGenres(data.genres || [])
            setSelectedMoods(data.mood || [])
            setIsBestseller(data.is_bestseller || false)
            setIsNew(data.is_new || false)
            setBadgeType(data.badge_type || null)
            setCoverUrlInput(data.cover_url || '')
        }
    }, [])

    const handleCreateBadge = async () => {
        if (!newBadgeLabel.trim()) {
            setBadgeError('Badge label is required')
            return
        }
        
        setCreatingBadge(true)
        setBadgeError(null)
        
        const formData = new FormData()
        formData.set('name', newBadgeLabel)
        formData.set('label', newBadgeLabel)
        formData.set('emoji', newBadgeEmoji)
        
        const result = await createStatusBadge(formData)
        
        if (result.success && result.badge) {
            setStatusBadges(prev => [...prev, result.badge!])
            setBadgeType(result.badge.name)
            setNewBadgeLabel('')
            setNewBadgeEmoji('🏷️')
            setShowCreateBadge(false)
        } else {
            setBadgeError(result.error || 'Failed to create badge')
        }
        
        setCreatingBadge(false)
    }

    const handleDeleteBadge = async (badge: StatusBadge) => {
        if (badge.is_default) return
        
        const result = await deleteStatusBadge(badge.id)
        
        if (result.success) {
            setStatusBadges(prev => prev.filter(b => b.id !== badge.id))
            if (badgeType === badge.name) {
                setBadgeType(null)
            }
        }
    }

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

    const handleGallerySelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            const imageDataUrl = e.target?.result as string
            setCapturedImage(imageDataUrl)
            setCoverUrlInput('')
        }
        reader.readAsDataURL(file)
        
        // Reset input so same file can be selected again
        event.target.value = ''
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
                            {/* Camera and Gallery Buttons */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* Take Photo Button */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowCamera(true)}
                                    className="h-20 border-2 border-dashed border-accent/50 hover:border-accent hover:bg-accent/5 transition-all"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <Camera className="h-6 w-6 text-accent" />
                                        <span className="text-xs font-medium">Take Photo</span>
                                    </div>
                                </Button>
                                
                                {/* Choose from Gallery Button */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => galleryInputRef.current?.click()}
                                    className="h-20 border-2 border-dashed border-accent/50 hover:border-accent hover:bg-accent/5 transition-all"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <ImageIcon className="h-6 w-6 text-accent" />
                                        <span className="text-xs font-medium">From Gallery</span>
                                    </div>
                                </Button>
                            </div>
                            
                            {/* Hidden file input for gallery - outside modal */}
                            <input
                                ref={galleryInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleGallerySelect}
                                className="hidden"
                            />
                            
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
                    
                    {loadingBadges ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Loading badges...</span>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-wrap gap-2">
                                {/* No Badge Option */}
                                <button
                                    type="button"
                                    onClick={() => setBadgeType(null)}
                                    className={`px-2.5 sm:px-3 py-2 rounded-lg text-sm border-2 transition-all duration-200 flex items-center gap-1.5 sm:gap-2 ${
                                        badgeType === null
                                            ? 'border-accent bg-accent/10 text-accent font-medium ring-2 ring-accent/20'
                                            : 'border-border bg-secondary/30 hover:bg-secondary/50 hover:border-accent/50'
                                    }`}
                                >
                                    <span className="text-base">➖</span>
                                    <span className="whitespace-nowrap">No Badge</span>
                                </button>
                                
                                {/* Dynamic Badges from Database */}
                                {statusBadges.map(badge => (
                                    <div key={badge.id} className="relative group">
                                        <button
                                            type="button"
                                            onClick={() => setBadgeType(badge.name)}
                                            className={`px-2.5 sm:px-3 py-2 rounded-lg text-sm border-2 transition-all duration-200 flex items-center gap-1.5 sm:gap-2 ${
                                                badgeType === badge.name
                                                    ? 'border-accent bg-accent/10 text-accent font-medium ring-2 ring-accent/20'
                                                    : 'border-border bg-secondary/30 hover:bg-secondary/50 hover:border-accent/50'
                                            }`}
                                        >
                                            <span className="text-base">{badge.emoji}</span>
                                            <span className="whitespace-nowrap">{badge.label}</span>
                                        </button>
                                        {/* Delete button for custom badges */}
                                        {!badge.is_default && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDeleteBadge(badge)
                                                }}
                                                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                                                title="Delete badge"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                
                                {/* Create New Badge Button - Only show in create mode */}
                                {mode === 'create' && (
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateBadge(true)}
                                        className="px-3 py-2 rounded-lg text-sm border-2 border-dashed border-accent/50 hover:border-accent hover:bg-accent/5 transition-all duration-200 flex items-center gap-1.5 sm:gap-2 text-accent min-w-fit"
                                    >
                                        <Plus className="h-4 w-4 flex-shrink-0" />
                                        <span className="whitespace-nowrap">New Badge</span>
                                    </button>
                                )}
                            </div>
                            
                            {/* Create Badge Form - Only show in create mode */}
                            {mode === 'create' && showCreateBadge && (
                                <div className="mt-4 p-4 rounded-lg border border-accent/30 bg-accent/5">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-medium">Create New Badge</h4>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setShowCreateBadge(false)
                                                setNewBadgeLabel('')
                                                setNewBadgeEmoji('🏷️')
                                                setBadgeError(null)
                                            }}
                                            className="h-8 w-8 p-0"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    
                                    {/* Same layout for mobile and desktop - all in one row */}
                                    <div className="flex gap-2 items-end">
                                        <div className="flex-1">
                                            <label className="block text-xs text-muted-foreground mb-1">Label</label>
                                            <Input
                                                value={newBadgeLabel}
                                                onChange={(e) => setNewBadgeLabel(e.target.value)}
                                                placeholder="e.g., Staff Pick"
                                                className="h-9"
                                            />
                                        </div>
                                        <div className="w-16">
                                            <label className="block text-xs text-muted-foreground mb-1">Emoji</label>
                                            <Input
                                                value={newBadgeEmoji}
                                                onChange={(e) => {
                                                    const value = e.target.value
                                                    // Simple approach: just take first few characters
                                                    setNewBadgeEmoji(value.slice(0, 4))
                                                }}
                                                placeholder="🏷️"
                                                className="h-9 text-center"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={handleCreateBadge}
                                            disabled={creatingBadge || !newBadgeLabel.trim()}
                                            size="sm"
                                            className="h-9 px-3"
                                        >
                                            {creatingBadge ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                'Add'
                                            )}
                                        </Button>
                                    </div>
                                    {badgeError && (
                                        <p className="text-destructive text-xs mt-2">{badgeError}</p>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                    
                    {badgeType && (
                        <div className="mt-3 p-3 rounded-lg bg-accent/5 border border-accent/20">
                            <p className="text-sm text-accent font-medium">
                                ✓ Badge &quot;{statusBadges.find(b => b.name === badgeType)?.label || badgeType}&quot; will be displayed on this book
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
