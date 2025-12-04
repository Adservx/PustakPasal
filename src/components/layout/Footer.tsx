import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function Footer() {
    return (
        <footer className="w-full border-t bg-background pt-16 pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-serif font-bold text-gradient">
                            Hamro Pustak Pasal
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Your digital gateway to a world of stories. We believe in the magic of reading and connecting people with their next favorite book.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-lg">Explore</h4>
                        <ul className="space-y-2">
                            <li><Link href="/books" className="text-muted-foreground hover:text-primary transition-colors">All Books</Link></li>
                            <li><Link href="/bestsellers" className="text-muted-foreground hover:text-primary transition-colors">Bestsellers</Link></li>
                            <li><Link href="/new-arrivals" className="text-muted-foreground hover:text-primary transition-colors">New Arrivals</Link></li>
                            <li><Link href="/collections" className="text-muted-foreground hover:text-primary transition-colors">Collections</Link></li>
                            <li><Link href="/gift-cards" className="text-muted-foreground hover:text-primary transition-colors">Gift Cards</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-lg">Support</h4>
                        <ul className="space-y-2">
                            <li><Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link href="/returns" className="text-muted-foreground hover:text-primary transition-colors">Returns & Refunds</Link></li>
                            <li><Link href="/shipping" className="text-muted-foreground hover:text-primary transition-colors">Shipping Info</Link></li>
                            <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
                            <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-lg">Stay Updated</h4>
                        <p className="text-muted-foreground">Subscribe to get the latest book news and exclusive offers.</p>
                        <div className="flex gap-2">
                            <Input placeholder="Enter your email" className="bg-background/50 border-border rounded-full focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-accent/50" />
                            <Button className="rounded-full">Subscribe</Button>
                        </div>
                        <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" /> hello@hamropustak.com
                            </div>
                        </div>

                        {/* Branch Information */}
                        <div className="pt-4 space-y-3">
                            <div className="p-3 rounded-lg glass-card border border-border/50">
                                <h5 className="font-semibold text-sm text-foreground mb-1">Kathmandu Branch</h5>
                                <div className="space-y-1 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-3.5 w-3.5 text-accent" /> Kathmandu, Nepal
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-3.5 w-3.5 text-accent" /> +977 1-4567890
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 rounded-lg glass-card border border-border/50">
                                <h5 className="font-semibold text-sm text-foreground mb-1">Birganj Branch</h5>
                                <div className="space-y-1 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-3.5 w-3.5 text-accent" /> Birganj, Nepal
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-3.5 w-3.5 text-accent" /> +977 51-234567
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="mb-8" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© 2025 Hamro Pustak Pasal. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/terms" className="hover:text-foreground">Terms</Link>
                        <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
                        <Link href="/cookies" className="hover:text-foreground">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
