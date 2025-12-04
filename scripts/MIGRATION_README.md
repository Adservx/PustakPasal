# Book Migration Script

This script migrates your local book covers to Supabase Storage and repopulates the database with 105 books (10 classics + 95 generated), removing all Unsplash image references.

## Prerequisites

Before running the migration, you need to update your `.env.local` file:

### Required Environment Variables

```env
# Your Supabase project URL (already set)
NEXT_PUBLIC_SUPABASE_URL=your_url_here

# Your Supabase anonymous key (already set)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# **IMPORTANT:** Add this service role key for the migration
# Find it in: Supabase Dashboard > Project Settings > API > service_role key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Storage Bucket Setup

The migration will attempt to create a `book-covers` storage bucket. If you encounter RLS (Row-Level Security) errors:

1. Go to Supabase Dashboard > Storage
2. Create a new bucket named `book-covers`
3. Set it to **Public**
4. Disable RLS or add the following policy:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'book-covers');

-- Allow authenticated uploads
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'book-covers');
```

## Running the Migration

```bash
npm run migrate:books
```

## What the Script Does

1. **Uploads Images** (10 PNG files) → Supabase Storage `book-covers` bucket
2. **Generates Book Data** → 105 books with locally-stored cover URLs
3. **Clears Database** → Removes all existing books
4. **Seeds New Data** → Inserts fresh data with UUIDs and storage URLs

## After Migration

- All books will use Supabase Storage URLs
- No more Unsplash dependencies
- The `LOCAL_COVER_MAP` in `src/lib/supabase/books.ts` can be removed
- Your local `/public/books/*.png` files are still used as fallback

##Troubleshooting

### "Missing Supabase credentials"
Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`

### "new row violates row-level security policy"
Update storage bucket RLS policies (see above)

### "invalid input syntax for type uuid"
The script uses `randomUUID()` - this should work with modern Node.js (v14+)

### "Error clearing books"
Ensurethe service role key has proper permissions

## Manual Cleanup (if needed)

If the migration partially completes:

```sql
-- Clear all books
DELETE FROM books;

-- Clear all storage objects
DELETE FROM storage.objects WHERE bucket_id = 'book-covers';
```
