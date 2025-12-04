import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { deleteBook } from './actions'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, BookOpen, DollarSign, TrendingUp, Users, Package } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen pt-20 md:pt-40 px-4">
                <div className="text-center space-y-4 p-6 md:p-8 rounded-2xl glass-panel max-w-md w-full">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                        <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-destructive" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-destructive">Access Denied</h1>
                    <p className="text-sm md:text-base text-muted-foreground">You do not have permission to view this page.</p>
                    <Link href="/">
                        <Button variant="outline" className="mt-4">Go Home</Button>
                    </Link>
                </div>
            </div>
        )
    }

    const { data: books } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })

    // Calculate statistics
    const totalBooks = books?.length || 0
    const totalRevenue = books?.reduce((sum, book) => sum + (book.price_paperback || book.price_hardcover || 0), 0) || 0
    const bestsellersCount = books?.filter(book => book.is_bestseller)?.length || 0
    const newBooksCount = books?.filter(book => book.is_new)?.length || 0

    const stats = [
        {
            title: "Total Books",
            value: totalBooks,
            icon: BookOpen,
            description: `${newBooksCount} new this month`,
            trend: "+12%",
            color: "text-blue-500"
        },
        {
            title: "Bestsellers",
            value: bestsellersCount,
            icon: TrendingUp,
            description: "Top performing titles",
            trend: "+8%",
            color: "text-green-500"
        },
        {
            title: "Total Inventory Value",
            value: `Rs. ${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            description: "Across all books",
            trend: "+23%",
            color: "text-purple-500"
        },
        {
            title: "New This Month",
            value: newBooksCount,
            icon: Package,
            description: "Recently added",
            trend: "+15%",
            color: "text-orange-500"
        }
    ]

    return (
        <div className="min-h-screen bg-background pt-20 md:pt-32 pb-12 md:pb-20 px-4">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-8 md:mb-12">
                    <div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-2">Admin Dashboard</h1>
                        <p className="text-sm md:text-base text-muted-foreground">Manage your book collection and inventory</p>
                    </div>
                    <Link href="/admin/add">
                        <Button size="lg" className="gap-2 rounded-full shadow-lg w-full md:w-auto">
                            <Plus className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="hidden sm:inline">Add New Book</span>
                            <span className="sm:hidden">Add Book</span>
                        </Button>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="glass-panel rounded-2xl p-4 md:p-6 space-y-3 md:space-y-4 hover:shadow-xl transition-all hover:scale-105 duration-300">
                            <div className="flex items-center justify-between">
                                <div className={`p-2 md:p-3 rounded-xl bg-secondary/50 ${stat.color}`}>
                                    <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                                <span className="text-xs md:text-sm font-medium text-green-500">{stat.trend}</span>
                            </div>
                            <div>
                                <p className="text-xs md:text-sm text-muted-foreground mb-1">{stat.title}</p>
                                <p className="text-xl md:text-2xl lg:text-3xl font-bold">{stat.value}</p>
                                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Books Table */}
                <div className="glass-panel rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-4 md:p-6 border-b border-border/50 bg-secondary/20">
                        <h2 className="text-xl md:text-2xl font-serif font-bold">Book Inventory</h2>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1">
                            Manage and organize your collection
                        </p>
                    </div>

                    {!books || books.length === 0 ? (
                        <div className="text-center py-16 md:py-20">
                            <BookOpen className="w-12 h-12 md:w-16 md:h-16 mx-auto text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg md:text-xl font-serif font-bold mb-2">No books yet</h3>
                            <p className="text-sm md:text-base text-muted-foreground mb-6">Start by adding your first book</p>
                            <Link href="/admin/add">
                                <Button className="gap-2">
                                    <Plus className="w-4 h-4 md:w-5 md:h-5" /> Add Book
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-secondary/50 border-b border-border/50">
                                        <tr>
                                            <th className="p-4 text-left font-semibold text-xs md:text-sm uppercase tracking-wider">Cover</th>
                                            <th className="p-4 text-left font-semibold text-xs md:text-sm uppercase tracking-wider">Title</th>
                                            <th className="p-4 text-left font-semibold text-xs md:text-sm uppercase tracking-wider">Author</th>
                                            <th className="p-4 text-left font-semibold text-xs md:text-sm uppercase tracking-wider">Price</th>
                                            <th className="p-4 text-left font-semibold text-xs md:text-sm uppercase tracking-wider">Status</th>
                                            <th className="p-4 text-right font-semibold text-xs md:text-sm uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {books?.map((book) => (
                                            <tr key={book.id} className="hover:bg-secondary/30 transition-colors">
                                                <td className="p-4">
                                                    <div className="relative w-12 h-16 rounded-lg overflow-hidden shadow-md">
                                                        <img
                                                            src={book.cover_url}
                                                            alt={book.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-medium max-w-xs truncate">{book.title}</div>
                                                </td>
                                                <td className="p-4 text-muted-foreground">{book.author}</td>
                                                <td className="p-4">
                                                    <span className="font-semibold">Rs. {book.price_paperback || book.price_hardcover}</span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex gap-2">
                                                        {book.is_bestseller && (
                                                            <Badge variant="secondary" className="text-xs">Bestseller</Badge>
                                                        )}
                                                        {book.is_new && (
                                                            <Badge variant="outline" className="text-xs">New</Badge>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex gap-2 justify-end">
                                                        <Link href={`/admin/edit/${book.id}`}>
                                                            <Button variant="ghost" size="sm" className="gap-1">
                                                                <Edit className="w-4 h-4" /> Edit
                                                            </Button>
                                                        </Link>
                                                        <form action={deleteBook.bind(null, book.id)}>
                                                            <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive">
                                                                <Trash2 className="w-4 h-4" /> Delete
                                                            </Button>
                                                        </form>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden divide-y divide-border/50">
                                {books?.map((book) => (
                                    <div key={book.id} className="p-4 hover:bg-secondary/30 transition-colors">
                                        <div className="flex gap-4">
                                            <div className="relative w-16 h-24 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                                                <img
                                                    src={book.cover_url}
                                                    alt={book.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0 space-y-2">
                                                <div>
                                                    <h3 className="font-medium truncate">{book.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{book.author}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-sm">Rs. {book.price_paperback || book.price_hardcover}</span>
                                                    {book.is_bestseller && (
                                                        <Badge variant="secondary" className="text-xs">Bestseller</Badge>
                                                    )}
                                                    {book.is_new && (
                                                        <Badge variant="outline" className="text-xs">New</Badge>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Link href={`/admin/edit/${book.id}`} className="flex-1">
                                                        <Button variant="outline" size="sm" className="w-full gap-1">
                                                            <Edit className="w-4 h-4" /> Edit
                                                        </Button>
                                                    </Link>
                                                    <form action={deleteBook.bind(null, book.id)} className="flex-1">
                                                        <Button variant="outline" size="sm" className="w-full gap-1 text-destructive hover:text-destructive border-destructive/20">
                                                            <Trash2 className="w-4 h-4" /> Delete
                                                        </Button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
