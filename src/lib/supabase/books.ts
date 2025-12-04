import { createClient } from '@/lib/supabase/client';
import { Book } from '@/lib/types';
import { MOCK_BOOKS } from '@/lib/data';
import { mapBookData } from './books-shared';

// Re-export mapBookData for backward compatibility
export { mapBookData } from './books-shared';

// Client-side fetch functions
export async function getBooks(): Promise<Book[]> {
    try {
        const supabase = createClient();
        
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.warn('Error fetching books from Supabase, falling back to mock data:', error);
            return MOCK_BOOKS;
        }

        if (!data || data.length === 0) {
            return MOCK_BOOKS;
        }

        return data.map(mapBookData);
    } catch (error) {
        console.error('Unexpected error fetching books, falling back to mock data:', error);
        return MOCK_BOOKS;
    }
}

export async function getBookById(id: string): Promise<Book | null> {
    try {
        const supabase = createClient();
        
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`Error fetching book ${id}:`, error);
            return null;
        }

        return mapBookData(data);
    } catch (error) {
        console.error(`Unexpected error fetching book ${id}:`, error);
        return null;
    }
}
