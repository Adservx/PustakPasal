export type BadgeType = string | null;

export interface Book {
    id: string;
    title: string;
    author: string;
    coverUrl: string;
    rating: number;
    reviewCount: number;
    price: {
        hardcover?: number;
        paperback?: number;
        ebook?: number;
        audiobook?: number;
    };
    formats: Array<'hardcover' | 'paperback' | 'ebook' | 'audiobook'>;
    readingTime: number; // in minutes
    genres: string[];
    description: string;
    excerpt: string;
    publishDate: string;
    publisher: string;
    pages?: number;
    isbn?: string;
    series?: {
        name: string;
        order: number;
        totalBooks: number;
    };
    tags: string[];
    isBestseller?: boolean;
    isNew?: boolean;
    badgeType?: BadgeType;
    mood?: string[];
}

export interface CartItem {
    bookId: string;
    format: 'hardcover' | 'paperback' | 'ebook' | 'audiobook';
    quantity: number;
    price: number;
}

export interface WishlistItem {
    bookId: string;
    addedAt: Date;
}

export interface ReadingProgress {
    bookId: string;
    progress: number; // 0-100
    currentPage: number;
    totalPages: number;
    startedAt: Date;
    lastReadAt: Date;
}
