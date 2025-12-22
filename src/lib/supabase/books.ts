import { createClient } from '@/lib/supabase/client';
import { Book } from '@/lib/types';
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
            console.error('Error fetching books from Supabase:', error);
            return [];
        }

        if (!data || data.length === 0) {
            return [];
        }

        return data.map(mapBookData);
    } catch (error) {
        console.error('Unexpected error fetching books:', error);
        return [];
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
