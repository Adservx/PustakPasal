import { createClient } from '@/lib/supabase/server';
import { Book } from '@/lib/types';
import { cache } from 'react';
import { mapBookData } from './books-shared';

// Server-side cached fetch - deduplicates requests during a single render
export const getBooks = cache(async (): Promise<Book[]> => {
    try {
        const supabase = await createClient();
        
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
});

export const getBookById = cache(async (id: string): Promise<Book | null> => {
    try {
        const supabase = await createClient();
        
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
});
