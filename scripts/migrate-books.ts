
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { randomUUID } from 'crypto';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials. Please check your .env.local file.');
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (preferred) or NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Local files to upload
const LOCAL_FILES = [
    'muna-madan.png',
    'palpasa-cafe.png',
    'karnali-blues.png',
    'seto-dharti.png',
    'sirish-ko-phool.png',
    'china-harayeko-manche.png',
    'jiwan-kada-ki-phool.png',
    'radha.png',
    'summer-love.png',
    'pagal-basti.png'
];

// Data generation constants
const GENRES = [
    'Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 'Romance',
    'Historical Fiction', 'Literary Fiction', 'Non-Fiction', 'Biography', 'Self-Help',
    'Business', 'Science', 'History', 'Philosophy', 'Psychology', 'Young Adult', 'Children'
];

const MOODS = [
    { name: 'Adventurous', emoji: '🗺️', color: 'from-orange-500 to-red-500' },
    { name: 'Contemplative', emoji: '🤔', color: 'from-purple-500 to-blue-500' },
    { name: 'Joyful', emoji: '😊', color: 'from-yellow-400 to-pink-400' },
    { name: 'Mysterious', emoji: '🔍', color: 'from-gray-700 to-purple-900' },
    { name: 'Romantic', emoji: '💕', color: 'from-pink-400 to-rose-600' },
    { name: 'Thrilling', emoji: '⚡', color: 'from-red-600 to-orange-600' },
    { name: 'Peaceful', emoji: '🌊', color: 'from-blue-300 to-teal-400' },
    { name: 'Inspiring', emoji: '✨', color: 'from-amber-400 to-orange-500' },
    { name: 'Dark', emoji: '🌑', color: 'from-gray-800 to-black' },
    { name: 'Whimsical', emoji: '🎨', color: 'from-purple-400 to-pink-500' },
    { name: 'Nostalgic', emoji: '📸', color: 'from-amber-500 to-brown-500' },
    { name: 'Energetic', emoji: '⚡', color: 'from-green-400 to-cyan-500' },
    { name: 'Cozy', emoji: '☕', color: 'from-orange-300 to-amber-400' },
    { name: 'Epic', emoji: '⚔️', color: 'from-red-700 to-purple-700' },
    { name: 'Melancholic', emoji: '🌧️', color: 'from-gray-500 to-blue-600' },
    { name: 'Curious', emoji: '🔬', color: 'from-cyan-500 to-blue-600' },
    { name: 'Witty', emoji: '😄', color: 'from-yellow-500 to-green-500' },
    { name: 'Reflective', emoji: '🪞', color: 'from-indigo-400 to-purple-500' },
    { name: 'Hopeful', emoji: '🌅', color: 'from-orange-400 to-pink-400' },
    { name: 'Magical', emoji: '✨', color: 'from-purple-500 to-pink-600' }
];

async function uploadImages() {
    console.log('📦 Starting image upload...');
    const bucketName = 'book-covers';
    const uploadedUrls: Record<string, string> = {};

    // Check if bucket exists, create if not
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

    let bucketExists = false;
    if (bucketError) {
        console.warn('Warning listing buckets (might be permissions):', bucketError.message);
        // Assume it might exist or we'll fail at upload
    } else {
        bucketExists = !!buckets.find(b => b.name === bucketName);
    }

    if (!bucketExists) {
        console.log(`Attempting to create bucket: ${bucketName}`);
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
            public: true
        });
        if (createError) {
            console.warn('Warning creating bucket (might already exist or permission issue):', createError.message);
        } else {
            console.log('✅ Bucket created successfully');
        }
    } else {
        console.log('ℹ️ Bucket "book-covers" already exists, proceeding...');
    }

    for (const fileName of LOCAL_FILES) {
        const filePath = path.join(process.cwd(), 'public', 'books', fileName);

        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️ File not found: ${filePath}`);
            continue;
        }

        const fileBuffer = fs.readFileSync(filePath);
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, fileBuffer, {
                contentType: 'image/png',
                upsert: true
            });

        if (error) {
            console.error(`❌ Failed to upload ${fileName}:`, error.message);
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(fileName);

            uploadedUrls[fileName] = publicUrl;
            console.log(`✅ Uploaded ${fileName}`);
        }
    }

    return uploadedUrls;
}

function generateBooks(coverUrls: Record<string, string>) {
    console.log('📚 Generating book data...');

    // Helper to get cover URL
    const getCover = (filename: string) => coverUrls[filename] || `/books/${filename}`;

    const books = [
        {
            id: randomUUID(),
            title: 'Muna Madan',
            author: 'Laxmi Prasad Devkota',
            cover_url: getCover('muna-madan.png'),
            rating: 4.9,
            review_count: 15420,
            price_hardcover: 500,
            price_paperback: 350,
            price_ebook: 150,
            price_audiobook: 100,
            formats: ['hardcover', 'paperback', 'ebook', 'audiobook'],
            reading_time: 120,
            genres: ['Poetry', 'Tragedy', 'Romance'],
            description: 'Muna Madan is a short epic narrative poem by Laxmi Prasad Devkota. It is one of the most popular works in Nepali literature.',
            excerpt: 'Ishwar taila banayera, ke garyou manchhe lai? Ke garyou manchhe lai? ...',
            publish_date: '1936-01-01',
            publisher: 'Sajha Prakashan',
            pages: 60,
            isbn: '978-9937209876',
            tags: ['Classic', 'Poetry', 'Must Read'],
            is_bestseller: true,
            is_new: false,
            mood: ['Melancholic', 'Romantic', 'Inspiring'],
        },
        {
            id: randomUUID(),
            title: 'Palpasa Cafe',
            author: 'Narayan Wagle',
            cover_url: getCover('palpasa-cafe.png'),
            rating: 4.7,
            review_count: 8924,
            price_hardcover: 800,
            price_paperback: 550,
            price_ebook: 300,
            formats: ['hardcover', 'paperback', 'ebook'],
            reading_time: 350,
            genres: ['Fiction', 'Historical', 'War'],
            description: 'Palpasa Cafe tells the story of an artist, Drishya, during the height of the Nepali Civil War. It explores the effects of the war on ordinary people.',
            excerpt: 'Drishya sat in the cafe, watching the rain wash away the dust of Kathmandu...',
            publish_date: '2005-01-01',
            publisher: 'Nepalaya',
            pages: 245,
            isbn: '978-9937802107',
            tags: ['Civil War', 'Art', 'Bestseller'],
            is_bestseller: true,
            is_new: false,
            mood: ['Contemplative', 'Melancholic', 'Reflective'],
        },
        {
            id: randomUUID(),
            title: 'Karnali Blues',
            author: 'Buddhisagar',
            cover_url: getCover('karnali-blues.png'),
            rating: 4.8,
            review_count: 12500,
            price_hardcover: 750,
            price_paperback: 450,
            price_ebook: 250,
            formats: ['hardcover', 'paperback', 'ebook'],
            reading_time: 400,
            genres: ['Fiction', 'Coming of Age', 'Regional'],
            description: 'Karnali Blues is a story about a young boy\'s relationship with his father, set against the backdrop of the Karnali region.',
            excerpt: 'My father\'s face is like a map of Karnali...',
            publish_date: '2010-08-01',
            publisher: 'FinePrint',
            pages: 400,
            isbn: '978-9937828855',
            tags: ['Fatherhood', 'Regional', 'Touching'],
            is_bestseller: true,
            is_new: false,
            mood: ['Nostalgic', 'Emotional', 'Hopeful'],
        },
        {
            id: randomUUID(),
            title: 'Seto Dharti',
            author: 'Amar Neupane',
            cover_url: getCover('seto-dharti.png'),
            rating: 4.6,
            review_count: 9800,
            price_hardcover: 650,
            price_paperback: 400,
            price_ebook: 200,
            formats: ['hardcover', 'paperback', 'ebook'],
            reading_time: 380,
            genres: ['Fiction', 'Social', 'Drama'],
            description: 'Seto Dharti depicts the life of a child widow in Nepal, exploring themes of tradition, pain, and resilience.',
            excerpt: 'The white saree was not just a piece of cloth; it was a shroud for my dreams...',
            publish_date: '2012-03-01',
            publisher: 'FinePrint',
            pages: 380,
            isbn: '978-9937856414',
            tags: ['Madan Puraskar', 'Social Issue', 'Women'],
            is_bestseller: true,
            is_new: false,
            mood: ['Melancholic', 'Reflective', 'Inspiring'],
        },
        {
            id: randomUUID(),
            title: 'Sirish Ko Phool',
            author: 'Parijat',
            cover_url: getCover('sirish-ko-phool.png'),
            rating: 4.5,
            review_count: 11200,
            price_hardcover: 400,
            price_paperback: 250,
            price_ebook: 100,
            formats: ['hardcover', 'paperback', 'ebook'],
            reading_time: 150,
            genres: ['Fiction', 'Philosophy', 'Existentialism'],
            description: 'Sirish Ko Phool (Blue Mimosa) is a masterpiece of Nepali literature, exploring the absurdity of life and human existence.',
            excerpt: 'Sakambari, why do you look at the Blue Mimosa with such intensity?',
            publish_date: '1964-01-01',
            publisher: 'Sajha Prakashan',
            pages: 120,
            isbn: '978-9993320215',
            tags: ['Classic', 'Existential', 'Masterpiece'],
            is_bestseller: true,
            is_new: false,
            mood: ['Contemplative', 'Dark', 'Philosophical'],
        },
        {
            id: randomUUID(),
            title: 'China Harayeko Manche',
            author: 'Hari Bansha Acharya',
            cover_url: getCover('china-harayeko-manche.png'),
            rating: 4.8,
            review_count: 25000,
            price_hardcover: 600,
            price_paperback: 450,
            price_ebook: 200,
            formats: ['hardcover', 'paperback', 'ebook'],
            reading_time: 300,
            genres: ['Autobiography', 'Memoir', 'Humor'],
            description: 'The autobiography of Nepal\'s most beloved comedian, Hari Bansha Acharya, detailing his life, struggles, and journey to stardom.',
            excerpt: 'I was a man who had lost his china (mark)...',
            publish_date: '2013-01-01',
            publisher: 'FinePrint',
            pages: 300,
            isbn: '978-9937866659',
            tags: ['Bestseller', 'Biography', 'Inspiring'],
            is_bestseller: true,
            is_new: false,
            mood: ['Joyful', 'Emotional', 'Inspiring'],
        },
        {
            id: randomUUID(),
            title: 'Jiwan Kada Ki Phool',
            author: 'Jhamak Ghimire',
            cover_url: getCover('jiwan-kada-ki-phool.png'),
            rating: 4.9,
            review_count: 18000,
            price_hardcover: 550,
            price_paperback: 350,
            price_ebook: 150,
            formats: ['hardcover', 'paperback', 'ebook'],
            reading_time: 250,
            genres: ['Autobiography', 'Literature', 'Inspirational'],
            description: 'An inspiring autobiography of Jhamak Ghimire, a writer born with cerebral palsy who wrote this masterpiece with her foot.',
            excerpt: 'Is life a thorn or a flower?',
            publish_date: '2010-01-01',
            publisher: 'Sajha Prakashan',
            pages: 250,
            isbn: '978-9993320628',
            tags: ['Madan Puraskar', 'Inspirational', 'Must Read'],
            is_bestseller: true,
            is_new: false,
            mood: ['Inspiring', 'Emotional', 'Hopeful'],
        },
        {
            id: randomUUID(),
            title: 'Radha',
            author: 'Krishna Dharabasi',
            cover_url: getCover('radha.png'),
            rating: 4.6,
            review_count: 14000,
            price_hardcover: 650,
            price_paperback: 450,
            price_ebook: 250,
            formats: ['hardcover', 'paperback', 'ebook'],
            reading_time: 320,
            genres: ['Fiction', 'Mythology', 'Postmodern'],
            description: 'A postmodern retelling of the Radha-Krishna mythology, focusing on Radha\'s perspective and her waiting.',
            excerpt: 'Krishna, you are the world to everyone, but for me, you are just my Krishna...',
            publish_date: '2005-01-01',
            publisher: 'Pairavi Prakashan',
            pages: 350,
            isbn: '978-9993320550',
            tags: ['Madan Puraskar', 'Mythology', 'Love'],
            is_bestseller: true,
            is_new: false,
            mood: ['Romantic', 'Philosophical', 'Melancholic'],
        },
        {
            id: randomUUID(),
            title: 'Summer Love',
            author: 'Subin Bhattarai',
            cover_url: getCover('summer-love.png'),
            rating: 4.4,
            review_count: 30000,
            price_hardcover: 500,
            price_paperback: 350,
            price_ebook: 150,
            formats: ['hardcover', 'paperback', 'ebook'],
            reading_time: 200,
            genres: ['Romance', 'Young Adult', 'Fiction'],
            description: 'A modern love story that captured the hearts of Nepali youth, following the journey of Atit and Saaya.',
            excerpt: 'Love happens only once, the rest is just life...',
            publish_date: '2012-12-01',
            publisher: 'FinePrint',
            pages: 280,
            isbn: '978-9937866628',
            tags: ['Bestseller', 'Romance', 'Youth'],
            is_bestseller: true,
            is_new: false,
            mood: ['Romantic', 'Emotional', 'Nostalgic'],
        },
        {
            id: randomUUID(),
            title: 'Pagal Basti',
            author: 'Saru Bhakta',
            cover_url: getCover('pagal-basti.png'),
            rating: 4.7,
            review_count: 9500,
            price_hardcover: 450,
            price_paperback: 300,
            price_ebook: 150,
            formats: ['hardcover', 'paperback', 'ebook'],
            reading_time: 220,
            genres: ['Fiction', 'Philosophy', 'Drama'],
            description: 'A narrative set in Ghandruk, exploring the psyche of the characters and the concept of madness.',
            excerpt: 'In this settlement of madmen, who is truly sane?',
            publish_date: '1991-01-01',
            publisher: 'Sajha Prakashan',
            pages: 230,
            isbn: '978-9993320116',
            tags: ['Madan Puraskar', 'Classic', 'Psychological'],
            is_bestseller: true,
            is_new: false,
            mood: ['Contemplative', 'Mysterious', 'Dark'],
        },
    ];

    // Generate 95 more books
    const additionalTitles = [
        'Summer Love', 'Saaya', 'China Harayeko Manche', 'Jiwan Kada Ki Phool', 'Radha',
        'Pagalbasti', 'Ghumne Mechmathi Andho Manche', 'Khushi', 'Damini Bhir', 'Loo',
        'Karodau Kasturi', 'Firfire', 'Yogmaya', 'Ranahar', 'Maharani',
        'Ek Sarko Maya', 'Priya Sufi', 'Singha Durbar', 'Langada Ko Sathi', 'Basain'
    ];

    const nepaliAuthors = [
        'Subin Bhattarai', 'Hari Bansha Acharya', 'Jhamak Ghimire', 'Krishna Dharabasi',
        'Saru Bhakta', 'Bhupi Sherchan', 'Vijay Kumar', 'Rajan Mukarung', 'Nayan Raj Pandey',
        'Amar Neupane', 'Buddhisagar', 'Neelam Karki Niharika', 'Yogesh Raj', 'Chandra Prakash Baniya'
    ];

    const seededRandom = (seed: number) => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };

    for (let i = 0; i < 95; i++) {
        const seed = i + 100;
        const random = (offset: number) => seededRandom(seed + offset);
        const randomCoverFile = LOCAL_FILES[Math.floor(random(20) * LOCAL_FILES.length)];
        const titleIndex = i % additionalTitles.length;
        const authorIndex = i % nepaliAuthors.length;

        books.push({
            id: randomUUID(),
            title: additionalTitles[titleIndex],
            author: nepaliAuthors[authorIndex],
            cover_url: getCover(randomCoverFile),
            rating: 3.5 + random(1) * 1.5,
            review_count: Math.floor(random(2) * 50000),
            price_hardcover: 500 + Math.floor(random(3) * 1000),
            price_paperback: 300 + Math.floor(random(4) * 500),
            price_ebook: 100 + Math.floor(random(5) * 300),
            price_audiobook: random(6) > 0.3 ? 0 : undefined,
            formats: ['hardcover', 'paperback', 'ebook', random(7) > 0.3 ? 'audiobook' : 'paperback'] as any,
            reading_time: Math.floor(120 + random(8) * 400),
            genres: [GENRES[Math.floor(random(9) * GENRES.length)], GENRES[Math.floor(random(10) * GENRES.length)]],
            description: 'A captivating story from the heart of Nepal.',
            excerpt: 'The mountains whispered secrets that only the wind could understand...',
            publish_date: `20${15 + Math.floor(random(11) * 10)}-0${1 + Math.floor(random(12) * 9)}-${10 + Math.floor(random(13) * 18)}`,
            publisher: ['FinePrint', 'Nepalaya', 'Sajha Prakashan', 'Ratna Pustak Bhandar'][Math.floor(random(14) * 4)],
            pages: 200 + Math.floor(random(15) * 500),
            isbn: `978-${Math.floor(random(16) * 10000000000)}`,
            tags: ['Bestseller', 'Nepali Literature', 'Award Winner'].slice(0, Math.floor(random(16) * 3) + 1),
            is_bestseller: random(17) > 0.7,
            is_new: random(18) > 0.8,
            mood: MOODS.slice(0, Math.floor(random(19) * 4) + 1).map(m => m.name),
        });
    }

    return books;
}

async function migrate() {
    try {
        // 1. Upload images
        const coverUrls = await uploadImages();

        // 2. Generate book data with new URLs
        const books = generateBooks(coverUrls);

        // 3. Clear existing data
        console.log('🗑️ Clearing existing books...');
        const { data: existingBooks } = await supabase
            .from('books')
            .select('id');

        if (existingBooks && existingBooks.length > 0) {
            const { error: deleteError } = await supabase
                .from('books')
                .delete()
                .in('id', existingBooks.map(b => b.id));

            if (deleteError) {
                console.warn('Warning clearing books:', deleteError.message);
                console.log('Continuing with insert operation...');
            } else {
                console.log(`✅ Cleared ${existingBooks.length} existing books`);
            }
        }

        // 4. Insert new data
        console.log(`💾 Inserting ${books.length} books...`);
        const { error: insertError } = await supabase
            .from('books')
            .insert(books);

        if (insertError) {
            throw insertError;
        }

        console.log('✨ Migration completed successfully!');
        console.log('✅ All Unsplash images have been replaced with local covers.');
        console.log('✅ Database has been re-seeded with 105 books.');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrate();
